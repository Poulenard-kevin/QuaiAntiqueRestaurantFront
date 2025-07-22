import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;
  // Parcours de toutes les routes pour trouver la correspondance
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });
  // Si aucune correspondance n'est trouvée, on retourne la route 404
  if (currentRoute != null) {
    return currentRoute;
  } else {
    return route404;
  }
};

  // Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;
  // Récupération de l'URL actuelle
  const actualRoute = getRouteByUrl(path);

  //Vérifier les droits d'accès à la page
  const allRolesArray = actualRoute.authorize;

  if(allRolesArray.length > 0){
    if(allRolesArray.includes("disconnected")){
      if(isConnected()){
        window.location.replace("/");
      }
    }
    else{
      const roleUser = getRole();
      if(!allRolesArray.includes(roleUser)){
        window.location.replace("/");
      }
    }
  }

  //Récupération du contenu HTML de la route
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  // Ajout du contenu HTML à l'élément avec l'ID "main-page"
  document.getElementById("main-page").innerHTML = html;

  // Code spécifique pour la page réservation
  if (actualRoute.url === "/reserver") {
    initReservationForm();
  }

  // Ajout du contenu JavaScript
  if (actualRoute.pathJS != "") {
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    document.querySelector("body").appendChild(scriptTag);
  }

  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  //Afficher et masquer les éléments en fonction du rôle
  showAndHideElementsForRoles();
};

// Masquer le loader après l'appel
document.getElementById('loader').style.display = 'none';

  // Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();
  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", event.target.href);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
};

  // Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;
  // Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent;
  // Chargement du contenu de la page au chargement initial
LoadContentPage();

function initReservationForm() {
  const hoursMidi = ["12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30"];
  const hoursSoir = ["19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00"];

  function updateHours(service) {
    const select = document.getElementById('selectHour');
    if (!select) return;
    select.innerHTML = "";
    const hours = service === "midi" ? hoursMidi : hoursSoir;
    hours.forEach(h => {
      const option = document.createElement('option');
      option.value = h;
      option.textContent = h;
      select.appendChild(option);
    });
  }

  updateHours("soir");

  const midiRadio = document.getElementById('midiRadio');
  const soirRadio = document.getElementById('soirRadio');
  if (midiRadio && soirRadio) {
    midiRadio.addEventListener('change', function() {
      if (this.checked) updateHours("midi");
    });
    soirRadio.addEventListener('change', function() {
      if (this.checked) updateHours("soir");
    });
  }
}