import {ILayoutRestorer, JupyterFrontEnd, JupyterFrontEndPlugin} from '@jupyterlab/application';

import { IMainMenu } from '@jupyterlab/mainmenu';

import {IFrame, ICommandPalette, WidgetTracker} from '@jupyterlab/apputils';

import {Menu} from '@phosphor/widgets';

import {appendCredentials} from './action';

import { ILauncher } from '@jupyterlab/launcher';

import {JSONExt} from '@phosphor/coreutils';

import {Widget} from '@phosphor/widgets';

import {IncoreLoginWidget} from "./IncoreLoginWidget";

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
                    let win = window.open(item.url + "?" + queryString, '_blank');
                    win.focus();
                }
                else if (item.target == 'widget'){
                    if (!iframe){
                        iframe = new IFrame();
                        iframe.url = item.url + "?" + queryString;
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

    // if user.json exists, queryString will be ?&user=xxx&auth-token=xxxx; else queryString is empty
    let queryString = await appendCredentials();
    if (queryString !== ""){
        menuItem.forEach(item => appendNewCommand(item));
    }

    docItem.forEach(item => appendNewCommand(item));

    let menu = Private.createMenu(app);
    let doc = Private.createDoc(app);

    /* add login widget */
    let LoginWidget: IncoreLoginWidget;
    const commandLogin: string="incore-login:open";

    app.commands.addCommand(commandLogin, {
        label: 'INCORE login',
        caption:'INCORE login',
        iconClass: 'jp-IncoreIcon',
        execute: () => {
            if (!LoginWidget) {
                LoginWidget = new IncoreLoginWidget();
                LoginWidget.update();
            }
            if (!trackerLogin.has(LoginWidget)) {
                trackerLogin.add(LoginWidget);
            }
            if (!LoginWidget.isAttached) {
                LoginWidget = new IncoreLoginWidget();
                LoginWidget.update();
                app.shell.add(LoginWidget, 'main');
            } else {
                LoginWidget.update();
            }

            app.shell.activateById(LoginWidget.id);
        }
    });


    /* add menus and login to jupyterlab element: mainMenu, palette, and launcher */
    palette.addItem({ command: commandLogin, category: 'Other' });
    launcher.add({ command: commandLogin,  category: 'Other' });

    // Add the login to the menu and then add menu to mainMenu
    menu.addItem({command: commandLogin});
    mainMenu.addMenu(menu, {rank:0});
    mainMenu.addMenu(doc, {rank:0});

    /* Track and restore the widget state */
    let trackerLogin = new WidgetTracker<Widget>({ namespace: 'incore_login' });
    restorer.restore(trackerLogin, {
        command: commandLogin,
        args: () => JSONExt.emptyObject,
        name: () => 'incore_login'
    });

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

/**
 * Initialize the menu data part
 */
export const menuItem = [
    {
        name: 'Fragility Explorer',
        url: 'https://incore2.ncsa.illinois.edu/FragilityViewer',
        description:'fragility explorer standalone app',
        target: 'widget'
    },
    {
        name: 'Data Explorer',
        url: 'https://incore2.ncsa.illinois.edu/DataViewer',
        description:'data explorer standalone app',
        target: 'widget'
    },
    {
        name: 'Hazard Explorer',
        url: 'https://incore2.ncsa.illinois.edu/HazardViewer',
        description:'hazard explorer standalone app',
        target: 'widget'
    }
];

// TODO: documentation url might change
export const docItem = [
    {
        name:'IN-CORE Manual',
        url:'https://incore2.ncsa.illinois.edu/doc/incore/index.html',
        description:'About IN-CORE project',
        target:'widget'
    },
    {
        name:'pyIncore Reference',
        url:'https://incore2.ncsa.illinois.edu/doc/pyincore',
        description:'Sphinx documentation for pyincore library',
        target:'widget'
    },
    {
        name:'IN-CORE Web Service API',
        url:'https://incore2.ncsa.illinois.edu/doc/api/',
        description:'Swagger documentation for incore web services',
        target:'widget'
    }
];

export default extension;
