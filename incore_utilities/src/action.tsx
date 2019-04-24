import {ContentsManager} from '@jupyterlab/services';
import { TextModelFactory, Context } from '@jupyterlab/docregistry';
import { FileEditorCodeWrapper } from '@jupyterlab/fileeditor';
import { CodeMirrorEditorFactory, CodeMirrorMimeTypeService } from '@jupyterlab/codemirror';
import { JupyterLab } from "@jupyterlab/application";

export async function loginHelper(username, password) {
    const endpoint = "https://incore2-services.ncsa.illinois.edu/auth/api/login";
    const userRequest =  await fetch(endpoint, {
        method: "GET",
        headers: { "Authorization": `LDAP ${ window.btoa(`${username }:${ password}`) }`
        }
    });

    return await userRequest;
}

async function writeToFile(json:Object){
    const app = new JupyterLab();
    const manager = app.serviceManager;

    // make a new untitled file
    let contents = new ContentsManager();
    let model = await contents.newUntitled({path:"/", type:"file", ext:"json"});

    // delete pre-exist user.json and rename the current untitled file to that
    try{ await contents.delete('user.json'); }
    catch(err){ console.log(err);}
    model = await contents.rename(model.path, 'user.json');

    // create a widget so we can start to write to that file
    let path = model.path;
    const factoryService = new CodeMirrorEditorFactory();
    const modelFactory = new TextModelFactory();
    const mimeTypeService = new CodeMirrorMimeTypeService();
    let context = new Context({ manager, factory: modelFactory, path});
    let widget = new FileEditorCodeWrapper({
        factory: options => factoryService.newDocumentEditor(options),
        mimeTypeService,
        context
    });

    // write to that file
    await context.initialize(true);
    await context.ready;
    widget.context.model.fromJSON(json);
    await widget.context.save();

    return {
        loggedIn: true,
        loginMessage: "You have successfully logged in. We have documented your access tokens in " +
        "local file user.json. Now, you can start using the INCORE apps in the menu."
    };
}

export async function login(username, password) {
    const response = await loginHelper(username, password);
    if (response.status === 403){
        return {
            loggedIn: false,
            loginMessage: "Authentication failed. Please check if your username and password is valid."
        }
    }
    else if (response.status === 200){
        let json = await response.json();
        return writeToFile(json);
    }
    else{
        return {
            loggedIn: false,
            loginMessage: "Authentication failed for unknown reason."
        }
    }
}

export async function appendCredentials() {
    let info = {};
    try{
        info = await getHeaders();
    }
    catch(error){
        console.log(error);
    }

    info["location"] = "incoreLab";
    return Object.keys(info).map(key => key + '=' + info[key]).join('&');
}

function getHeaders(){
    return new Promise<object>((resolve, reject) =>{
        let contents = new ContentsManager();
        contents.get('user.json').then((model)=>{
            resolve(JSON.parse(model.content));
        }).catch((err) =>{
            reject(err);
        })
    })
}


