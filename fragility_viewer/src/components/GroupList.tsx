import * as React from "react";
import {ListItem, Divider, List} from "material-ui";
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCubes, faChartLine }
    from "@fortawesome/fontawesome-free-solid";
import Pagination from 'material-ui-pagination';

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
                            (this.state.page -1) * rowsPerPage + rowsPerPage).map((fragility) => {
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
                <Pagination total={Math.ceil(this.props.data.length / rowsPerPage)}
                            current={this.state.page}
                            display={10} onChange={page => this.setState({page})}/>
            </div>
        );
    }
}

