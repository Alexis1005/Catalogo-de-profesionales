/**
 * Módulo auth.js
 * Gestiona la lógica de autenticación del panel de administración.
 * Utiliza localStorage para persistir la sesión.
 */

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const ADMIN_SESSION_KEY = "admin_session";

/**
 * Intenta iniciar sesión con la contraseña proporcionada.
 * @param {string} password - La contraseña ingresada por el usuario.
 * @returns {boolean} True si la contraseña es correcta, false en caso contrario.
 */
export function login(password) {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem(ADMIN_SESSION_KEY, "true");
        return true;
    }
    return false;
}

/**
 * Cierra la sesión del administrador.
 */
export function logout() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
}

/**
 * Verifica si el administrador ha iniciado sesión.
 * @returns {boolean} True si hay una sesión activa, false en caso contrario.
 */
export function isLoggedIn() {
    return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

// Para depuración y acceso directo si es necesario desde la consola
window.auth = {
    login,
    logout,
    isLoggedIn,
};