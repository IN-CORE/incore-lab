import * as React from "react";
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from "material-ui";

class DistributionTable extends React.Component<any, any> {
	static propTypes = {};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		return (
			<Table style={{backgroundColor:"transparent"}}>
				<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
					<TableRow>
						<TableHeaderColumn colSpan="3" tooltip="Fragility GUID"
										   style={{textAlign: "center"}}>
							{this.props.fragility.id}
						</TableHeaderColumn>
					</TableRow>
					<TableRow>
						<TableHeaderColumn>Limit State</TableHeaderColumn>
						<TableHeaderColumn>Alpha</TableHeaderColumn>
						<TableHeaderColumn>Beta</TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody displayRowCheckbox={false}>
					{this.props.fragility.fragilityCurves.map(function (curve) {
						return (
							<TableRow>
								<TableRowColumn>{curve.description}</TableRowColumn>
								<TableRowColumn>{curve.median}</TableRowColumn>
								<TableRowColumn>{curve.beta}</TableRowColumn>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		);
	}

	componentWillUnmount() {
	}
}

export default DistributionTable;
