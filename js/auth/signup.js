// Fonction qui s'exécute quand la page signup est chargée
function initSignupPage() {
    console.log("=== Initialisation page signup ===");
    
    const inputNom = document.getElementById("NomInput");
    const inputPreNom = document.getElementById("PrenomInput");
    const inputMail = document.getElementById("EmailInput");
    const inputPassword = document.getElementById("PasswordInput");
    const inputValidationPassword = document.getElementById("ValidatePasswordInput");
    const btnValidation = document.getElementById("btn-validation-inscription");

    // Vérifier que les éléments existent
    if (inputNom && inputPreNom && inputMail && inputPassword && inputValidationPassword && btnValidation) {
        console.log("Éléments trouvés, ajout des listeners");
        inputNom.addEventListener("keyup", validateForm); 
        inputPreNom.addEventListener("keyup", validateForm);
        inputMail.addEventListener("keyup", validateForm);
        inputPassword.addEventListener("keyup", validateForm);
        inputValidationPassword.addEventListener("keyup", validateForm);
        btnValidation.addEventListener("click", InscrireUtilisateur);
    } else {
        console.log("Éléments manquants pour signup");
    }
}

// Observer pour détecter quand le contenu change
function observePageChanges() {
    const mainPage = document.getElementById("main-page");
    if (mainPage) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // Vérifier si la page signup est chargée
                    if (document.getElementById("formulaireInscription")) {
                        console.log("Page signup détectée par l'observer");
                        initSignupPage();
                    }
                }
            });
        });
        
        observer.observe(mainPage, { childList: true, subtree: true });
    }
}

// Démarrer l'observation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    observePageChanges();
    // Aussi vérifier si la page est déjà chargée
    if (document.getElementById("formulaireInscription")) {
        initSignupPage();
    }
});

function validateForm(){
    const inputNom = document.getElementById("NomInput");
    const inputPreNom = document.getElementById("PrenomInput");
    const inputMail = document.getElementById("EmailInput");
    const inputPassword = document.getElementById("PasswordInput");
    const inputValidationPassword = document.getElementById("ValidatePasswordInput");
    const btnValidation = document.getElementById("btn-validation-inscription");
    
    const nomOk = validateRequired(inputNom);
    const prenomOk = validateRequired(inputPreNom);
    const mailOk = validateMail(inputMail);
    const passewordOk = validatePassword(inputPassword);
    const passewordConfirmOk = validateConfirmationPassword(inputPassword, inputValidationPassword);

    if(nomOk && prenomOk && mailOk && passewordOk && passewordConfirmOk){
        btnValidation.disabled = false;
    } else {
        btnValidation.disabled = true;
    }
}

function validateConfirmationPassword(inputPwd, inputConfirmPwd){
    if(inputPwd.value == inputConfirmPwd.value){
        inputConfirmPwd.classList.add("is-valid");
        inputConfirmPwd.classList.remove("is-invalid");
        return true;
    } else {
        inputConfirmPwd.classList.add("is-invalid");
        inputConfirmPwd.classList.remove("is-valid");
        return false;
    }
}

function validatePassword(input){
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const passwordUser = input.value;
    if(passwordUser.match(passwordRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validateMail(input){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailUser = input.value;
    if(mailUser.match(emailRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validateRequired(input){
    if(input.value != ''){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function InscrireUtilisateur(){
    console.log("=== DÉBUT inscription ===");
    
    const formInscription = document.getElementById("formulaireInscription");
    let dataForm = new FormData(formInscription);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "firstName": dataForm.get("Nom"),
        "lastName": dataForm.get("Prenom"),
        "email": dataForm.get("Email"),
        "password": dataForm.get("Mdp")
    });

    console.log("Données d'inscription :", raw);

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(getApiUrl('registration'), requestOptions)
    .then(response => {
        console.log("Réponse inscription :", response.status);
        if(response.ok){
            return response.json();
        } else {
            alert("Erreur lors de l'inscription");
            throw new Error(`HTTP ${response.status}`);
        }
    })
    .then(result => {
        console.log("Inscription réussie :", result);
        alert("Bravo "+dataForm.get("Prenom")+", vous êtes maintenant inscrit, vous pouvez vous connecter.");
        document.location.href="/signin";
    })
    .catch(error => {
        console.error('Erreur inscription :', error);
    });
}