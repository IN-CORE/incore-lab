import {Widget} from "@phosphor/widgets";
import {Message} from "@phosphor/messaging";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {FragilityExplorerPage} from "./components/FragilityExplorerPage";


export class IncoreFragilityWidget extends Widget {
    /**
     * Construct a new Fragility browser widget.
     */

    fragility: HTMLDivElement;

    constructor() {
        super();

        this.id = 'incore-fragility-jupyterlab';
        this.title.label = 'Incore Fragility';
        this.title.closable = true;
        this.addClass('jp-fragilityWidget');

        this.fragility = document.createElement('div');
        this.fragility.className = "jp-fragility";
        this.fragility.id = "jp-fragility";

        this.node.appendChild(this.fragility);
    }


    /**
     * Handle update requests for the widget.
     */
    onUpdateRequest(msg: Message): void {
        ReactDOM.render(
            <FragilityExplorerPage />,
            document.getElementById('jp-fragility')
        );
    };
}

