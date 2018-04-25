import * as React from "react";
import {ListItem, Divider, List} from "material-ui";
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faTable, faFileAlt, faMap, faExchangeAlt, faChartArea, faShareAlt, faQuestionCircle }
    from "@fortawesome/fontawesome-free-solid";
import FlatPagination from 'material-ui-flat-pagination'

export default class GroupList extends React.Component<any, any> {

    constructor(props){
        super(props);
        this.state = {
            offset: 0
        };

    }

    componentWillReceiveProps(nextProps, nextStates){
        // if search, select from dropdowns; page jump to the first
        if (this.props.data !== nextProps.data){
            this.setState({offset: 0});
        }
    }

    render() {
        let rowsPerPage = 5;
        return (
            <div>
                <List style={{"overflowY": "auto", height: "auto"}}>
                    {
                        this.props.data.slice(this.state.offset, this.state.offset + rowsPerPage).map((dataset) => {

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
                <FlatPagination total={this.props.data.length} offset={this.state.offset}
                            limit={rowsPerPage} onClick={(e, offset) => this.setState({offset})}
                                currentPageLabelStyle={{fontSize:12}} otherPageLabelStyle={{fontSize:12}}/>
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
