const tokenCookieName = "accesstoken";
const RoleCookieName = "role";
// eslint-disable-next-line no-unused-vars
const apiUrl = "http://localhost:8000/api/login";

// Initialisation après le chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    const signoutBtn = document.getElementById("signout-btn");
    if (signoutBtn) {
        signoutBtn.addEventListener("click", signout);
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
    return getCookie(tokenCookieName);
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
}

function isConnected(){
    const token = getToken();
    return token !== null && token !== undefined && token !== "";
}

// eslint-disable-next-line no-unused-vars
function showAndHideElementsForRoles(){
    const userConnected = isConnected();
    const role = getRole();

    const allElementsToEdit = document.querySelectorAll('[data-show]');

    allElementsToEdit.forEach(element => {
        // Réinitialiser la classe d-none avant de l'appliquer
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

// eslint-disable-next-line no-unused-vars
function sanitizeHtml(text){
    const tempHtml = document.createElement('div');
    tempHtml.textContent = text;
    return tempHtml.innerHTML;
}