import { login, logout, isLoggedIn } from './auth.js';
import { uploadToCloudinary } from './cloudinary.js';
import { 
    getAreas, saveArea, deleteArea, getProfesionales, 
    saveProfesional, deleteProfesional, generateUUID,
    uploadProfesionalImage, deleteProfesionalImage 
} from './storage.js';

let editingAreaId = null;
let editingProfessionalId = null;
let uploadingImage = false;

let loginScreen, loginForm, passwordInput, loginError;
let adminPanel, logoutButton, showAreasButton, showProfessionalsButton;
let areaManagementSection, areaForm, areaNameInput, areaIconInput, saveAreaButton, areasList;
let professionalManagementSection, filterAreaProfSelect, addProfessionalButton;
let professionalFormContainer, professionalForm, professionalIdInput;
let profNameInput, profPhoneInput, profEmailInput, profDescriptionInput;
let profAreaSelect, profFotoInput, profFotoPreview, profActivoInput, cancelProfessionalButton, professionalsTableBody;
let toastNotification, toastMessage;
let customModal, modalMessage, modalConfirmButton, modalCancelButton;

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = 'success', duration = 3000) {
    toastMessage.textContent = message;
    toastNotification.className = 'toast-notification ' + type;
    toastNotification.style.display = 'block';
    setTimeout(() => { toastNotification.style.display = 'none'; }, duration);
}

function showCustomModal(message) {
    return new Promise(resolve => {
        modalMessage.textContent = message;
        customModal.style.display = 'flex';
        const confirmHandler = () => {
            customModal.style.display = 'none';
            modalConfirmButton.removeEventListener('click', confirmHandler);
            modalCancelButton.removeEventListener('click', cancelHandler);
            resolve(true);
        };
        const cancelHandler = () => {
            customModal.style.display = 'none';
            modalConfirmButton.removeEventListener('click', confirmHandler);
            modalCancelButton.removeEventListener('click', cancelHandler);
            resolve(false);
        };
        modalConfirmButton.addEventListener('click', confirmHandler);
        modalCancelButton.addEventListener('click', cancelHandler);
    });
}

function checkAuth() {
    if (isLoggedIn()) {
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'flex';
        showAreasManagement();
    } else {
        loginScreen.style.display = 'block';
        adminPanel.style.display = 'none';
    }
}

function setActiveSidebarButton(activeButton) {
    document.querySelectorAll('.sidebar__nav a').forEach(b => b.classList.remove('active'));
    activeButton.classList.add('active');
}

function showAreasManagement() {
    professionalManagementSection.style.display = 'none';
    areaManagementSection.style.display = 'block';
    renderAreas();
    setActiveSidebarButton(showAreasButton);
}

function showProfessionalsManagement() {
    areaManagementSection.style.display = 'none';
    professionalManagementSection.style.display = 'block';
    renderProfessionalsTable();
    populateAreaSelects();
    setActiveSidebarButton(showProfessionalsButton);
}

// --- Áreas ---

async function renderAreas() {
    areasList.innerHTML = '<li>Cargando...</li>';
    const areas = await getAreas();
    areasList.innerHTML = '';

    if (areas.length === 0) {
        areasList.innerHTML = '<p>No hay áreas creadas.</p>';
        return;
    }

    areas.forEach(area => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-list__info">
                <span>${area.icono}</span>
                <span>${area.nombre}</span>
            </div>
            <div class="item-list__actions">
                <button class="action-button edit-button" data-id="${area.id}">Editar</button>
                <button class="action-button delete-button" data-id="${area.id}">Eliminar</button>
            </div>
        `;
        areasList.appendChild(li);
    });
}

// --- Profesionales ---

async function populateAreaSelects() {
    const areas = await getAreas();
    const optionsHtml = areas.map(a => `<option value="${a.id}">${a.icono} ${a.nombre}</option>`).join('');

    const currentFilter = filterAreaProfSelect.value;
    filterAreaProfSelect.innerHTML = '<option value="all">Todas</option>' + optionsHtml;
    filterAreaProfSelect.value = areas.some(a => a.id === currentFilter) ? currentFilter : 'all';

    const currentArea = profAreaSelect.value;
    profAreaSelect.innerHTML = optionsHtml;
    profAreaSelect.value = areas.some(a => a.id === currentArea) ? currentArea : (areas[0]?.id || '');
}

async function renderProfessionalsTable() {
    professionalsTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando...</td></tr>';
    const [areas, allProfessionals] = await Promise.all([getAreas(), getProfesionales()]);

    let professionals = allProfessionals;
    if (filterAreaProfSelect.value !== 'all') {
        professionals = professionals.filter(p => p.areaId === filterAreaProfSelect.value);
    }

    professionalsTableBody.innerHTML = '';

    if (professionals.length === 0) {
        professionalsTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay profesionales para mostrar.</td></tr>';
        return;
    }

    professionals.forEach(prof => {
        const area = areas.find(a => a.id === prof.areaId);
        const areaName = area ? area.nombre : 'Desconocida';
        const activo = prof.activo !== false;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                ${prof.foto_url
                    ? `<img src="${prof.foto_url}" alt="${prof.nombre}" class="avatar-small">`
                    : `<div class="avatar-small avatar-small--default">${prof.nombre.charAt(0)}</div>`
                }
            </td>
            <td>${prof.nombre}</td>
            <td>${prof.telefono || '-'}</td>
            <td>${prof.email || '-'}</td>
            <td>
                <span style="
                    display:inline-block;
                    padding:3px 10px;
                    border-radius:20px;
                    font-size:0.85em;
                    font-weight:600;
                    background:${activo ? '#d4edda' : '#f8d7da'};
                    color:${activo ? '#155724' : '#721c24'};
                ">
                    ${activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button class="action-button edit-button" data-id="${prof.id}">Editar</button>
                <button class="action-button delete-button" data-id="${prof.id}">Eliminar</button>
            </td>
        `;
        professionalsTableBody.appendChild(tr);
    });
}

