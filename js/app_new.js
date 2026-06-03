import { getAreas, getProfesionalesByArea } from "./storage.js";

const areasFilterContainer = document.getElementById("areas-filter");
const professionalsListContainer =
  document.getElementById("professionals-list");
const globalSearchBar = document.getElementById("global-search");
const searchBarContainer = document.querySelector(".search-bar");
const emptyStateMessage = document.getElementById("empty-state");

let currentAreaFilter = "all";
let currentSearchTerm = "";
let isViewingAreas = true;

const PRIMARY = "#5A5047";
const PRIMARY_DARK = "#3A3330";

function getInitials(fullName) {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
}

async function renderAreasView() {
  areasFilterContainer.innerHTML =
    '<p style="text-align:center;color:#888;">Cargando...</p>';
  professionalsListContainer.innerHTML = "";
  emptyStateMessage.style.display = "none";
  searchBarContainer.classList.remove("visible");

  const areas = await getAreas();

  areasFilterContainer.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Selecciona un Servicio";
  title.style.cssText = "text-align: center; color: #3A3330; margin: 30px 0;";
  areasFilterContainer.appendChild(title);

  const areasGrid = document.createElement("div");
  areasGrid.className = "areas-grid";

  areas.forEach((area) => {
    const card = document.createElement("div");
    card.style.cssText = `
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 2px solid transparent;
        `;
    card.innerHTML = `
            <div style="font-size: 3em; margin-bottom: 15px;">${area.icono}</div>
            <h3 style="color: ${PRIMARY}; margin: 0 0 10px 0; font-size: 1.5em;">${area.nombre}</h3>
            <p style="color: ${PRIMARY_DARK}; margin: 0;">Haz clic para ver profesionales</p>
        `;
    card.addEventListener("mouseover", () => {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
      card.style.borderColor = PRIMARY;
    });
    card.addEventListener("mouseout", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
      card.style.borderColor = "transparent";
    });
    card.addEventListener("click", () => selectArea(area.id, area));
    areasGrid.appendChild(card);
  });

  areasFilterContainer.appendChild(areasGrid);
  isViewingAreas = true;
}

function selectArea(areaId, area) {
  currentAreaFilter = areaId;
  isViewingAreas = false;
  searchBarContainer.classList.add("visible");
  renderProfessionalsByArea(area);
}

function backToAreas() {
  currentAreaFilter = "all";
  currentSearchTerm = "";
  globalSearchBar.value = "";
  renderAreasView();
}

async function renderProfessionalsByArea(selectedArea) {
  areasFilterContainer.innerHTML = "";
  professionalsListContainer.innerHTML =
    '<p style="text-align:center;color:#888;">Cargando...</p>';
  emptyStateMessage.style.display = "none";

  const header = document.createElement("div");
  header.style.cssText =
    "display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;flex-wrap:wrap;gap:15px;";

  const areaTitle = document.createElement("div");
  areaTitle.innerHTML = `
        <h2 style="color:${PRIMARY};margin:0;font-size:2em;">${selectedArea.icono} ${selectedArea.nombre}</h2>
        <p style="color:${PRIMARY_DARK};margin:5px 0 0 0;">Profesionales disponibles</p>
    `;

  const backButton = document.createElement("button");
  backButton.textContent = "← Volver a Servicios";
  backButton.style.cssText = `background-color:${PRIMARY};color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:600;transition:background-color 0.3s ease;`;
  backButton.addEventListener(
    "mouseover",
    () => (backButton.style.backgroundColor = PRIMARY_DARK),
  );
  backButton.addEventListener(
    "mouseout",
    () => (backButton.style.backgroundColor = PRIMARY),
  );
  backButton.addEventListener("click", backToAreas);

  header.appendChild(areaTitle);
  header.appendChild(backButton);
  areasFilterContainer.appendChild(header);

  const allProfessionals = await getProfesionalesByArea(currentAreaFilter);
const professionals = allProfessionals.filter(p => p.activo !== false);

  professionalsListContainer.innerHTML = "";

  const filtered = filterBySearch(professionals);

  if (filtered.length === 0) {
    emptyStateMessage.style.display = "block";
    emptyStateMessage.textContent = `No hay profesionales disponibles en ${selectedArea.nombre} en este momento.`;
    return;
  }

  const grid = document.createElement("div");
  grid.className = "professionals-grid";

  filtered.forEach((prof) => {
    const card = document.createElement("div");
    card.classList.add("professional-card");
    card.innerHTML = `
            <div class="professional-card__header">
                ${
                  prof.foto_url
                    ? `<img src="${prof.foto_url}" alt="${prof.nombre}" class="professional-card__avatar" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">`
                    : ""
                }
                <div class="professional-card__avatar professional-card__avatar--default" style="${prof.foto_url ? "display:none;" : ""}">${getInitials(prof.nombre)}</div>
                <div class="professional-card__info">
                    <h3>${prof.nombre}</h3>
                    <p>${selectedArea.icono} ${selectedArea.nombre}</p>
                </div>
            </div>
            <div class="professional-card__body">
                <p class="professional-card__description">${prof.descripcion || "Sin descripción."}</p>
                <div class="professional-card__contact">
                    ${prof.telefono ? `<p><strong>Teléfono:</strong> ${prof.telefono}</p>` : ""}
                    ${prof.email ? `<p><strong>Email:</strong> <a href="mailto:${prof.email}">${prof.email}</a></p>` : ""}
                    ${prof.telefono ? `<a href="https://wa.me/${prof.telefono.replace(/\D/g, "")}" target="_blank" class="whatsapp-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18" style="vertical-align:middle;margin-right:6px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.117 1.528 5.843L.057 23.571a.75.75 0 0 0 .921.921l5.728-1.471A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.69-.513-5.218-1.407l-.374-.22-3.4.873.888-3.313-.239-.389A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg> WhatsApp</a>` : ""}
                </div>
            </div>
        `;
    grid.appendChild(card);
  });

  professionalsListContainer.appendChild(grid);
}

function filterBySearch(professionals) {
  if (!currentSearchTerm) return professionals;
  const term = currentSearchTerm.toLowerCase();
  return professionals.filter(
    (p) =>
      p.nombre.toLowerCase().includes(term) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(term)),
  );
}

globalSearchBar.addEventListener("input", async (event) => {
  currentSearchTerm = event.target.value.trim();
  if (!isViewingAreas) {
    const areas = await getAreas();
    const selectedArea = areas.find((a) => a.id === currentAreaFilter);
    if (selectedArea) renderProfessionalsByArea(selectedArea);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderAreasView();
});
