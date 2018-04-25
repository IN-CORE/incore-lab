import * as React from "react";
import {ListItem, Divider, List} from "material-ui";
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCubes, faChartLine }
    from "@fortawesome/fontawesome-free-solid";
import FlatPagination from 'material-ui-flat-pagination'

function getTitle(fragility) {
    let title = fragility.authors.join(", ");

    if (fragility.paperReference !== null) {
        title += ` (${fragility.paperReference.yearPublished})`;
    }

    title += ` - ${fragility.legacyId}`;

    return title;
}

export default class GroupList extends React.Component<any, any> {

    constructor(props){
        super(props);
        this.state = {
            offset:0
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
                        this.props.data.slice(this.state.offset, this.state.offset + rowsPerPage).map((fragility) => {
                            // 3d plots
                            if (fragility.is3dPlot) {
                                return (<div key={fragility.id}>
                                    <ListItem onClick={() => this.props.onClick(fragility)} style={{fontSize:12}}>
                                        <FontAwesomeIcon icon={faCubes}
                                                         style={{"display": "inline", marginRight: "5px"}}/>
                                        {getTitle(fragility)}
                                    </ListItem>
                                    <Divider/>
                                </div>);
                            }
                            // 2d plots
                            else {
                                return (<div key={fragility.id}>
                                    <ListItem onClick={() => this.props.onClick(fragility)} style={{fontSize:12}}>
                                        <FontAwesomeIcon icon={faChartLine} style={{"display": "inline",
                                            marginRight: "5px"}}/>
                                        {getTitle(fragility)}
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