// --- Manejo de Imágenes ---

function handleImagePreview(event) {
    const file = event.target.files[0];
    if (file) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            showToast('Solo JPG, PNG y WebP', 'error');
            profFotoInput.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('Imagen máximo 5MB', 'error');
            profFotoInput.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            profFotoPreview.src = e.target.result;
            profFotoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
    loginScreen = document.getElementById('login-screen');
    loginForm = document.getElementById('login-form');
    passwordInput = document.getElementById('password');
    loginError = document.getElementById('login-error');

    adminPanel = document.getElementById('admin-panel');
    logoutButton = document.getElementById('logout-button');
    showAreasButton = document.getElementById('show-areas');
    showProfessionalsButton = document.getElementById('show-professionals');

    areaManagementSection = document.getElementById('area-management');
    areaForm = document.getElementById('area-form');
    areaNameInput = document.getElementById('area-name');
    areaIconInput = document.getElementById('area-icon');
    saveAreaButton = document.getElementById('save-area-button');
    areasList = document.getElementById('areas-list');

    professionalManagementSection = document.getElementById('professional-management');
    filterAreaProfSelect = document.getElementById('filter-area-prof');
    addProfessionalButton = document.getElementById('add-professional-button');
    professionalFormContainer = document.getElementById('professional-form-container');
    professionalForm = document.getElementById('professional-form');
    professionalIdInput = document.getElementById('professional-id');
    profNameInput = document.getElementById('prof-name');
    profPhoneInput = document.getElementById('prof-phone');
    profEmailInput = document.getElementById('prof-email');
    profDescriptionInput = document.getElementById('prof-description');
    profAreaSelect = document.getElementById('prof-area');
    profFotoInput = document.getElementById('prof-foto-file');
    profFotoPreview = document.getElementById('prof-foto-preview');
    profActivoInput = document.getElementById('prof-activo');
    cancelProfessionalButton = document.getElementById('cancel-professional-button');
    professionalsTableBody = document.getElementById('professionals-table-body');

    toastNotification = document.getElementById('toast-notification');
    toastMessage = document.getElementById('toast-message');

    customModal = document.getElementById('custom-modal');
    modalMessage = document.getElementById('modal-message');
    modalConfirmButton = document.getElementById('modal-confirm');
    modalCancelButton = document.getElementById('modal-cancel');

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (login(passwordInput.value)) {
            checkAuth();
            passwordInput.value = '';
            loginError.style.display = 'none';
            showToast('Bienvenido al panel de administración', 'success');
        } else {
            loginError.style.display = 'block';
            showToast('Contraseña incorrecta', 'error');
        }
    });

    logoutButton.addEventListener('click', () => {
        logout();
        checkAuth();
        showToast('Sesión cerrada', 'success');
    });

    showAreasButton.addEventListener('click', (e) => { e.preventDefault(); showAreasManagement(); });
    showProfessionalsButton.addEventListener('click', (e) => { e.preventDefault(); showProfessionalsManagement(); });

    // Area Form
    areaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = areaNameInput.value.trim();
        const icono = areaIconInput.value.trim();
        if (!name) { showToast('El nombre del área es requerido', 'error'); return; }

        const isEditing = !!editingAreaId;
        await saveArea({ id: editingAreaId || generateUUID(), nombre: name, icono });

        areaNameInput.value = '';
        areaIconInput.value = '';
        editingAreaId = null;
        saveAreaButton.textContent = 'Agregar Área';
        await renderAreas();
        await populateAreaSelects();
        showToast(isEditing ? 'Área actualizada' : 'Área creada', 'success');
    });

    // Area List clicks
    areasList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-button')) {
            const id = e.target.dataset.id;
            const areas = await getAreas();
            const area = areas.find(a => a.id === id);
            if (area) {
                areaNameInput.value = area.nombre;
                areaIconInput.value = area.icono;
                editingAreaId = area.id;
                saveAreaButton.textContent = 'Guardar Cambios';
            }
        } else if (e.target.classList.contains('delete-button')) {
            const id = e.target.dataset.id;
            const areas = await getAreas();
            const area = areas.find(a => a.id === id);
            if (area) {
                const confirm = await showCustomModal(`¿Eliminar el área "${area.nombre}"? También se eliminarán todos sus profesionales.`);
                if (confirm) {
                    await deleteArea(id);
                    await renderAreas();
                    await renderProfessionalsTable();
                    await populateAreaSelects();
                    showToast('Área eliminada', 'success');
                }
            }
        }
    });

    // Add Professional
    addProfessionalButton.addEventListener('click', async () => {
        professionalFormContainer.style.display = 'block';
        editingProfessionalId = null;
        professionalForm.reset();
        profFotoPreview.style.display = 'none';
        if (profActivoInput) profActivoInput.checked = true;
        const areas = await getAreas();
        profAreaSelect.value = areas[0]?.id || '';
    });

    cancelProfessionalButton.addEventListener('click', () => {
        professionalFormContainer.style.display = 'none';
        professionalForm.reset();
        profFotoPreview.style.display = 'none';
        editingProfessionalId = null;
    });

    // Image input
    if (profFotoInput) {
        profFotoInput.addEventListener('change', handleImagePreview);
    }

    // Professional Form
    professionalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (uploadingImage) {
            showToast('Cargando imagen...', 'info');
            return;
        }

        const nombre = profNameInput.value.trim();
        const email = profEmailInput.value.trim();
        const areaId = profAreaSelect.value;

        if (!nombre) { showToast('El nombre es requerido', 'error'); return; }
        if (!areaId) { showToast('Debe seleccionar un área', 'error'); return; }
        if (email && !isValidEmail(email)) { showToast('El email no es válido', 'error'); return; }

        uploadingImage = true;
        showToast('Procesando...', 'info');

        try {
            let fotoUrl = '';
            
            // NUEVA VERSIÓN con Cloudinary:
        if (profFotoInput.files.length > 0) {
            fotoUrl = await uploadToCloudinary(profFotoInput.files[0]);
        }

            const profesional = {
                id: editingProfessionalId || generateUUID(),
                nombre,
                telefono: profPhoneInput.value.trim(),
                email,
                descripcion: profDescriptionInput.value.trim(),
                areaId,
                foto_url: fotoUrl,
                activo: profActivoInput ? profActivoInput.checked : true,
            };

            await saveProfesional(profesional);
            professionalFormContainer.style.display = 'none';
            professionalForm.reset();
            profFotoPreview.style.display = 'none';
            await renderProfessionalsTable();
            showToast('Profesional guardado', 'success');
            editingProfessionalId = null;
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        } finally {
            uploadingImage = false;
        }
    });

    // Table clicks
    professionalsTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-button')) {
            const id = e.target.dataset.id;
            const professionals = await getProfesionales();
            const prof = professionals.find(p => p.id === id);
            if (prof) {
                profNameInput.value = prof.nombre;
                profPhoneInput.value = prof.telefono || '';
                profEmailInput.value = prof.email || '';
                profDescriptionInput.value = prof.descripcion || '';
                profAreaSelect.value = prof.areaId;
                if (prof.foto_url) {
                    profFotoPreview.src = prof.foto_url;
                    profFotoPreview.style.display = 'block';
                }
                if (profActivoInput) profActivoInput.checked = prof.activo !== false;
                editingProfessionalId = prof.id;
                professionalFormContainer.style.display = 'block';
            }
        } else if (e.target.classList.contains('delete-button')) {
            const id = e.target.dataset.id;
            const professionals = await getProfesionales();
            const prof = professionals.find(p => p.id === id);
            if (prof) {
                const confirm = await showCustomModal(`¿Eliminar al profesional "${prof.nombre}"?`);
                if (confirm) {
                    await deleteProfesional(id);
                    await renderProfessionalsTable();
                    showToast('Profesional eliminado', 'success');
                }
            }
        }
    });

    filterAreaProfSelect.addEventListener('change', () => { renderProfessionalsTable(); });

    checkAuth();
});
