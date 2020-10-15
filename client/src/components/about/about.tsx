import React, { Component } from "react";
import "./about.css";
import { Heading } from "../heading/heading";

export class About extends Component {

    public render(): JSX.Element {
        return (
            <div className="about">
                <Heading>About VacationSite</Heading>
                <div className="about-content">
                    <h3>View and Follow Vacations</h3>
                    <p>
                        - Follow / Unfollow vacations <br />
                        - View your followed vacations first <br />
                        - Vacations are then sorted by their start date
                    </p>
                    
                    <h3>Stay Updated in Real Time!</h3>
                    <p>
                        - Users sees if the admin adds, edits, or deletes vacations<br />
                        - The admin sees which vacations are followed / unfollowed
                    </p>
                </div>
            </div>
        );
    };
};