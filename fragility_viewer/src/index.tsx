import {ILayoutRestorer, JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';

import {ICommandPalette, InstanceTracker} from '@jupyterlab/apputils';

import {JSONExt} from '@phosphor/coreutils';

import {Widget} from '@phosphor/widgets';

import {IncoreFragilityWidget} from "./fragility_widget";

import '../style/index.css';

/**
 * Activate the fragility browser widget extension.
 */
function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
    console.log('JupyterLab extension jupyterlab_incore_fragility is activated!');

    // Declare a widget variable
    let FragilityWidget: IncoreFragilityWidget;

    const commandFragility: string="incore-fragility:open";
    app.commands.addCommand(commandFragility, {
        label: 'Incore Fragility Explorer',
        execute: () => {
            if (!FragilityWidget) {
                // Create a new widget if one does not exist
                FragilityWidget = new IncoreFragilityWidget();
                FragilityWidget.update();
            }
            if (!trackerFragility.has(FragilityWidget)) {
                // Track the state of the widget for later restoration
                trackerFragility.add(FragilityWidget);
            }
            if (!FragilityWidget.isAttached) {
                // Attach the widget to the main work area if it's not there
                app.shell.addToMainArea(FragilityWidget);
            } else {
                // Refresh the comic in the widget
                FragilityWidget.update();
            }
            // Activate the widget
            app.shell.activateById(FragilityWidget.id);
        }
    });


    // Add the command to the palette.
    palette.addItem({ command: commandFragility, category: 'Tutorial' });

    // Track and restore the widget state
    let trackerFragility = new InstanceTracker<Widget>({ namespace: 'incore_fragility' });
    restorer.restore(trackerFragility, {
        command: commandFragility,
        args: () => JSONExt.emptyObject,
        name: () => 'incore_fragility'
    });
}

/**
 * Initialization data for the jupyterlab_incore extension.
 */
const extension: JupyterLabPlugin<void> = {
    id: 'jupyterlab_incore_fragility',
    autoStart: true,
    requires: [ICommandPalette, ILayoutRestorer],
    activate: activate
};

export default extension;
