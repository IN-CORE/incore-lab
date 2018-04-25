import * as React from "react";
import { Table, TableBody, TableRow, TableRowColumn } from "material-ui";

export default class FileTable extends React.Component<any, any> {
    static propTypes = {};
	constructor(props) {
		super(props);
	}


	render() {
        let bodyGranularStyle = {fontSize:12, color:"black", height:21};
        let rowStyle = {height:21};

        let rows = this.props.data.map(function(item, i){
            let entry = item.map(function (element, j) {
                return (<TableRowColumn style={bodyGranularStyle}>{element}</TableRowColumn>);
            });

            return (<TableRow style={rowStyle}>{entry}</TableRow>);
        });

        let headers = this.props.colHeaders.map(function(header,i){
            let entry = header.map(function(element, j){
                return (<TableRowColumn style={bodyGranularStyle}><b>{element}</b></TableRowColumn>);
            })

            return (<TableRow style={rowStyle}>{entry}</TableRow>);
		});

        return (
            <Table bodyStyle={{overflow:'auto'}} style={{tableLayout: 'auto', padding: 0}}>
                <TableBody displayRowCheckbox={false}>
                    {headers}
					{rows}
                </TableBody>
            </Table>);
	}
}
