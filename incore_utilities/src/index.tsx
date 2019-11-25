import {ILayoutRestorer, JupyterFrontEnd, JupyterFrontEndPlugin} from '@jupyterlab/application';

import { IMainMenu } from '@jupyterlab/mainmenu';

import {IFrame, ICommandPalette} from '@jupyterlab/apputils';

import {Menu} from '@phosphor/widgets';

import { ILauncher } from '@jupyterlab/launcher';

import '../style/index.css';

async function activate(app: JupyterFrontEnd, mainMenu: IMainMenu,
                  palette: ICommandPalette, restorer: ILayoutRestorer, launcher: ILauncher) {
    console.log('JupyterLab extension incore_utilities is activated!');

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
    let doc = Private.createDoc(app);

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
