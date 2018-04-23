import * as React from "react";
import * as HighCharts from "highcharts";

class LineChart extends React.Component<any,any> {
    static propTypes = {};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		HighCharts.chart(this.props.chartId, this.props.configuration);
	}

	componentDidUpdate() {
		HighCharts.chart(this.props.chartId, this.props.configuration);
	}

	render() {
		return (<div id={this.props.chartId} className="highcharts-container" />);
	}
}

export default LineChart;
