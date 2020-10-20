import React, { Component } from "react";
import "./vacations.css";
import { VacationModel } from "../../models/vacation-model";
import { FollowedModel } from "../../models/followed-model";
import axios from "axios";
import { Heading } from "../heading/heading";
import io from 'socket.io-client';
const config = require("../../config.json");
const serverUrl = config.server.url;

interface VacationsState {
    vacations: VacationModel[],
    followed: FollowedModel[]
};

export class Vacations extends Component<any, VacationsState> {

    // connect to server with socket.io
    private socket = io.connect(serverUrl);

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: [],
            followed: []
        };
    };

    public async componentDidMount() {
        try {
            const response = await axios.get<VacationModel[]>(serverUrl + "/api/vacations", { withCredentials: true }); // { withCredentials: true } causes the cookie to be sent to server.
            const vacations = response.data;
            this.setState({ vacations });
            this.getFollowedVacations();

            this.socket.on("added-vacation", (addedVacation: VacationModel) => {
                let vacations = [...this.state.vacations];
                vacations.push(addedVacation);
                this.setState({ vacations });
            });

            this.socket.on("del-vacation-id", (delVacID: number) => {
                let vacations = this.state.vacations.filter((v: VacationModel) => v.vacationID !== delVacID);
                this.setState({ vacations });
            });

            this.socket.on("updated-vacation", (updatedVacation: VacationModel) => {
                let vacations = this.state.vacations.filter((v: VacationModel) => v.vacationID !== updatedVacation.vacationID);
                vacations.push(updatedVacation);
                this.setState({ vacations });
            });
        }
        catch (err) {
            alert(err.message);
        };
    };

    public async componentWillUnmount() {
        this.socket.disconnect();
    };

    public async getFollowedVacations() {
        try {
            const response = await axios.get<VacationModel[]>(serverUrl + "/api/followed", { withCredentials: true }); // { withCredentials: true } causes the cookie to be sent to server.
            const followed = response.data;
            this.setState({ followed });
            this.addFollowedToVacations()
        }
        catch (err) {
            alert(err.message);
        };
    };

    private addFollowedToVacations(): void {
        let vacations = [...this.state.vacations];
        vacations.forEach(v => {
            let followedArr = this.state.followed.map(f => f.vacationID)
            v.isFollowed = followedArr.includes(v.vacationID)
        });
        this.setState({ vacations });
    };


    private followVacation = async (vacationID: number | undefined) => {
        try {
            await axios.post<FollowedModel>(
                serverUrl + "/api/followers", { vacationID: vacationID }, { withCredentials: true });
            window.location.reload();
        }
        catch (err) {
            alert(err.message);
        };
    };

    private UnFollowVacation = async (vacationID: number | undefined) => {

        try {
            await axios.delete(serverUrl + "/api/followers/" + vacationID, { withCredentials: true });
            window.location.reload();
        }
        catch (err) {
            alert(err.message);
        };
    };

    // sort by followed / unfollowed, and then by start date
    private compareVacations(a: VacationModel, b: VacationModel): number {
        const followedSort = +b.isFollowed - +a.isFollowed;
        if (followedSort !== 0) {
            return followedSort;
        };
        const aDate = new Date(a.startDate).getTime();
        const bDate = new Date(b.startDate).getTime();
        if (aDate - bDate === 0) {
            return 0;
        };
        return (bDate < aDate) ? 1 : -1;
    };

    // format date
    private dateToDMY(dateStr: string): string {
        const date = new Date(dateStr);
        var d = date.getDate().toString().padStart(2, "0");
        var m = (date.getMonth() + 1).toString().padStart(2, "0"); //Month from 0 to 11
        var y = date.getFullYear();
        return `${d}/${m}/${y}`
    };

    public render(): JSX.Element {
        return (
            <div className="vacations">
                <Heading>Available Vacations</Heading>
                {this.state.vacations.sort(this.compareVacations).map(v =>
                    <div className="vacation-cards" key={"vac" + v.vacationID}>
                        {v.isFollowed ?
                            <button id={"unfollow-btn" + v.vacationID} className="unfollow-btn" onClick={() => this.UnFollowVacation(v.vacationID)}>Followed!</button> :
                            <button id={"follow-btn" + v.vacationID} className="follow-btn" onClick={() => this.followVacation(v.vacationID)}>Follow</button>}
                        <h3> {v.destination} </h3>
                        <h4>{this.dateToDMY(v.startDate)} - {this.dateToDMY(v.endDate)}</h4>
                        <div className="vacation-details">
                            <img src={serverUrl + "/api/uploads/" + v.picFileName} alt={v.destination} />
                            <p>{v.description}</p>
                        </div>

                        <h3 className="price"> &euro;{v.price} </h3>
                    </div>
                )}
            </div>
        );
    };
};