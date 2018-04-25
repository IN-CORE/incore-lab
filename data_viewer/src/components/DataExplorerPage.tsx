import * as React from "react";
import GroupList from "./GroupList";
import { GridList,
    GridTile,
    TextField,
    IconButton,
    RaisedButton,
    ListItem,
    List,
    Divider,
    Toolbar,
    ToolbarGroup,
    AutoComplete,
    Checkbox
} from "material-ui";
import {Dataset} from "../utils/flowtype";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import ActionAppGet from 'material-ui/svg-icons/action/get-app';
import ActionSearch from "material-ui/svg-icons/action/search";

// application configuration
import config from "../app.config";
import {getHeaderJupyterlab, getUsername} from "../actions/index";
import {Map} from "./Map";
import FileTable from "./FileTable";
import {DatasetMetadata} from "./DatasetMetadata";


export class DataExplorerPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            searchText: '',
            selectedDataType: null,
            dataTypes: [],
            datasets: [],
            dataset: null,
            selectedDatasetId: '',
            selectedDatasetFormat: '',
            selectedDatasetFileDescriptors:[],
            fileExtension:'',
            fileData: [],
            datasetTypeSearchText: '',
            checkedCreatorFilter: false
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleKeyPressed = this.handleKeyPressed.bind(this);
        this.searchDatasets = this.searchDatasets.bind(this);
        this.clickDataset = this.clickDataset.bind(this);
        this.handleSelectDataType = this.handleSelectDataType.bind(this);
        this.downloadDataset = this.downloadDataset.bind(this);
        this.exportJson = this.exportJson.bind(this);
        this.onClickFileDescriptor = this.onClickFileDescriptor.bind(this);
        this.handleUpdateDatasetTypeInput = this.handleUpdateDatasetTypeInput.bind(this);
        this.handleNewDatasetTypeRequest = this.handleNewDatasetTypeRequest.bind(this);
        this.updateCheckCreatorFilter = this.updateCheckCreatorFilter.bind(this);
    }

    handleTextChange(event: any){
        this.setState({searchText: event.target.value});
    }

    async componentDidMount() {
        let host = config.dataService;
        // TODO: This should be somewhere else. Fetch shouldn't be done directly on a component.

        const response = await fetch(host, {method: "GET", mode: "cors", headers: await getHeaderJupyterlab()});

        if (response.ok) {
            const datasets = await response.json();

            // generate a unique list of data types
            let typesList: string[] = [];
            datasets.map( (dataset: Dataset) => {
                if (typesList.indexOf(dataset.dataType)<= -1) {
                    typesList.push(dataset.dataType);
                }
            });

            // By default select the first returned in the list of datasets
            if (datasets.length > 0) {
                await this.clickDataset(datasets[0]);
            } else {
                await this.clickDataset(datasets);
            }

            this.setState({datasets: datasets, dataTypes: typesList.sort()})
        } else {
            this.setState({datasets: [], dataTypes: [], dataset: null})
        }

    }

    async searchDatasets() {
        const host = config.dataService;
        const username = await getUsername();
        let url = host + "?";
        let needDivider = false;
        if(this.state.selectedDataType != null) {
            url += "type=" + encodeURI(this.state.selectedDataType);
            needDivider = true;
        }
        if(this.state.searchText != '') {
            if(needDivider) {
                url += "&"
            }
            url += "title="+this.state.searchText;
            needDivider=true;
        }
        if(this.state.checkedCreatorFilter) {
            if(needDivider) {
                url +="&"
            }
            url += "creator="+username.trim();
        }

        let response =  await fetch(url, {method: "GET", mode: "cors", headers: await getHeaderJupyterlab()});

        if(response.ok) {
            let datasets = await response.json();

            // select the first one
            if(datasets.length > 0) {
                this.setState({datasets: datasets});
                this.clickDataset(datasets[0]);
            } else {
                this.setState({datasets: datasets});
            }
        } else {
            this.setState({datasets: [], dataTypes:[], dataset: null});
        }
    }

    async clickDataset(dataset) {
        this.setState({dataset: dataset, selectedDatasetId: dataset.id, selectedDatasetFormat: dataset.format,
            selectedDatasetFileDescriptors: dataset.fileDescriptors, fileData: []});
        const fileExtension = dataset.fileDescriptors[0].filename.split(".").slice(-1).pop().toLowerCase();
        if( fileExtension === "csv" || fileExtension === "xml") {
            await this.onClickFileDescriptor(dataset.id, dataset.fileDescriptors[0].id, dataset.fileDescriptors[0].filename)
        }

    }

    async handleSelectDataType(event, index, value) {
        await this.setState({selectedDataType: value});
        await this.searchDatasets();
    }

    async handleKeyPressed(event:any) {
        if (event.charCode === 13) {
            event.preventDefault();
            await this.searchDatasets();
        }
    }

    async onClickFileDescriptor(selected_dataset_id, file_descriptor_id, file_name) {
        const url = config.dataServiceBase + 'data/api/files/' + file_descriptor_id + '/blob';
        let response = await fetch(url, {method: "GET", mode: "cors", headers: await getHeaderJupyterlab()});

        if (response.ok){
            let text = await response.text();

            // parse the data
            this.setState({fileExtension: file_name.split(".").slice(-1).pop().toLowerCase()});
            if(this.state.fileExtension === "csv") {
                let filedData = [];
                await text.split("\n").map(row => {
                    filedData.push(row.split(','));
                });

                this.setState({fileData: filedData});
            } else if(this.state.fileExtension === "xml") {
                // For some reason the first 3 characters are weird on xml files.
                this.setState({fileData: text.substring(3)});
            } else if (this.state.fileExtension === "txt") {
                this.setState({fileData: text});
            }
        }

    }

    async downloadDataset() {
        let datasetId = this.state.selectedDatasetId;
        let filename = datasetId + '.zip';
        let url = config.dataService + '/' + datasetId + '/blob';

        let response = await fetch(url, {method: "GET", mode: "cors", headers: await getHeaderJupyterlab()});

        if (response.ok) {
            let blob = await response.blob();
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

    exportJson() {
        let datasetJSON = JSON.stringify(this.state.dataset, null, 4);
        let blob = new Blob([datasetJSON], {type: "application/json"});

        const filename = `${this.state.dataset.id}.json`;

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

    async handleUpdateDatasetTypeInput(searchText) {
        await this.setState({datasetTypeSearchText: searchText, selectedDataType: searchText});
        await this.searchDatasets();

    }

    handleNewDatasetTypeRequest(event) {
        event.preventDefault();
        this.setState({datasetTypeSearchText: ''});
    }

    async updateCheckCreatorFilter() {
        this.setState((oldState) => {
            return {
                checkedCreatorFilter: !oldState.checkedCreatorFilter
            }
        });
        await this.searchDatasets();
    }

    render() {

        let file_descriptors = this.state.selectedDatasetFileDescriptors.map(file_descriptor => {
            return (<div key={file_descriptor.id}>
                        <ListItem onClick={() =>
                            this.onClickFileDescriptor(this.state.selectedDatasetId, file_descriptor.id,
                                file_descriptor.filename)}
                                  primaryText={file_descriptor.filename} key={file_descriptor.id} style={{fontSize:12}}/>
                        <Divider />
                    </div>);
        });

        let file_list;
        if( this.state.selectedDatasetFormat !== "shapefile" && this.state.selectedDatasetFormat !== "Network") {
            file_list = (
                <List style={{"overflowY": "auto"}}>
                    {file_descriptors}
                </List>
            )
        }
        const  middle_column = (
            <div>
                <DatasetMetadata dataset={this.state.dataset}/>
                {file_list}
            </div>
        );

        let right_column;
        if(this.state.selectedDatasetFormat === "shapefile" || this.state.selectedDatasetFormat === "Network") {
            right_column =
                (<div>
                    <Map datasetId={this.state.selectedDatasetId}/>
                </div>);
        } else if(this.state.fileExtension === "csv"){
            right_column = <FileTable data={this.state.fileData.slice(2, 12)} colHeaders={this.state.fileData.slice(0,1)}/>;
        } else if (this.state.fileExtension === "xml"){
            right_column = <pre style={{ maxHeight: 298, overflow: 'auto' }}> {this.state.fileData}</pre>;
        } else if (this.state.fileExtension === "txt") {
            right_column = <div style={{ maxHeight: 298, overflow: 'auto' }}>{this.state.fileData}</div>
        }

        return (
            <MuiThemeProvider muiTheme={getMuiTheme({})}>
                <div>
                <Toolbar style={{backgroundColor:"white"}}>
                    {/* dataset type */}
                    <GridList cols={12}>
                        <GridTile cols={4}>
                            <ToolbarGroup>
                                <AutoComplete
                                    hintText = "Dataset Type"
                                    searchText={this.state.datasetTypeSearchText}
                                    onUpdateInput={this.handleUpdateDatasetTypeInput}
                                    onNewRequest ={this.handleNewDatasetTypeRequest}
                                    dataSource={this.state.dataTypes}
                                    filter={(searchText, key) => key.indexOf(searchText) !== -1}
                                    openOnFocus={true}
                                    fullWidth={true}
                                    listStyle={{ maxHeight: 200, overflow: 'auto', fontSize:12}}
                                    textFieldStyle={{fontSize:12}}
                                    style={{width:450}}
                                    />
                            </ToolbarGroup>
                        </GridTile>
                        <GridTile cols={3}>
                            <ToolbarGroup>
                                {/* search dataset by title */}
                                <TextField hintText="Search Datasets" value={this.state.searchText}
                                           onChange={this.handleTextChange}
                                           onKeyPress={this.handleKeyPressed}
                                           style={{fontSize:12, marginLeft:30, width:400}}/>
                                <IconButton iconStyle={{position: "absolute", left: 0, bottom: 10}}
                                            onClick={this.searchDatasets} style={{fontSize:12}}>
                                    <ActionSearch />
                                </IconButton>
                            </ToolbarGroup>
                        </GridTile>
                        <GridTile cols={5}>
                            <ToolbarGroup>
                                <Checkbox
                                    label="Show only my datasets"
                                    checked={this.state.checkedCreatorFilter}
                                    onCheck={this.updateCheckCreatorFilter}
                                    style={{fontSize:12, marginLeft:50, marginRight:-30, width:200}}
                                />
                                <RaisedButton primary={false} style={{display: "inline-block"}}
                                              label="Metadata"
                                              labelPosition="before"
                                              onClick={this.exportJson}
                                              labelStyle={{fontSize:12}}
                                              icon={<ActionAppGet/>}/>
                                <RaisedButton primary={true} style={{display: "inline-block"}}
                                              label="Dataset"
                                              labelPosition="before"
                                              onClick={this.downloadDataset}
                                              labelStyle={{fontSize:12}}
                                              icon={<ActionAppGet/>}/>
                            </ToolbarGroup>
                        </GridTile>
                    </GridList>
                </Toolbar>

                <GridList cols={12} padding={10} style={{padding: "0px 20px 0px 20px"}} cellHeight="auto">
                    {/* data list */}
                    <GridTile cols={4}>
                        <GroupList id="datasets-list" onClick={this.clickDataset} height="400px"
                                   data={this.state.datasets} displayField="dataType"/>
                    </GridTile>

                    {/* rendering data */}
                    <GridTile cols={3}>
                        {middle_column}
                    </GridTile>
                    <GridTile cols={5}>
                        {right_column}
                    </GridTile>
                </GridList>
                </div>
            </MuiThemeProvider>
        )
    }
}
