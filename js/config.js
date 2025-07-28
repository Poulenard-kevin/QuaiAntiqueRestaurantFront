// config.js
const API_CONFIG = {
    baseUrl: "http://localhost:8000/api/",
    endpoints: {
        login: "login",
        registration: "registration",
        userInfo: "account/me"
    }
};

// Fonction helper pour construire les URLs
function getApiUrl(endpoint) {
    if (!API_CONFIG.endpoints[endpoint]) {
        throw new Error(`Endpoint "${endpoint}" not found in API_CONFIG`);
    }
    return API_CONFIG.baseUrl + API_CONFIG.endpoints[endpoint];
}

// Fonction helper pour obtenir l'URL de base
function getBaseApiUrl() {
    return API_CONFIG.baseUrl;
}