import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// --- Carga de Imágenes ---

export async function uploadProfesionalImage(file, profesionalId) {
    if (!file) return null;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Solo se permiten imágenes (JPG, PNG, WebP)');
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('La imagen no debe superar 5MB');
    }
    
    const timestamp = new Date().getTime();
    const extension = file.name.split('.').pop();
    const fileName = `profesionales/${profesionalId}_${timestamp}.${extension}`;
    
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
}

export async function deleteProfesionalImage(imageUrl) {
    if (!imageUrl) return;
    try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
    } catch (error) {
        console.warn('Error al eliminar imagen:', error);
    }
}

// --- Áreas ---

export async function getAreas() {
    const snapshot = await getDocs(collection(db, "areas"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveArea(area) {
    if (!area.id) area.id = crypto.randomUUID();
    await setDoc(doc(db, "areas", area.id), { nombre: area.nombre, icono: area.icono });
    return area;
}

export async function deleteArea(id) {
    await deleteDoc(doc(db, "areas", id));
    // Borrar profesionales asociados
    const q = query(collection(db, "profesionales"), where("areaId", "==", id));
    const snapshot = await getDocs(q);
    const deletes = snapshot.docs.map(async (d) => {
        if (d.data().foto_url) {
            await deleteProfesionalImage(d.data().foto_url);
        }
        return deleteDoc(doc(db, "profesionales", d.id));
    });
    await Promise.all(deletes);
}

// --- Profesionales ---

export async function getProfesionales() {
    const snapshot = await getDocs(collection(db, "profesionales"));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getProfesionalesByArea(areaId) {
    const q = query(collection(db, "profesionales"), where("areaId", "==", areaId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveProfesional(profesional) {
    if (!profesional.id) profesional.id = crypto.randomUUID();
    const { id, ...data } = profesional;
    await setDoc(doc(db, "profesionales", id), data);
    return profesional;
}

export async function deleteProfesional(id) {
    const professionals = await getProfesionales();
    const prof = professionals.find(p => p.id === id);
    if (prof && prof.foto_url) {
        await deleteProfesionalImage(prof.foto_url);
    }
    await deleteDoc(doc(db, "profesionales", id));
}

export function generateUUID() {
    return crypto.randomUUID();
}
