import * as React from "react";

export class DatasetMetadata extends React.Component<any, any> {
    static propTypes = {};

    constructor(props: any) {
        super(props);
    }

    render() {
        let metadataContents;
        if(this.props.dataset != null) {

            metadataContents = (<div style={{fontSize:12, marginLeft: 20}}>
                <b>Title: </b> {this.props.dataset.title} <br/>
                <b>Description: </b> {this.props.dataset.description} <br/>
                <b>Creator: </b> {this.props.dataset.creator} <br/>
                <b>Data Type: </b> {this.props.dataset.dataType} <br/>
                <b>Id: </b> {this.props.dataset.id} <br/>
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
