import {Widget} from "@phosphor/widgets";
import {Message} from "@phosphor/messaging";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {DataExplorerPage} from "./components/DataExplorerPage";

export class IncoreDataWidget extends Widget {

    data: HTMLDivElement;

    constructor() {
        super();
        this.id = 'incore-data-jupyterlab';
        this.title.label = 'Incore Data Viewer';
        this.title.closable = true;
        this.addClass('jp-dataWidget');

        this.data = document.createElement('div');
        this.data.className = "jp-data";
        this.data.id = "jp-data";

        this.node.appendChild(this.data);
    }

    onUpdateRequest(msg: Message): void {
        ReactDOM.render(
            <DataExplorerPage style={{fontSize:14}}/>,
            document.getElementById('jp-data')
        );
    }



}
