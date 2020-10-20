import React, { Component } from "react";
import "./logout.css";
import axios from "axios";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/action-type";
const config = require("../../config.json");
const serverUrl = config.server.url;

export class Logout extends Component<any> {

    public constructor(props: any) {
        super(props);
    };

    public async componentDidMount() {

        try {
            await axios.post(serverUrl + "/api/logout", null, { withCredentials: true });
            store.dispatch({ type: ActionType.Logout });
            this.props.history.push("/login");
        }
        catch (err) {
            alert(err.response ? err.response.data : err.message);
        };
    };

    public render() {
        return (
            <div className="logout"></div>
        );
    };
};