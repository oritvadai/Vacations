import React, { Component } from "react";
import "./admin.css"
import { VacationModel } from "../../models/vacation-model";
import { NavLink } from "react-router-dom";
import { Heading } from "../heading/heading";
import axios from "axios";
import io from 'socket.io-client';
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface AdminState {
    vacations: VacationModel[]
}

export class Admin extends Component<any, AdminState> {

    // connect to server with socket.io
    private socket = io.connect("http://localhost:3000");

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: []
        };
    };

    public async componentDidMount() {
        try {
            const response = await axios.get<VacationModel[]>("http://localhost:3000/api/vacations", { withCredentials: true });
            const vacations = response.data;
            this.setState({ vacations });

            this.socket.on("del-vacation-id", (delVacID: number) => {
                let vacations = this.state.vacations.filter((v: VacationModel) => v.vacationID !== delVacID);
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

    public async deleteVacation(vacationID: number | undefined) {
        const answer = window.confirm("Are you sure you want to delete this vacation?");
        if (!answer) {
            return;
        };
        try {
            await axios.delete<VacationModel>(
                "http://localhost:3000/api/vacations/" + vacationID, { withCredentials: true });
        }
        catch (err) {
            alert(err.message);
        };
    };

    // sort by start date:
    private compareVacations(a: VacationModel, b: VacationModel): number {
        const aDate = new Date(a.startDate).getTime();
        const bDate = new Date(b.startDate).getTime();
        if (aDate - bDate === 0) {
            return 0;
        };
        return (bDate < aDate) ? 1 : -1;
    };

    private dateToDMY(dateStr: string): string {
        const date = new Date(dateStr);
        var d = date.getDate().toString().padStart(2, "0");
        var m = (date.getMonth() + 1).toString().padStart(2, "0"); //Month from 0 to 11
        var y = date.getFullYear();
        return `${d}/${m}/${y}`
    };

    public render(): JSX.Element {
        return (
            <div className="admin">
                <Heading>Available Vacations</Heading>
                <NavLink to="/admin/add-vacation">Add Vacation</NavLink> <br />
                {this.state.vacations.sort(this.compareVacations).map(v =>
                    <div className="vacation-cards" key={"vac" + v.vacationID}>
                        <NavLink to="#">
                            <FontAwesomeIcon onClick={() => this.deleteVacation(v.vacationID)} icon={faWindowClose} className="fa-icon fa-2x" />
                        </NavLink>
                        &nbsp;
                        <NavLink to={"/admin/edit-vacation/" + v.vacationID}>
                            <FontAwesomeIcon icon={faPenSquare} className="fa-icon fa-2x" />
                        </NavLink>
                        <h3> {v.destination} </h3>
                        <h4>{this.dateToDMY(v.startDate)} - {this.dateToDMY(v.endDate)}</h4>

                        <div className="vacation-details">
                            <img src={"http://localhost:3000/api/uploads/" + v.picFileName} alt={v.destination} />
                            <p>{v.description}</p>
                        </div>

                        <h3 className="price"> &euro;{v.price} </h3>
                    </div>
                )}
            </div>
        );
    };
};