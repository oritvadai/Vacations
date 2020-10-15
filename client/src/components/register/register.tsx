import React, { Component, ChangeEvent } from "react";
import "./register.css";
import { UserModel } from "../../models/user-model";
import axios from "axios";
import { Heading } from "../heading/heading";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/action-type";
import { NavLink } from "react-router-dom";

interface RegisterState {
    register: UserModel;
    errors: {
        firstNameErr: string;
        lastNameErr: string;
        usernameErr: string;
        passwordErr: string;
    };
};

export class Register extends Component<any, RegisterState> {

    constructor(props: any) {
        super(props);
        this.state = {
            register: new UserModel(),
            errors: {
                firstNameErr: "*",
                lastNameErr: "*",
                usernameErr: "*",
                passwordErr: "*"
            }
        };
    };

    private setFirstName = (args: ChangeEvent<HTMLInputElement>) => {
        const firstName = args.target.value;
        const register = { ...this.state.register };
        register.firstName = firstName;

        const errors = { ...this.state.errors };
        if (firstName === "") {
            errors.firstNameErr = "Missing first name";
        }
        else if (firstName.length > 50) {
            errors.firstNameErr = "First name too long"
        }
        else {
            errors.firstNameErr = "";
        };

        this.setState({ register, errors });
    };

    private setLastName = (args: ChangeEvent<HTMLInputElement>) => {
        const lastName = args.target.value;
        const register = { ...this.state.register };
        register.lastName = lastName;

        const errors = { ...this.state.errors };
        if (lastName === "") {
            errors.lastNameErr = "Missing last name";
        }
        else if (lastName.length > 50) {
            errors.lastNameErr = "Last name too long"
        }
        else {
            errors.lastNameErr = "";
        };

        this.setState({ register, errors });
    };

    private setUsername = (args: ChangeEvent<HTMLInputElement>) => {
        const username = args.target.value;
        const register = { ...this.state.register };
        register.username = username;

        const errors = { ...this.state.errors };
        if (username === "") {
            errors.usernameErr = "Missing username";
        }
        else if (username.length > 50) {
            errors.usernameErr = "Username too long"
        }
        else {
            errors.usernameErr = "";
        };

        this.setState({ register, errors });
    };

    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        const register = { ...this.state.register };
        register.password = password;

        const errors = { ...this.state.errors };
        if (password === "") {
            errors.passwordErr = "Missing password";
        }
        else if (password.length < 6) {
            errors.passwordErr = "Password too short"
        }
        else if (password.length > 50) {
            errors.passwordErr = "Password too long"
        }
        else {
            errors.passwordErr = "";
        };

        this.setState({ register, errors });
    };

    private isFormLegal = () => {
        return this.state.errors.firstNameErr === "" &&
            this.state.errors.lastNameErr === "" &&
            this.state.errors.usernameErr === "" &&
            this.state.errors.passwordErr === "";
    };

    private requestRegister = async () => {
        if (!this.isFormLegal()) {
            alert("Please correct all errors!");
            return;
        }

        try {
            const response = await axios.post<UserModel>("http://localhost:3000/api/users", this.state.register, { withCredentials: true });
            const user = response.data;
            store.dispatch({ type: ActionType.Login, payload: user });
            this.props.history.push("/vacations");
        }
        catch (err) {
            alert(err.message);
        };
    };

    public render(): JSX.Element {
        return (
            <div className="register">
                <Heading>Register</Heading>
                <form>
                    <p>Enter your details:</p>
                    <input type="text" placeholder="First Name"
                        onChange={this.setFirstName} value={this.state.register.firstName || ""} /><br />
                    <span className="errMsg">{this.state.errors.firstNameErr}</span>
                    <br />

                    <input type="text" placeholder="Last Name"
                        onChange={this.setLastName} value={this.state.register.lastName || ""} /><br />
                    <span className="errMsg">{this.state.errors.lastNameErr}</span>
                    <br />

                    <input type="text" placeholder="username"
                        onChange={this.setUsername} value={this.state.register.username || ""} /><br />
                    <span className="errMsg">{this.state.errors.usernameErr}</span>
                    <br />

                    <input type="password" placeholder="password"
                        onChange={this.setPassword} value={this.state.register.password || ""} /><br />
                    <span className="errMsg">{this.state.errors.passwordErr}</span>
                    <br />

                    <button type="button" onClick={this.requestRegister} disabled={!this.isFormLegal()}>Register</button>
                    <br /><br />

                    <p>Already registered?</p>
                    <NavLink to="/login">Login</NavLink>
                </form>
            </div>
        );
    };
};