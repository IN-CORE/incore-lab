import * as React from "react";

export class DatasetMetadata extends React.Component<any, any> {
    static propTypes = {};

    constructor(props: any) {
        super(props);
    }

    render() {
        let metadataContents;
        if(this.props.dataset != null) {
            metadataContents = (<div>
                <b>Title:</b> {this.props.dataset.title} <br/>
                <b> Description: </b> {this.props.dataset.description} <br/>
                <b> Creator: </b> {this.props.dataset.creator} <br/>
                <b> Data Type: </b> {this.props.dataset.dataType}
            </div>)
        } else {
            metadataContents = "Please select a dataset to get more information";
        }
        return (
            <div>
              {metadataContents}
            </div>

        )
    }
}
