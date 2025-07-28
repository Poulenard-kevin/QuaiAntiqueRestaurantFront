// Fonction qui s'exécute quand la page signin est chargée
function initSigninPage() {
    console.log("=== Initialisation page signin ===");
    
    const mailInput = document.getElementById("EmailInput");
    const passwordInput = document.getElementById("PasswordInput");
    const btnSignin = document.getElementById("btnSignin"); // <-- CORRIGÉ (était btnSingin)
    const signinForm = document.getElementById("signinForm");

    // Vérifier que les éléments existent
    if (btnSignin && signinForm && mailInput && passwordInput) {
        console.log("Éléments trouvés, ajout du listener sur le bouton");
        btnSignin.addEventListener("click", checkCredentials);
    } else {
        console.log("Éléments manquants :", {
            btnSignin: !!btnSignin, // <-- CORRIGÉ (était btnSingin)
            signinForm: !!signinForm,
            mailInput: !!mailInput,
            passwordInput: !!passwordInput
        });
    }
}

// Observer pour détecter quand le contenu change
function observePageChanges() {
    const mainPage = document.getElementById("main-page");
    if (mainPage) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // Vérifier si la page signin est chargée
                    if (document.getElementById("signinForm")) {
                        console.log("Page signin détectée par l'observer");
                        initSigninPage();
                    }
                }
            });
        });
        
        observer.observe(mainPage, { childList: true, subtree: true });
    }
}

// Démarrer l'observation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé, démarrage de l'observation");
    observePageChanges();
    // Aussi vérifier si la page est déjà chargée
    if (document.getElementById("signinForm")) {
        console.log("Page signin déjà présente");
        initSigninPage();
    }
});

function checkCredentials(){
    console.log("=== DÉBUT checkCredentials ===");
    
    const mailInput = document.getElementById("EmailInput");
    const passwordInput = document.getElementById("PasswordInput");
    const signinForm = document.getElementById("signinForm");
    
    let dataForm = new FormData(signinForm);
    
    const email = dataForm.get("Email");
    const password = dataForm.get("Mdp");
    
    console.log("Données du formulaire :", { email, password: password ? "***" : "vide" });
    
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "username": email,
        "password": password
    });

    console.log("Données JSON à envoyer :", raw);

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    const url = getApiUrl('login');
    console.log("URL de connexion :", url);

    fetch(url, requestOptions)
    .then(response => {
        console.log("Réponse login reçue, status :", response.status);
        if(response.ok){
            return response.json();
        } else {
            console.log("Erreur de connexion :", response.status, response.statusText);
            mailInput.classList.add("is-invalid");
            passwordInput.classList.add("is-invalid");
            throw new Error(`HTTP ${response.status}`);
        }
    })
    .then(result => {
        console.log("Données de connexion reçues :", result);
        
        if (result.apiToken) {
            console.log("Token reçu :", result.apiToken);
            setToken(result.apiToken);
            
            if (result.roles && result.roles.length > 0) {
                console.log("Rôle reçu :", result.roles[0]);
                setCookie(RoleCookieName, result.roles[0], 7);
            }
            
            console.log("Redirection vers la page d'accueil");
            window.location.replace("/");
        } else {
            console.error("Aucun token dans la réponse !");
        }
    })
    .catch(error => {
        console.error('Erreur lors de la connexion :', error);
    });
    
    console.log("=== FIN checkCredentials ===");
}

// CODE TEMPORAIRE POUR FORCER L'INITIALISATION (À LA FIN DU FICHIER)
setTimeout(function() {
    console.log("=== FORCE INIT SIGNIN ===");
    const btnSignin = document.getElementById("btnSignin");
    if (btnSignin) {
        console.log("Bouton signin trouvé, ajout du listener");
        btnSignin.removeEventListener("click", checkCredentials); // Évite les doublons
        btnSignin.addEventListener("click", checkCredentials);
    } else {
        console.log("Bouton signin introuvable !");
        console.log("Éléments disponibles :", document.querySelectorAll('button, input[type="submit"]'));
    }
}, 2000); // Attendre 2 secondes