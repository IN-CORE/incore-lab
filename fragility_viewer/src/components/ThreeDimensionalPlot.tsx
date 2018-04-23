import * as React from "react";
import * as vis from "vis";

class ThreeDimensionalPlot extends React.Component<any,any> {
    static propTypes = {};

	constructor(props) {
		super(props);
	}

	constructGraph() {
		let data = this.props.data;

		let dataset = new vis.DataSet();

		for (let i = 0; i < data.length; i++) {
			let point = data[i];

			dataset.add(
				{
					x: point[0],
					y: point[1],
					z: point[2],
					style: point[2] // z
				});
		}

		// specify options
		let options = {
			width: this.props.width,
			height: this.props.height,
			style: this.props.style,
			showPerspective: false,
			showGrid: true,
			showShadow: false,
			keepAspectRatio: false,
			xLabel: this.props.xLabel,
			yLabel: this.props.yLabel,
			zLabel: this.props.zLabel,
            animationAutoStart:true
		};

		// Instantiate our graph object.
		let container = this.refs[this.props.plotId];
		new vis.Graph3d(container, dataset, options);
	}

	componentDidUpdate() {
		let data = this.props.data;

		if (data !== null && data.length > 0) {
			this.constructGraph();
		}
	}

	componentDidMount() {
		let data = this.props.data;

		if (data !== null && data.length > 0) {
			this.constructGraph();
		}
	}

	render() {
		return (<div id={this.props.plotId} ref={this.props.plotId} />);
	}

	componentWillUnmount() {
	}
}

export default ThreeDimensionalPlot;
