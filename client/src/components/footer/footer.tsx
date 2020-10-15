import React, { Component } from "react";
import "./footer.css";

interface FooterState {
    currentYear: number;
};

export class Footer extends Component<any, FooterState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            currentYear: new Date().getFullYear()
        };
    };

    public render(): JSX.Element {
        return (
            <div className="footer">
                <h5>All Rights Reserved {this.state.currentYear} &copy;</h5>
            </div>
        );
    };
};