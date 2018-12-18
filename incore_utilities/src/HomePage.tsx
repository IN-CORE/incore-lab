import * as React from "react";
import {
    TextField, GridTile, GridList, RaisedButton, Paper,
    Divider, MuiThemeProvider
} from "material-ui";

import { login } from "./action"

export class HomePage extends React.Component<any, any>{

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            passwordErrorText: "",
            loginMessage: "",
            loggedIn: false
        };

        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.handleKeyPressed = this.handleKeyPressed.bind(this);
        this.submit = this.submit.bind(this);
    }

    async submit(){
        let { loggedIn, loginMessage } = await login(this.state.username, this.state.password);
        this.setState({
            loginMessage: loginMessage,
            loggedIn: loggedIn
        });
    }

    async handleKeyPressed(event) {
        if (event.charCode === 13) {
            let { loggedIn, loginMessage } = await login(this.state.username, this.state.password);
            this.setState({
                loginMessage: loginMessage,
                loggedIn: loggedIn
            });
        }
    }

    changeUsername(event) {
        this.setState({username: event.target.value});
    }

    async changePassword(event) {
        let password = event.target.value;

        if (password.length <= 6) {
            this.setState({
                passwordErrorText: "Your password must be at least 6 characters long"
            });
        } else {
            this.setState({
                passwordErrorText: ""
            });
        }


        this.setState({password: password});
        if(event.charCode === 13) {
            let loginMessage = await login(this.state.username, this.state.password);
            this.setState({loginMessage: loginMessage});
        }
    }

    render() {
        let loginMessageDisplay;
        if (this.state.loginMessage !== ""){
            if (this.state.loggedIn){
                loginMessageDisplay = (<p style={{
                    color: "#856404",
                    border: "1px solid #ffeeba",
                    backgroundColor: "#fff3cd",
                    padding: ".75rem 1.25rem",
                    borderRadius: "5px"
                }}>{this.state.loginMessage} </p>);
            }
            else{
                loginMessageDisplay = (<p style={{
                    color: "#721c24",
                    border: "1px solid #f5c6cb",
                    backgroundColor: "#f8d7da",
                    padding: ".75rem 1.25rem",
                    borderRadius: "5px"
                }}>{this.state.loginMessage} </p>);
            }
        }

        return (
            <div className="center" style={{display: "block", margin: "auto", width: "500px", paddingTop: "10%"}}>
                <MuiThemeProvider>
                    <Paper zDepth={3} style={{padding: 20}}>
                        <h2>IN-CORE v2 Login</h2>
                        <Divider />
                        <GridList cellHeight="auto" cols={1}>
                            <GridTile>
                                {loginMessageDisplay}
                            </GridTile>
                            <GridTile>
                                <TextField
                                    floatingLabelText="Username"
                                    value={this.state.username}
                                    onChange={this.changeUsername}
                                    style={{width:"100%"}}
                                />
                            </GridTile>

                            <GridTile>
                                <TextField
                                    floatingLabelText="Password"
                                    type="password"
                                    minLength={6}
                                    errorText={this.state.passwordErrorText}
                                    value={this.state.password}
                                    onChange={this.changePassword}
                                    onKeyPress={this.handleKeyPressed}
                                    style={{width:"100%"}}
                                />
                            </GridTile>

                            <GridTile style={{paddingTop: "20px"}}>
                                <RaisedButton primary={true} onClick={this.submit} label="Login" style={{float:"right"}}/>
                            </GridTile>
                        </GridList>
                    </Paper>
                </MuiThemeProvider>
            </div>
        );

    }
}
