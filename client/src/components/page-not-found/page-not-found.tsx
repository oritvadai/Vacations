import React, { Component } from "react";
import "./page-not-found.css";
import { Heading } from "../heading/heading";

export class PageNotFound extends Component {
    public render(): JSX.Element {
        return (
            <div className="page-not-found"> 
                <Heading>Oops...</Heading>
                <h2>The page you are looking for doesn't exist</h2>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/t3otBjVZzT0?autoplay=1" allow="autoplay" title="Page not Found"></iframe>
            </div>
        );
    };
};