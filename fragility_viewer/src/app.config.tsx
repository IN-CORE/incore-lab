const devConfig = {
    basePath: "/",
    fragilityService: "http://incore2-services.ncsa.illinois.edu:8888/fragility/api/fragilities",
    semanticService: "",
    hazardService: "http://incore2-services.ncsa.illinois.edu:8888/hazard/api/earthquakes/",
    maestroService: "http://incore2-services.ncsa.illinois.edu:8888/maestro",
    authService: "http://incore2-services.ncsa.illinois.edu:8888/auth/api/login",
    dataServiceBase: "http://incore2-services.ncsa.illinois.edu:8888/",
    dataService: "http://incore2-services.ncsa.illinois.edu:8888/data/api/datasets",
    dataWolf: "http://incore2-services.ncsa.illinois.edu:8888/datawolf/"
};

/*const prodConfig = {
    basePath: "/",
    fragilityService: "https://incore2-services.ncsa.illinois.edu/fragility/api/fragilities",
    semanticService: "",
    hazardService: "https://incore2-services.ncsa.illinois.edu/hazard/api/earthquakes/",
    maestroService: "https://incore2-services.ncsa.illinois.edu/maestro",
    authService: "https://incore2-services.ncsa.illinois.edu/auth/api/login",
    dataServiceBase: "https://incore2-services.ncsa.illinois.edu/",
    dataService: "https://incore2-services.ncsa.illinois.edu/data/api/datasets",
    dataWolf: "https://incore2-datawolf.ncsa.illinois.edu/datawolf/"
};*/

const config = getConfig();

function getConfig() {
    if (process.env.NODE_ENV === "production") {
        return devConfig;
    } else {
        return devConfig;
    }
}

/*function getConfig() {
	return prodConfig;
}*/

export default config;
