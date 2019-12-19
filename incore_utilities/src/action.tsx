import {ContentsManager} from '@jupyterlab/services';
import { TextModelFactory, Context } from '@jupyterlab/docregistry';
import { FileEditorCodeWrapper } from '@jupyterlab/fileeditor';
import { CodeMirrorEditorFactory, CodeMirrorMimeTypeService } from '@jupyterlab/codemirror';
import { JupyterLab } from "@jupyterlab/application";

export async function writeToFile(token:string){
    const app = new JupyterLab();
    const manager = app.serviceManager;

    // make a new untitled file
    let contents = new ContentsManager();
    let model = await contents.newUntitled({path:"/", type:"file", ext:""});

    // delete pre-exist user.json and rename the current untitled file to that
    try{ await contents.delete('.incoretoken'); }
    catch(err){ console.log(err);}

    model = await contents.rename(model.path, '.incoretoken');

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
    widget.context.model.fromString(token);
    await widget.context.save();

    return "You have successfully synchronized your INCORE credentials, now you can proceed to use pyincore on Jupyter hub";
}
