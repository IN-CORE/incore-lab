import {Widget} from "@phosphor/widgets";
import {Message} from "@phosphor/messaging";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {HomePage} from "./HomePage";

export class IncoreLoginWidget extends Widget {
    /**
     * construct a login widget
     */

    login: HTMLDivElement;

    constructor(){
        super();

        this.id="incore-login-jupyterlab";
        this.title.label = "INCORE Login";
        this.title.closable = true;
        this.addClass("jp-loginWidget");

        this.login = document.createElement('div');
        this.login.className = "jp-login";
        this.login.id="jp-login";

        this.node.appendChild(this.login);
    }

    /**
     * Handle update requests for the widget
     */
    onAfterAttach(msg:Message): void {
        ReactDOM.render(
            <HomePage/>, document.getElementById("jp-login")
        );
    }

}
