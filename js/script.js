const tokenCookieName = "accesstoken";
const RoleCookieName = "role";

// Initialisation après le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    const signoutBtn = document.getElementById("signout-btn");
    if (signoutBtn) {
        signoutBtn.addEventListener("click", signout);
        getInfoUser();
    }
});

function getRole(){
    return getCookie(RoleCookieName);
}

function signout(){
    eraseCookie(tokenCookieName);
    eraseCookie(RoleCookieName);
    window.location.reload();
}

function getToken(){
    const token = getCookie(tokenCookieName);
    console.log("Token récupéré :", token); // DEBUG
    return token;
}

function setToken(token){
    console.log("Token à stocker :", token); // DEBUG
    setCookie(tokenCookieName, token, 7);
}

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
    console.log("Cookie créé :", name, "=", value); // DEBUG
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(const element of ca) {
        let c = element;
        while (c.startsWith(' ')) c = c.substring(1, c.length);
        if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log("Cookie effacé :", name); // DEBUG
}

function isConnected(){
    const token = getToken();
    const connected = token !== null && token !== undefined && token !== "";
    console.log("Utilisateur connecté :", connected); // DEBUG
    return connected;
}

function showAndHideElementsForRoles(){
    const userConnected = isConnected();
    const role = getRole();

    console.log("showAndHideElementsForRoles - connecté:", userConnected, "rôle:", role); // DEBUG

    const allElementsToEdit = document.querySelectorAll('[data-show]');

    allElementsToEdit.forEach(element => {
        element.classList.remove("d-none");
        
        switch(element.dataset.show){
            case 'disconnected': 
                if(userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'connected': 
                if(!userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'admin': 
                if(!userConnected || role !== "admin"){
                    element.classList.add("d-none");
                }
                break;
            case 'client': 
                if(!userConnected || role !== "client"){
                    element.classList.add("d-none");
                }
                break;
        }
    });
}

function sanitizeHtml(text){
    const tempHtml = document.createElement('div');
    tempHtml.textContent = text;
    return tempHtml.innerHTML;
}

function getInfoUser(){
    console.log("=== DÉBUT getInfoUser ===");
    
    const token = getToken();
    console.log("Token pour la requête :", token);
    
    if (!token) {
        console.log("Aucun token trouvé, utilisateur non connecté");
        return;
    }

    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", token);
    console.log("Header X-AUTH-TOKEN ajouté avec le token :", token);

    let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    const url = getApiUrl('userInfo');
    console.log("URL de la requête :", url);

    fetch(url, requestOptions)
    .then(response => {
        console.log("Réponse reçue, status :", response.status);
        if(response.ok){
            return response.json();
        } else {
            console.log("Erreur HTTP :", response.status, response.statusText);
            throw new Error(`HTTP ${response.status}`);
        }
    })
    .then(result => {
        console.log("Données utilisateur reçues :", result);
        // Ici tu peux traiter les données utilisateur
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
    });
    
    console.log("=== FIN getInfoUser ===");
}