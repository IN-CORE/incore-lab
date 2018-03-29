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
    Message
} from '@phosphor/messaging';

import {
    Widget
} from '@phosphor/widgets';

import '../style/index.css';



// class Dataset  {
//   title: String
// }
/**
 * An xckd comic viewer.
 */
class IncoreDataWidget extends Widget {
    /**
     * Construct a new xkcd widget.
     */
    constructor() {
        super();

        this.id = 'xkcd-jupyterlab';
        this.title.label = 'Incore Data';
        this.title.closable = true;
        this.addClass('jp-xkcdWidget');

        this.search = document.createElement('div');
        this.search.className ="jp-search";
        let searchBox = document.createElement('input');
        searchBox.type="text";
        searchBox.id = "search-box";
        searchBox.className = "jp-searchBox";
        let button = document.createElement('button');
        button.id = "search_button";
        button.innerHTML = "Search";
        button.onclick = this.onSearchClick;
        this.search.appendChild(searchBox);
        this.search.appendChild(button);

        this.node.appendChild(this.search);

        this.text = document.createElement('div');
        this.text.className = 'jp-xkcdCartoon';
        this.text.id='contents-div';
        this.node.appendChild(this.text);



        this.img = document.createElement('img');
        this.img.className = 'jp-xkcdCartoon';
        this.node.appendChild(this.img);

        this.img.insertAdjacentHTML('afterend',
            `<div class="jp-xkcdAttribution">
        <a href="https://creativecommons.org/licenses/by-nc/2.5/" class="jp-xkcdAttribution" target="_blank">
          <img src="https://licensebuttons.net/l/by-nc/2.5/80x15.png" />
        </a>
      </div>`
        );
    }

    /**
     * The image element associated with the widget.
     */
    readonly img: HTMLImageElement;
    readonly text: HTMLDivElement;
    readonly search: HTMLDivElement;

    /**
     * Handle update requests for the widget.
     */
    onUpdateRequest(msg: Message): void {
        fetch('http://localhost:8080/data/api/datasets').then(response => {
            return response.json();
        }).then(data => {
            let i;
            for(i =0; i<data.length; i++ ) {
                let temp = document.createElement('p');
                let title = document.createTextNode(data[i].title);
                temp.appendChild(title);
                this.text.appendChild(temp);
            }
        });
    }

    onSearchClick(): void {
        const title = (document.getElementById("search-box") as HTMLInputElement).value;
        fetch('http://localhost:8080/data/api/datasets?title='+ title).then(response => {
            return response.json();
        }).then(data => {
            const text = document.getElementById("contents-div");
            text.innerHTML = "";
            let i;
            for(i =0; i<data.length; i++ ) {
                let temp = document.createElement('p');
                let title = document.createTextNode(data[i].title);
                temp.appendChild(title);
                text.appendChild(temp);
            }
        })
    }
};


/**
 * Activate the xckd widget extension.
 */
function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
    console.log('JupyterLab extension jupyterlab_incore is activated!');

    // Declare a widget variable
    let widget:  IncoreDataWidget;

    // Add an application command
    const command: string = 'incore-data:open';
    app.commands.addCommand(command, {
        label: 'Incore Data Server',
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
};
/**
 * Initialization data for the jupyterlab_incore extension.
 */
const extension: JupyterLabPlugin<void> = {
    id: 'jupyterlab_xkcd',
    autoStart: true,
    requires: [ICommandPalette, ILayoutRestorer],
    activate: activate
};
export default extension;
