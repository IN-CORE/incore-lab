import {
    JupyterLab, JupyterLabPlugin, ILayoutRestorer // new
} from '@jupyterlab/application';

import {
    ICommandPalette, InstanceTracker // new
} from '@jupyterlab/apputils';

import {
    JSONExt // new
} from '@phosphor/coreutils';

import {
    Widget
} from '@phosphor/widgets';

import '../style/index.css';

import {IncoreDataWidget} from "./data_widget";

/**
 * Activate the Incore Data widget extension.
 */
function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
    console.log('JupyterLab extension jupyterlab_incore_data is activated!');

    // Declare a widget variable
    let widget:  IncoreDataWidget;

    // Add an application command
    const command: string = 'incore-data:open';
    app.commands.addCommand(command, {
        label: 'Incore Data Explorer',
        execute: () => {
            if (!widget) {
                // Create a new widget if one does not exist
                widget = new IncoreDataWidget();
                widget.update();
            }
            if (!tracker.has(widget)) {
                // Track the state of the widget for later restoration
                tracker.add(widget);
            }
            if (!widget.isAttached) {
                // Attach the widget to the main work area if it's not there
                app.shell.addToMainArea(widget);
            } else {
                // Refresh the comic in the widget
                widget.update();
            }
            // Activate the widget
            app.shell.activateById(widget.id);
        }
    });

    // Add the command to the palette.
    palette.addItem({ command, category: 'Tutorial' });

    // Track and restore the widget state
    let tracker = new InstanceTracker<Widget>({ namespace: 'incore_data' });
    restorer.restore(tracker, {
        command,
        args: () => JSONExt.emptyObject,
        name: () => 'incore_data'
    });
}
/**
 * Initialization data for the jupyterlab_incore extension.
 */
const extension: JupyterLabPlugin<void> = {
    id: 'jupyterlab_incore_data',
    autoStart: true,
    requires: [ICommandPalette, ILayoutRestorer],
    activate: activate
};
export default extension;
