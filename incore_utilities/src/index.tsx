import {ILayoutRestorer, JupyterFrontEnd, JupyterFrontEndPlugin} from '@jupyterlab/application';

import { IMainMenu } from '@jupyterlab/mainmenu';

import {IFrame, ICommandPalette, MainAreaWidget} from '@jupyterlab/apputils';

import {ITerminal, Terminal} from '@jupyterlab/terminal';

import {Menu} from '@phosphor/widgets';

import { ILauncher } from '@jupyterlab/launcher';

import {writeToFile} from "./action";

import '../style/index.css';

async function activate(app: JupyterFrontEnd, mainMenu: IMainMenu,
                  palette: ICommandPalette, restorer: ILayoutRestorer, launcher: ILauncher) {

    /* need a customized terminal instance that will start with inital command since version 1.x removed it */
    app.commands.addCommand("createNew:terminal-with-command", {
        label: 'Terminal',
        caption: 'Start a new terminal session with command',
        execute: async args => {
            // start a new session with command
            const session = await app.serviceManager.terminals.startNew();
            let options: Partial<ITerminal.IOptions> = {initialCommand: "mkdir ~/.incore ; mv .incoretoken ~/.incore/"};
            let term = new Terminal(session, options);
            let main = new MainAreaWidget({content: term});
            app.shell.activateById(main.id);
        }
    });

    /* add cookie copyer */
    let commandCopyCookie = "cookie:copy";
    app.commands.addCommand(commandCopyCookie, {
        label: "INCORE Authenticator",
        caption: "INCORE Authenticator",
        iconClass: "jp-IncoreIcon",
        execute: async () => {
            // get a incore cookie
            let token = "";
            let name = "Authorization=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    token = c.substring(name.length, c.length);
                }
            }

            // write that cookie to a pyincore credential file
            let msg = await writeToFile(token);
            console.log(msg);

            // move the .incoretoken to a pyincore directory
            app.commands.execute('createNew:terminal-with-command');
        }
    });

    /* add menus */
    function appendNewCommand(item: any){
        let iframe: IFrame = null;
        let command = `${item.name}: show`;
        app.commands.addCommand(command, {
            label: item.name,
            execute: () =>{
                if (item.target == '_blank'){
                    let win = window.open(item.url, '_blank');
                    win.focus();
                }
                else if (item.target == 'widget'){
                    if (!iframe){
                        iframe = new IFrame();
                        iframe.url = item.url;
                        iframe.id = item.name;
                        iframe.title.label = item.name;
                        iframe.title.closable = true;
                        iframe.node.style.overflowY = 'auto';
                        iframe.sandbox = ["allow-same-origin",
                            "allow-scripts",
                            "allow-popups",
                            "allow-forms"];
                    }

                    if (iframe == null || !iframe.isAttached){
                        app.shell.add(iframe, 'main');
                        app.shell.activateById(iframe.id);
                    }

                    else{
                        app.shell.activateById(iframe.id);
                    }
                }
            }
        });

    }

    menuItem.forEach(item => appendNewCommand(item));
    docItem.forEach(item => appendNewCommand(item));

    let menu = Private.createMenu(app);
    menu.addItem({command: commandCopyCookie});
    let doc = Private.createDoc(app);

    palette.addItem({ command: commandCopyCookie, category: 'Other' });
    launcher.add({ command: commandCopyCookie, category: 'Other' });

    mainMenu.addMenu(menu, {rank:0});
    mainMenu.addMenu(doc, {rank:0});

    return Promise.resolve(void 0);
}

/**
 * A namespace for help plugin private functions
 */
namespace Private{
    export function createMenu(app:JupyterFrontEnd): Menu{
        const {commands} = app;
        let menu:Menu = new Menu({commands});
        menu.title.label = 'INCORE apps';
        menuItem.forEach(item => menu.addItem({command: `${item.name}: show`}));

        return menu;
    }
}

namespace Private{
    export function createDoc(app:JupyterFrontEnd): Menu{
        const {commands} = app;
        let doc:Menu = new Menu({commands});
        doc.title.label = 'INCORE docs';
        docItem.forEach(item =>doc.addItem({command:`${item.name}: show`}));

        return doc;
    }
}

/**
 * Initialization data for the incore menu extension
 */
const extension: JupyterFrontEndPlugin<void> = {
    id: 'jupyterlab_incore_menu',
    autoStart: true,
    requires: [IMainMenu, ICommandPalette,  ILayoutRestorer, ILauncher],
    activate: activate
};

let hostDomainName = window.location.origin;
/**
 * Initialize the menu data part
 */
export const menuItem = [
    {
        name: 'Fragility Explorer',
        url: `${hostDomainName}/FragilityViewer`,
        description:'fragility explorer standalone app',
        target: 'widget'
    },
    {
        name: 'Data Explorer',
        url: `${hostDomainName}/DataViewer`,
        description:'data explorer standalone app',
        target: 'widget'
    },
    {
        name: 'Hazard Explorer',
        url: `${hostDomainName}/HazardViewer`,
        description:'hazard explorer standalone app',
        target: 'widget'
    }
];

export const docItem = [
    {
        name:'IN-CORE Manual',
        url:`${hostDomainName}/doc/incore/index.html`,
        description:'About IN-CORE project',
        target:'widget'
    },
    {
        name:'pyIncore Reference',
        url:`${hostDomainName}/doc/pyincore`,
        description:'Sphinx documentation for pyincore library',
        target:'widget'
    },
    {
        name:'IN-CORE Web Service API',
        url:`${hostDomainName}/doc/api/`,
        description:'Swagger documentation for incore web services',
        target:'widget'
    }
];

export default extension;
