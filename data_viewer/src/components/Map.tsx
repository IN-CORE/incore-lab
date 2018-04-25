import * as React from "react";
let ol = require("openlayers");
require("openlayers/css/ol.css");

export class Map extends React.Component<any, any>{

	constructor(props) {
		super(props);
		this.state = {
			map: new ol.Map({
				view: new ol.View({
					center: [0, 0],
					zoom: 1
				}),
				layers: [
					new ol.layer.Tile({
						source: new ol.source.OSM()
					})
				],
				target: "map"
			})
		};

        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
	}

	render() {

		return (
			<div>
				<div id="map" className="root" style={{height:275}}/>
			</div>
		);

	}

	componentDidUpdate() {
		const theMap = this.state.map;
		theMap.setLayerGroup(new ol.layer.Group());

		let layerTiled = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				visible: false,
				url: "https://incore2-geoserver.ncsa.illinois.edu/geoserver/incore/wms",
				params: {"FORMAT": "image/png",
					"VERSION": "1.1.1",
					tiled: true,
					name: "tiledLayer",
					STYLES: "",
					LAYERS: `incore:${this.props.datasetId}`,
					tilesOrigin: `${-90.07376669874641  },${  35.03298062856903}` //TODO: How are we going to get this center
				}
			})
		});
		let mapTile = new ol.layer.Tile({
			source: new ol.source.XYZ({
				attribution: [new ol.Attribution({
					html: "Tiles © <a href=\"https://services.arcgisonline.com/ArcGIS/" +
					"rest/services/NatGeo_World_Map/MapServer\">ArcGIS</a> &mdash; National Geographic, Esri, DeLorme, NAVTEQ, " +
					"UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC"
				})],
				url: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
			})
		});
		theMap.addLayer(mapTile);
		theMap.addLayer(layerTiled);

	}

	componentDidMount() {
		let layerTiled = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				visible: false,
				url: "http://incore2-geoserver.ncsa.illinois.edu:9999/geoserver/incore/wms",
				params: {"FORMAT": "image/png",
					"VERSION": "1.1.1",
					tiled: true,
					name: "tiledLayer",
					STYLES: "",
					LAYERS: `incore:${this.props.datasetId}`,
					tilesOrigin: `${-90.07376669874641  },${  35.03298062856903}` //TODO: How are we going to get this center
				}
			})
		});

		let mapTile = new ol.layer.Tile({
			source: new ol.source.XYZ({
				attribution: [new ol.Attribution({
					html: "Tiles © <a href=\"https://services.arcgisonline.com/ArcGIS/" +
					"rest/services/NatGeo_World_Map/MapServer\">ArcGIS</a> &mdash; National Geographic, Esri, DeLorme, NAVTEQ, " +
					"UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC"
				})],
				url: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
			})
		});

		let layers;
		layers = [
			mapTile,
			layerTiled
		];

		const projection = new ol.proj.Projection({
			code: "EPSG:4326",
			units: "degrees",
			axisOrientation: "neu",
			global: true
		});

		const view = new ol.View({
			projection: projection,
			center:  [-89.920335, 35.293580],
			zoom: 9.5,
			minZoom: 5.5,
			maxZoom: 12
		});

		let theMap;
		theMap = new ol.Map({
			target: "map",
			layers: layers,
			view: view,
			controls: ol.control.defaults({
				attributionOptions: ({
					collapsible: false
				})
			})
		});

		this.setState({map: theMap});
	}

}
