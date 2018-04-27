import * as React from "react";
import GroupList from "./GroupList";
import LineChart from "./LineChart";
import ThreeDimensionalPlot from "./ThreeDimensionalPlot";
import "whatwg-fetch";

import {
    SelectField,
    GridList,
    GridTile,
    Card,
    MenuItem,
    TextField,
    Divider,
    IconButton,
    RaisedButton,
    MuiThemeProvider,
    Toolbar,
    ToolbarGroup
} from "material-ui";
import ActionSearch from "material-ui/svg-icons/action/search";

// utils
import chartSampler from "../utils/chartSampler";

// config
import chartConfig from "./config/ChartConfig";

// application configuration
import config from "../app.config";
import DistributionTable from "./DistributionTable";
import CustomExpressionTable from "./CustomExpressionTable";

// helper
import {getHeaderJupyterlab} from "../actions";

export class FragilityExplorerPage extends React.Component<any, any>{
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            selectedInventory: null,
            selectedHazard: null,
            selectedDemand: null,
            selectedAuthor: null,
            searchText: '',
            fragility: null,
            data: [],
            chartConfig: chartConfig.FragilityConfig,
            plotData3d: {}
        };

        this.clickFragility = this.clickFragility.bind(this);
        this.handleAuthorSelection = this.handleAuthorSelection.bind(this);
        this.handleInventorySelection = this.handleInventorySelection.bind(this);
        this.handleHazardSelection = this.handleHazardSelection.bind(this);
        this.handleDemandSelection = this.handleDemandSelection.bind(this);

        this.handleKeyPressed = this.handleKeyPressed.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.searchFragilities = this.searchFragilities.bind(this);

        this.exportJson = this.exportJson.bind(this);
    }

    async componentDidMount() {
        let host = config.fragilityService;
        let url = host;

        let headers = await getHeaderJupyterlab();
        let response = await fetch(url, {method: "GET", mode: "cors", headers: headers});
        //let response = await fetch(url, {method: "GET", mode: "cors", headers: {}});

        if (response.ok) {
            let fragilities = await response.json();

            let fragilitiesWithInfo = [];
            await fragilities.map((fragility) =>{
                let is3dPlot = this.is3dFragility(fragility);
                fragility['is3dPlot'] = is3dPlot;
                fragilitiesWithInfo.push(fragility);
            })

            await  this.setState({
                data: fragilitiesWithInfo
            });

            // By default select the first returned in the list of fragilities
            if (fragilitiesWithInfo.length > 0) {
                await this.clickFragility(fragilitiesWithInfo[0]);
            } else {
                await this.clickFragility(fragilitiesWithInfo);
            }
        } else {
            this.setState({
                fragility: null,
                data: []
            });
        }
    }

    async handleInventorySelection(event, index, value) {
        await this.setState({selectedInventory: value});
        await this.queryFragilities();
    }

    async handleHazardSelection(event, index, value){
        await this.setState({selectedHazard: value});
        await this.queryFragilities();
    }

    async handleDemandSelection(event, index, value) {
        await this.setState({selectedDemand: value});
        await this.queryFragilities();
    }

    async handleAuthorSelection(event, index, value) {
        await this.setState({selectedAuthor: value});
        await this.queryFragilities();
    }

    handleTextChange(event){
        this.setState({searchText:event.target.value});
    }

    async handleKeyPressed(event) {
        if (event.charCode === 13) {
            event.preventDefault();
            await this.searchFragilities();
        }
    }

    async searchFragilities() {
        let searchText = this.state.searchText;

        let host = config.fragilityService;

        let url = `${host}/search?text=${searchText}`;

        let headers = await getHeaderJupyterlab();
        let response = await fetch(url, {method: "GET", mode: "cors", headers: headers});
        //let response = await fetch(url, {method: "GET", mode: "cors", headers:{}});

        if (response.ok) {
            let fragilities = await response.json();

            if (fragilities.length > 0) {

                let fragilitiesWithInfo = [];

                await fragilities.map((fragility) =>{
                    let is3dPlot = this.is3dFragility(fragility);
                    fragility['is3dPlot'] = is3dPlot;
                    fragilitiesWithInfo.push(fragility);
                })

                await this.setState({
                    data: fragilitiesWithInfo
                });

                // By default select the first returned in the list of fragilities
                if (fragilitiesWithInfo.length > 0) {
                    await this.clickFragility(fragilitiesWithInfo[0]);
                } else {
                    await this.clickFragility(fragilitiesWithInfo);
                }
            } else {
                this.setState({
                    data: [],
                    fragility: null
                });
            }
        } else {
            this.setState({
                data: [],
                fragility: null
            });
        }
    }

    async queryFragilities() {
        let host = config.fragilityService;

        let url = '';

        if (this.state.selectedInventory !== null && this.state.selectedHazard !== null) {
            url = `${host}?inventory=${this.state.selectedInventory}&hazard=${this.state.selectedHazard}`;
        } else if (this.state.selectedInventory !== null) {
            url = `${host}?inventory=${this.state.selectedInventory}`;
        } else if (this.state.selectedHazard !== null) {
            url = `${host}?hazard=${this.state.selectedHazard}`;
        } else {
            url = `${host}`;
        }
        let headers = await getHeaderJupyterlab();

        let response = await fetch(url, {method: "GET", mode: "cors", headers: headers});
        //let response = await fetch(url, {method: "GET", mode: "cors", headers: {}});

        if (response.ok) {
            let fragilities = await response.json();

            if (fragilities.length > 0) {
                let fragilitiesWithInfo = [];

                await fragilities.map((fragility) =>{
                    let is3dPlot = this.is3dFragility(fragility);
                    fragility['is3dPlot'] = is3dPlot;
                    fragilitiesWithInfo.push(fragility);
                })

                await this.setState({
                    data: fragilitiesWithInfo
                });

                // By default select the first returned in the list of fragilities
                if (fragilitiesWithInfo.length > 0) {
                    await this.clickFragility(fragilitiesWithInfo[0]);
                } else {
                    await this.clickFragility(fragilitiesWithInfo);
                }
            }

            else {
                this.setState({
                    data: [],
                    fragility: null
                });
            }

        } else {
            this.setState({
                data: [],
                fragility: null
            });
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                <Toolbar style={{backgroundColor:"white"}}>
                    <ToolbarGroup>
                        {/* Inventory Type */}
                        <SelectField hintText="Inventory Type" value={this.state.selectedInventory}
                                     onChange={this.handleInventorySelection} style={{fontSize:12}}>
                            <MenuItem primaryText="Building" value="building" style={{fontSize:12}}/>
                            <MenuItem primaryText="Bridge" value="bridge" style={{fontSize:12}}/>
                            <Divider />
                            <MenuItem primaryText="Roadway" value="roadway" style={{fontSize:12}}/>
                            {/*<MenuItem primaryText="Railway" value="railway" />*/}
                            <Divider />
                            <MenuItem primaryText="Electric Power Network" value="electric_facility" style={{fontSize:12}}/>
                            <MenuItem primaryText="Potable Water Network" value="buried_pipeline" style={{fontSize:12}}/>
                        </SelectField>

                        {/* Hazard Type */}
                        <SelectField hintText="Hazard Type" value={this.state.selectedHazard}
                                     onChange={this.handleHazardSelection} style={{fontSize:12}}>
                            <MenuItem primaryText="Earthquake" value="earthquake" style={{fontSize:12}}/>
                            <MenuItem primaryText="Tornado" value="tornado" style={{fontSize:12}}/>
                            <MenuItem primaryText="Tsunami" value="tsunami" style={{fontSize:12}}/>
                        </SelectField>
                    </ToolbarGroup>

                    <ToolbarGroup>
                        {/*search box*/}
                        <TextField hintText="Search Fragilities" value={this.state.searchText}
                                   onChange={this.handleTextChange}
                                   onKeyPress={this.handleKeyPressed} style={{fontSize:12}}/>
                        <IconButton iconStyle={{position: "absolute", left: 0, bottom: 10}}
                                    onClick={this.searchFragilities} style={{fontSize:12}}>
                            <ActionSearch />
                        </IconButton>

                        {/*download button*/}
                        <RaisedButton primary={true} style={{display: "inline-block"}} label="Export to JSON"
                                      onClick={this.exportJson} labelStyle={{fontSize:12}}/>
                    </ToolbarGroup>
                </Toolbar>

                <div style={{padding: "0px 20px 0px 20px"}}>
                    <GridList cols={12} padding={10} style={{paddingTop: "10px"}} cellHeight="auto">
                        <GridTile cols={5}>
                            <GroupList id="fragility-list" onClick={this.clickFragility} height="800px"
                                       data={this.state.data} displayField="author"/>
                        </GridTile>

                        {/*chart*/}
                        {this.state.fragility ?
                            <GridTile cols={4}>
                                <Card>
                                    {this.state.fragility.is3dPlot ?
                                        <div>
                                            <p style={{textAlign:"center"}}>{this.state.plotData3d.title}</p>
                                            <ThreeDimensionalPlot plotId="3dplot" data={this.state.plotData3d.data}
                                                              xLabel={this.state.fragility.demandType} yLabel="Y"
                                                              zLabel={this.state.fragility.fragilityCurves[0].description}
                                                              width="100%" height="250px" style="surface"/>
                                        </div>
                                        :
                                        <LineChart chartId="chart" configuration={this.state.chartConfig}/>}
                                </Card>
                            </GridTile>
                            :
                            <div></div>
                        }

                        {/*table*/}
                        {this.state.fragility ?
                            <GridTile cols={3}>
                                {this.state.fragility.fragilityCurves[0].className.includes("CustomExpressionFragilityCurve") ?
                                    <CustomExpressionTable fragility={this.state.fragility}/>
                                    :
                                    <DistributionTable fragility={this.state.fragility}/>}
                            </GridTile>
                            :
                            <div></div>
                        }

                    </GridList>
                </div>
                </div>
            </MuiThemeProvider>
        );
    }

    async clickFragility(fragility) {
        let plotData3d = {};
        let plotConfig2d = {};

        if (fragility.is3dPlot) {
            plotData3d = await this.generate3dPlotData(fragility);
        } else {
            plotConfig2d = await this.generate2dPlotData(fragility);
        }

        await this.setState({
            chartConfig: plotConfig2d,
            plotData3d: plotData3d,
            fragility: fragility
        });
    }

    generate2dPlotData(fragility) {
        let updatedChartConfig = Object.assign({}, chartConfig.FragilityConfig);

        let demandType = fragility.demandType !== null ? fragility.demandType : "";
        let demandUnit = fragility.demandUnits !== null ? fragility.demandUnits : "";
        let description = fragility.description !== null ? fragility.description : "";
        let authors = fragility.authors.join(", ");

        updatedChartConfig.xAxis.title.text = `${demandType} (${demandUnit})`;
        updatedChartConfig.title.text = `${description} [${authors}]`;

        updatedChartConfig.series = [];

        for (let i = 0; i < fragility.fragilityCurves.length; i++) {
            let curve = fragility.fragilityCurves[i];

            let plotData;

            if (curve.className.includes("CustomExpressionFragilityCurve")) {
                plotData = chartSampler.computeExpressionSamples(0, 1.0, 90, curve.expression);
            } else if (curve.className.includes("StandardFragilityCurve")) {
                if (curve.curveType === "Normal") { // Actually Log Normal
                    plotData = chartSampler.sampleLogNormalCdf(0, 0.999, 1000, curve.median, curve.beta);
                }

                if (curve.curveType === "StandardNormal") {
                    plotData = chartSampler.sampleNormalCdf(0, 0.999, 1000, curve.median, curve.beta);
                }

                if (curve.curveType === "LogNormal") { // Log Normal with Normal mean and Normal variance
                    plotData = chartSampler.sampleLogNormalAlternate(0, 0.999, 1000, curve.median, curve.beta);
                }
            } else if (curve.className.includes("periodStandardFragilityCurve")) {

            } else if (curve.className.includes("buildingPeriodStandardFragilityCurve")) {

            } else {

            }

            let series = {
                name: curve.description,
                data: plotData
            };

            updatedChartConfig.series.push(series);
        }

        return updatedChartConfig;
    }

    async generate3dPlotData(fragility) {
        let curve = fragility.fragilityCurves[0];
        let plotData = await chartSampler.computeExpressionSamples3d(0.001, 1.0, 50, 0.001, 1.0, 50, curve.expression);

        let description = fragility.description !== null ? fragility.description : "";
        let authors = fragility.authors.join(", ");
        let title = `${description} [${authors}]`;

        return {'data': plotData, 'title':title}
    }

    is3dFragility(fragility) {
        let curves = fragility.fragilityCurves;

        for (let i = 0; i < curves.length; i++) {
            let curve = curves[i];

            if (curve.className.includes("CustomExpressionFragilityCurve") && curve.expression.includes("y")) {
                return true;
            }
        }

        return false;
    }

    exportJson() {
        let fragilityJSON = JSON.stringify(this.state.fragility, null, 4);
        let blob = new Blob([fragilityJSON], {type: "application/json"});

        const filename = `${this.state.fragility.id}.json`;

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            let anchor = window.document.createElement("a");
            anchor.href = window.URL.createObjectURL(blob);
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        }
    }
}
