import * as React from "react";
import * as HotTable from "react-handsontable";
import "handsontable/dist/handsontable.css";

export default class FileTable extends React.Component<any, any> {
    static propTypes = {};
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id={this.props.container} style={{"overflow":"auto", textAlign:"center", display:"block"}}>
				<HotTable root="hot" data={this.props.data} rowHeaders={this.props.rowHeaders}
						  colHeaders={this.props.colHeaders} observeChanges={true} height={this.props.height}
                          style={{margin: "auto auto", display:"block", fontSize:12}}/>
			</div>
		)
	}
}
