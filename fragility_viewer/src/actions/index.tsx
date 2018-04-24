// @flow

import {Dispatch, AnalysesMetadata, Analysis, Dataset} from "../utils/flowtype";
import config from "../app.config";
import {ContentsManager} from '@jupyterlab/services';

export const GET_ANALYSES = "GET_ANALYSES";

export const  RECEIVE_ANALYSES = "RECEIVE_ANALYSES";
export function receiveAnalyses(api:string, json:AnalysesMetadata) {
	return (dispatch: Dispatch) => {
		dispatch({
			type: RECEIVE_ANALYSES,
			analyses: json,
			receivedAt: Date.now()
		});
	};
}

export const RECEIVE_ANALYSIS = "RECEIVE_ANALYSIS";
export function receiveAnalysis(api: string, json:Analysis) {
	console.log(json);
	return(dispatch: Dispatch) => {
		dispatch({
			type: RECEIVE_ANALYSIS,
			analysis: json,
			receivedAt: Date.now()
		});
	};
}

export const RECEIVE_DATASETS = "RECEIVE_DATASETS";

export function receiveDatasets(json: Dataset) {
	return(dispatch: Dispatch) => {
		dispatch({
			type: RECEIVE_DATASETS,
			datasets: json,
			receivedAt: Date.now()
		});
	};
}

export function fetchAnalyses() {
	const endpoint = `${ config.maestroService }/api/analyses?full=false`;

	return (dispatch: Dispatch) => {
		return fetch(endpoint, {
			headers: getHeader()
		})
			.then(response => response.json())
			.then(json =>
				dispatch(receiveAnalyses(endpoint, json))
			);
	};
}

export function getAnalysisById(id: String) {
	//TODO: Move to a configuration file
	const endpoint = `${ config.maestroService }/api/analyses/${ id }`;

	return (dispatch: Dispatch) => {
		return fetch(endpoint, {
			headers: getHeader()
		})
			.then(response => response.json())
			.then(json =>
				dispatch(receiveAnalysis(config.maestroService, json))
			);
	};

}

export async function fetchDatasets() {
	const endpoint = config.dataService;

	return (dispatch: Dispatch) => {
		return fetch(endpoint, {
			headers: getHeader()
		})
			.then(response => response.json())
			.then(json =>
				dispatch(receiveDatasets(json))
			);
	};
}

export async function loginHelper(username, password) {
	const endpoint = config.authService;
	// Currently CORS error due to the header
	const userRequest =  await fetch(endpoint, {
		method: "GET",
		headers: {
			"Authorization": `LDAP ${ window.btoa(`${username }:${ password}`) }`
		}
	});

	const user = await userRequest.json();

	return user;
}

export const LOGIN_ERROR = "LOGIN_ERROR";
export const SET_USER = "SET_USER";
export function login(username, password) {

	return async(dispatch: Dispatch) => {

		const json = await loginHelper(username, password);
		if(typeof(Storage) !== "undefined" && json["auth-token"] !== undefined ) {
			sessionStorage.setItem("auth", json["auth-token"]);
			sessionStorage.setItem("user", json["user"]);
			return dispatch({
				type: SET_USER,
				username: json["user"],
				auth_token: json["auth-token"]
			});
		} else {
			return dispatch({
				type: LOGIN_ERROR
			});
		}

	};
}

export const LOGOUT = "LOGOUT";
export function logout() {
	return (dispatch: Dispatch) => {
		if(typeof(Storage) !== "undefined") {
			sessionStorage.removeItem("auth");
			sessionStorage.removeItem("user");
		}
		return dispatch({
			type: LOGOUT
		});
	};
}

export const RECEIVE_EXECUTION_ID = "RECEIVE_WORKFLOW_ID";
export function receiveDatawolfResponse(json) {
	// Get the id of the layers in geoserver to display in the map
	// Get the info from a table to display


	return (dispatch: Dispatch) => {
		dispatch({
			type: RECEIVE_EXECUTION_ID,
			executionId: json,
			receivedAt: Date.now()
		});


	};

}

async function getOutputDatasetHelper(executionId: String) {
	const datawolfUrl = `${ config.dataWolf }executions/${ executionId }`;
	const headers = getDatawolfHeader();
	const datawolf_execution_fetch = await fetch(datawolfUrl, {
		method: "GET",
		headers: headers
	});

	const datawolfExecution  = await datawolf_execution_fetch.json();

	const output_dataset_id =datawolfExecution.datasets["7774de32-481f-48dd-8223-d9cdf16eaec1"];
	const endpoint = `${ config.dataService }/${ output_dataset_id }` ;
	const output_dataset = await fetch(endpoint, {
		headers: getHeader()
	});

	const outputDataset = await output_dataset.json();
	const fileId = outputDataset.fileDescriptors[0].id;

	const fileDownloadUrl = `${ config.dataServiceBase }data/api/files/${ fileId }/blob`;
	//TODO CORS failed here, figure out why
	//const fileBlob = await fetch(fileDownloadUrl, {method: "GET", mode: "CORS", headers: getHeader()});
	const fileBlob = await fetch(fileDownloadUrl, {headers: getHeader()});

	const fileText = await fileBlob.text();

	return [outputDataset.id, fileText];
}

export const RECEIVE_OUTPUT = "RECEIVE_OUTPUT";
export function getOutputDataset(executionId: String) {

	return async (dispatch: Dispatch) => {
		const data = await getOutputDatasetHelper(executionId);
		 dispatch({
			type: RECEIVE_OUTPUT,
			outputDatasetId: data[0],
			file: data[1].replace(/"/g,"").split("\n")
		});

	};
}

export async function executeDatawolfWorkflowHelper(workflowid, creatorid, title, description, parameters, datasets) {
	const datawolfUrl = `${ config.dataWolf }executions`;
	const dataToSubmit = {
		"title": title,
		"parameters": parameters,
		"datasets": datasets,
		"workflowId": workflowid,
		"creatorId": creatorid,
		"description": description
	};
	const headers = getDatawolfHeader();
	headers.append("Content-Type", "application/json");

	const datawolfExecution = await fetch(datawolfUrl, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(dataToSubmit),
		credentials: "include",
	});

	const executionId = await datawolfExecution.text();

	return executionId;
}

export function executeDatawolfWorkflow(workflowid, creatorid, title, description, parameters, datasets) {

	return async (dispatch: Dispatch) =>
	{
		 const json = await  executeDatawolfWorkflowHelper(workflowid, creatorid, title, description, parameters, datasets);
		return dispatch({
			type: RECEIVE_EXECUTION_ID,
			executionId: json,
			receivedAt: Date.now()
		});
	};

}

export function getHeader() {
    const headers = new Headers({
        "Authorization": `LDAP ${ sessionStorage.auth }`,
        "auth-user": sessionStorage.user,
        "auth-token": sessionStorage.auth
    });
    return headers;
}

export async function getHeaderJupyterlab() {
	const username = await getUsername();
	const headers = new Headers({
       "X-Credential-Username":username
    });

    return headers;
}

function getUsername(){
	return new Promise<string>((resolve) => {
        let contents = new ContentsManager();
        contents.get('.user').then((model) => {
                resolve(model.content);
            });
    	});
}

function getDatawolfHeader() {
	const headers = new Headers({
		"X-Credential-Username": sessionStorage.user
	});
	return headers;
}