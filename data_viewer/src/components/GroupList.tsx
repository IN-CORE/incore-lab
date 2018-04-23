import * as React from "react";
import {ListItem, Divider, List} from "material-ui";
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faTable, faFileAlt, faMap, faExchangeAlt, faChartArea, faShareAlt, faQuestionCircle }
    from "@fortawesome/fontawesome-free-solid";
import Pagination from 'material-ui-pagination';

export default class GroupList extends React.Component<any, any> {

    constructor(props){
        super(props);
        this.state = {
            page: 1
        };

    }

    render() {
        let rowsPerPage = 5;

        return (
            <div>
                <List style={{"overflowY": "auto", height: "auto"}}>
                    {
                        this.props.data.slice((this.state.page -1) * rowsPerPage,
                            (this.state.page -1) * rowsPerPage + rowsPerPage).map((dataset) => {

                            if (dataset.format === 'table') {
                                return (<div key={dataset.id}>
                                    <ListItem onClick={() => this.props.onClick(dataset)} style={{fontSize:12}}>
                                        <FontAwesomeIcon icon={faTable}
                                                         style={{"display": "inline", marginRight: "5px"}}/>
                                        {getTitle(dataset)}
                                    </ListItem>
                                    <Divider/>
                                </div>);
                            }
                            else if (dataset.format === 'textFiles') {
                                return (<div key={dataset.id}>
                                    <ListItem onClick={() => this.props.onClick(dataset)} style={{fontSize:12}}>
                                        <FontAwesomeIcon icon={faFileAlt}
                                                         style={{"display": "inline", marginRight: "5px"}}/>
                                        {getTitle(dataset)}
                                    </ListItem>
                                    <Divider/>
                                </div>);
                            }
                            else if (dataset.format === 'shapefile') {
                                return (<div key={dataset.id}>
                                    <ListItem onClick={() => this.props.onClick(dataset)} style={{fontSize:12}}>
                                        <FontAwesomeIcon icon={faMap}
                                                         style={{"display": "inline", marginRight: "5px"}}/>
                                        {getTitle(dataset)}
                                    </ListItem>
                                    <Divider/>
                                </div>);
                            }
                            else if (dataset.format === 'mapping') {
                                return (<div key={dataset.id}>
                                    <ListItem onClick={() => this.props.onClick(dataset)} style={{fontSize:12}}>
                                        <FontAwesomeIcon icon={faExchangeAlt}
                                                         style={{"display": "inline", marginRight: "5px"}}/>
                                        {getTitle(dataset)}
                                    </ListItem>
                                    <Divider/>
                                </div>);
                            }
                            else if (dataset.format === 'fragility') {
                                return (<div key={dataset.id}>
                                    <ListItem onClick={() => this.props.onClick(dataset)} style={{fontSize:12}}>
                                        <FontAwesomeIcon icon={faChartArea}
                                                         style={{"display": "inline", marginRight: "5px"}}/>
                                        {getTitle(dataset)}
                                    </ListItem>
                                    <Divider/>
                                </div>);
                            }
                            else if (dataset.format === 'Network') {
                                return (<div key={dataset.id}>
                                    <ListItem onClick={() => this.props.onClick(dataset)} style={{fontSize:12}}>
                                        <FontAwesomeIcon icon={faShareAlt} style={{"display": "inline",
                                            marginRight: "5px"}}/>
                                        {getTitle(dataset)}
                                    </ListItem>
                                    <Divider/>
                                </div>);
                            }
                            else {
                                return (<div key={dataset.id}>
                                    <ListItem onClick={() => this.props.onClick(dataset)} style={{fontSize:12}}>
                                        <FontAwesomeIcon icon={faQuestionCircle} style={{"display": "inline",
                                            marginRight: "5px"}}/>
                                        {getTitle(dataset)}
                                    </ListItem>
                                    <Divider/>
                                </div>);
                            }
                        })
                    }
                </List>
                <Pagination total={Math.ceil(this.props.data.length / rowsPerPage)} current={this.state.page}
                            display={10} onChange={page => this.setState({page})}/>
            </div>
        );
    }
}

function getTitle(dataset) {
	let title = dataset.title;

	if(dataset.creator != null) {
		title += " - " + dataset.creator;
	}
	return title;
}
