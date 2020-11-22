import React, { Component, ChangeEvent } from "react";
import "./login.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Heading } from "../heading/heading";
import { CredentialsModel } from "../../models/credentials-model";
import { UserModel } from "../../models/user-model";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/action-type";
const config = require("../../config.json");
const serverUrl = config.server.url;

interface LoginState {
    credentials: CredentialsModel;
    errors: {
        usernameErr: string;
        passwordErr: string;
    };
};

export class Login extends Component<any, LoginState> {

    constructor(props: any) {
        super(props);
        this.state = {
            credentials: new CredentialsModel(),
            errors: {
                usernameErr: "*",
                passwordErr: "*"
            }
        };
    };

    private setUsername = (args: ChangeEvent<HTMLInputElement>) => {
        const username = args.target.value;
        const credentials = { ...this.state.credentials };
        credentials.username = username;

        const errors = { ...this.state.errors };
        if (username === "") {
            errors.usernameErr = "Missing username";
        }
        else {
            errors.usernameErr = "";
        };

        this.setState({ credentials, errors });
    };

    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        const credentials = { ...this.state.credentials };
        credentials.password = password;

        const errors = { ...this.state.errors };
        if (password === "") {
            errors.passwordErr = "Missing username";
        }
        else {
            errors.passwordErr = "";
        };

        this.setState({ credentials, errors });
    };

    private isFormLegal = () => {
        return this.state.errors.usernameErr === "" &&
            this.state.errors.passwordErr === "";
    };

    private requestLogin = async () => {
        if (!this.isFormLegal()) {
            alert("Please correct all errors!");
            return;
        }

        try {
            const response = await axios.post<UserModel>(serverUrl + "/api/login", this.state.credentials, { withCredentials: true }); // { withCredentials: true } causes the cookie to be sent to server.
            const user = response.data;
            store.dispatch({ type: ActionType.Login, payload: user });
            user.role === "admin" ? this.props.history.push("/admin") : this.props.history.push("/vacations");
        }
        catch (err) {
            alert(err.response ? err.response.data : err.message);
        };
    };

    public render(): JSX.Element {
        return (
            <div className="login">
                <Heading>Welcome to VacationSite</Heading>

                <div id="example">
                    Demo user: user <br />
                    Demo admin: admin <br />
                    Passwords: abc123
                </div>

                <h2>Login</h2>
                <form>

                    <input type="text" placeholder="username"
                        onChange={this.setUsername} value={this.state.credentials.username || ""} /><br />
                    <span className="errMsg">{this.state.errors.usernameErr}</span>
                    <br />
                    <input type="password" placeholder="password"
                        onChange={this.setPassword} value={this.state.credentials.password || ""} /><br />
                    <span className="errMsg">{this.state.errors.passwordErr}</span>
                    <br />

                    <button type="button" onClick={this.requestLogin} disabled={!this.isFormLegal()}>Login</button>
                    <br /><br />

                    <p>New to this site?</p>
                    <NavLink to="/register">Register</NavLink>

                </form>
            </div>
        );
    };
};