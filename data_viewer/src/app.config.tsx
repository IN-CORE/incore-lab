const prodConfig = {
    basePath: "/",
    fragilityService: "https://incore2-services.ncsa.illinois.edu/fragility/api/fragilities",
    semanticService: "",
    hazardService: "https://incore2-services.ncsa.illinois.edu/hazard/api/earthquakes/",
    maestroService: "https://incore2-services.ncsa.illinois.edu/maestro",
    authService: "https://incore2-services.ncsa.illinois.edu/auth/api/login",
    dataServiceBase: "https://incore2-services.ncsa.illinois.edu/",
    dataService: "https://incore2-services.ncsa.illinois.edu/data/api/datasets",
    dataWolf: "https://incore2-datawolf.ncsa.illinois.edu/datawolf/"
};

const config = getConfig();

function getConfig() {
    return prodConfig;
}

export default config;

