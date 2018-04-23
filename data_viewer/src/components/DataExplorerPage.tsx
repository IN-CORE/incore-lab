import * as React from "react";
import GroupList from "./GroupList";
import { GridList,
    GridTile,
    MenuItem,
    SelectField,
    TextField,
    IconButton,
    RaisedButton,
    ListItem,
    List,
    Divider,
    Toolbar,
    ToolbarGroup
} from "material-ui";
import {Dataset} from "../utils/flowtype";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ActionSearch from "material-ui/svg-icons/action/search";

// application configuration
import config from "../app.config";
import {getHeaderJupyterlab} from "../actions/index";
import {Map} from "./Map";
import FileTable from "./fileTable";

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
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleKeyPressed = this.handleKeyPressed.bind(this);
        this.searchDatasets = this.searchDatasets.bind(this);
        this.clickDataset = this.clickDataset.bind(this);
        this.handleSelectDataType = this.handleSelectDataType.bind(this);
        this.downloadDataset = this.downloadDataset.bind(this);
        this.exportJson = this.exportJson.bind(this);
        this.onClickFileDescriptor = this.onClickFileDescriptor.bind(this);
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

            this.setState({datasets: datasets, dataTypes: typesList})
        } else {
            this.setState({datasets: [], dataTypes: [], dataset: null})
        }

    }

    async searchDatasets() {
        const host = config.dataService;
        let url = '';

        if(this.state.selectedDataType != null && this.state.searchText != '') {
            url = host+"?title="+this.state.searchText+"&type="+encodeURI(this.state.selectedDataType);
        } else if(this.state.selectedDataType != null) {
            url = host+"?type="+encodeURI(this.state.selectedDataType);
        } else if(this.state.searchText != '') {
            url = host + "?title=" + this.state.searchText
        } else {
            url = host
        }

        let response =  await fetch(url, {method: "GET", mode: "cors", headers: await getHeaderJupyterlab()});

        if(response.ok) {
            let datasets = await response.json();

            // select the first one
            if(datasets.length > 0) {
                this.setState({datasets: datasets});
                this.clickDataset(datasets[0]);
            }else {
                this.setState({datasets: datasets});
            }
        } else {
            this.setState({datasets: [], dataTypes:[], dataset: null});
        }
    }

    clickDataset(dataset) {
        this.setState({dataset: dataset, selectedDatasetId: dataset.id, selectedDatasetFormat: dataset.format,
            selectedDatasetFileDescriptors: dataset.fileDescriptors, fileData: []});
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
            this.setState({fileExtension: file_name.split(".").slice(-1).pop()});
            if(this.state.fileExtension === "csv") {
                let filedData = [];
                await text.split("\n").map(row => {
                    filedData.push(row.split(','));
                })

                this.setState({fileData: filedData});
            }
        };

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

    render() {
        let datasetTypes = this.state.dataTypes.map(dataType => {
           return <MenuItem primaryText={dataType} value={dataType} />
        });

        let file_descriptors = this.state.selectedDatasetFileDescriptors.map(file_descriptor => {
            return (<div key={file_descriptor.id}>
                        <ListItem onClick={() =>
                            this.onClickFileDescriptor(this.state.selectedDatasetId, file_descriptor.id,
                                file_descriptor.filename)}
                                  primaryText={file_descriptor.filename} key={file_descriptor.id} style={{fontSize:12}}/>
                        <Divider />
                    </div>);
        });

        let file_contents;
        if(this.state.fileExtension === "csv"){
            file_contents = <FileTable container="data_container" data={this.state.fileData.slice(2, 12)}
                                       colHeaders={this.state.fileData[0]} rowHeaders={false} height={275}/>;
        }else if (this.state.fileExtension === "xml"){
            console.log("xml file do something else");
        }

        let right_column;
        if(this.state.selectedDatasetFormat === "shapefile" || this.state.selectedDatasetFormat === "Network") {
            right_column =
                (<div>
                    <Map datasetId={this.state.selectedDatasetId}/>
                </div>);
        }
        else{
            right_column = (<div>
                <List style={{"overflowY": "auto"}}>
                    {file_descriptors}
                </List>
            </div>);
        }

        return (
            <MuiThemeProvider>
                <Toolbar style={{backgroundColor:"white"}}>
                    {/* dataset type */}
                    <ToolbarGroup>
                        <SelectField hintText="Dataset Type" value={this.state.selectedDataType}
                                     onChange={this.handleSelectDataType} style={{width:300}}>
                            {datasetTypes}
                        </SelectField>
                    </ToolbarGroup>

                    <ToolbarGroup>
                        {/* search dataset by title */}
                        <TextField hintText="Search Datasets" value={this.state.searchText}
                                   onChange={this.handleTextChange}
                                   onKeyPress={this.handleKeyPressed} />
                        <IconButton iconStyle={{position: "absolute", left: 0, bottom: 10}}
                                    onClick={this.searchDatasets}>
                            <ActionSearch />
                        </IconButton>

                        <RaisedButton primary={false} style={{display: "inline-block"}} label="Download Metadata"
                                      onClick={this.exportJson}/>
                        <RaisedButton primary={true} style={{display: "inline-block"}} label="Download Dataset"
                                      onClick={this.downloadDataset}/>
                    </ToolbarGroup>
                </Toolbar>

                <GridList cols={12} padding={10} style={{padding: "20px"}} cellHeight="auto">
                    {/* data list */}
                    <GridTile cols={4}>
                        <GroupList id="datasets-list" onClick={this.clickDataset} height="400px"
                                   data={this.state.datasets} displayField="dataType"/>
                    </GridTile>

                    {/* rendering data */}
                    <GridTile cols={4}>
                        {right_column}
                    </GridTile>
                    <GridTile cols={4}>
                        {file_contents}
                    </GridTile>
                </GridList>
            </MuiThemeProvider>
        )
    }
}
