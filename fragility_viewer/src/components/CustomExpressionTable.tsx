import * as React from "react";
import { Table, TableBody, TableRow, TableRowColumn } from "material-ui";

class CustomExpressionTable extends React.Component<any, any> {
    static propTypes = {};

    constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
        let bodyGranularStyle = {fontSize:12, color:"black", height:30, textAlign:"center"};
        let rowStyle = {height:30};

    	return (
			<Table bodyStyle={{overflow:'auto'}} style={{tableLayout: 'auto', padding: 0}}>
				<TableBody displayRowCheckbox={false}>
                    <TableRow style={rowStyle}>
                        <TableRowColumn colSpan="2" tooltip="Fragility GUID" style={bodyGranularStyle}><b>
                            id: {this.props.fragility.id}
                        </b></TableRowColumn>
                    </TableRow>
                    <TableRow style={rowStyle}>
                        <TableRowColumn style={bodyGranularStyle}><b>Limit State</b></TableRowColumn>
                        <TableRowColumn style={bodyGranularStyle}><b>Expression</b></TableRowColumn>
                    </TableRow>
					{this.props.fragility.fragilityCurves.map(function (curve) {
						return (
							<TableRow style={rowStyle}>
								<TableRowColumn style={bodyGranularStyle}>{curve.description}</TableRowColumn>
								<TableRowColumn style={bodyGranularStyle}>{curve.expression}</TableRowColumn>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		)
	}

	componentWillUnmount() {
	}
}


export default CustomExpressionTable;
