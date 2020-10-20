import React, { Component, ChangeEvent } from "react";
import "./edit-vacation.css";
import { VacationModel } from "../../models/vacation-model";
import axios from "axios";
import { Heading } from "../heading/heading";
const config = require("../../config.json");
const serverUrl = config.server.url;

interface EditVacationState {
    vacation: VacationModel;
    preview: string;
    errors: {
        destinationErr: string;
        descriptionErr: string;
        startDateErr: string;
        endDateErr: string;
        datesErr: string;
        priceErr: string;
    };
};

export class EditVacation extends Component<any, EditVacationState> {

    private fileInput: HTMLInputElement;

    constructor(props: any) {
        super(props);
        this.state = {
            vacation: new VacationModel(),
            preview: "",
            errors: {
                destinationErr: "",
                descriptionErr: "",
                startDateErr: "",
                endDateErr: "",
                datesErr: "",
                priceErr: ""
            }
        };
    };

    public async componentDidMount() {
        const vacationID = +this.props.match.params.id;
        try {
            const response = await axios.get<VacationModel>(
                serverUrl + "/api/vacations/" + vacationID, { withCredentials: true });
            const vacation = response.data;
            this.setState({ vacation });
            this.setState({ preview: serverUrl + "/api/uploads/" + this.state.vacation.picFileName });
        }
        catch (err) {
            alert(err.message);
        };
    };

    private setDestination = (args: ChangeEvent<HTMLInputElement>) => {
        const destination = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.destination = destination;

        const errors = { ...this.state.errors };
        if (destination === "") {
            errors.destinationErr = "Missing destination";
        }
        else if (destination.length > 50) {
            errors.destinationErr = "Destination too long"
        }
        else {
            errors.destinationErr = "";
        };

        this.setState({ vacation, errors });
    };

    private setDescription = (args: ChangeEvent<HTMLTextAreaElement>) => {
        const description = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.description = description;
        this.setState({ vacation });

        const errors = { ...this.state.errors };
        if (description === "") {
            errors.descriptionErr = "Missing description";
        }
        else if (description.length > 500) {
            errors.descriptionErr = "Description too long"
        }
        else {
            errors.descriptionErr = "";
        };

        this.setState({ vacation, errors });
    };

    private setImage = (args: ChangeEvent<HTMLInputElement>) => {
        const image = args.target.files[0];
        if (!image) {
            return;
        };
        const vacation = { ...this.state.vacation };
        vacation.image = image;
        this.setState({ vacation });

        // Display image on client: 
        var reader = new FileReader();
        reader.onload = event => this.setState({ preview: event.target.result.toString() });
        reader.readAsDataURL(image); // Read the image.
    };

    private setStartDate = (args: ChangeEvent<HTMLInputElement>) => {
        const startDate = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.startDate = startDate;
        this.setState({ vacation });

        const errors = { ...this.state.errors };
        if (startDate === "") {
            errors.startDateErr = "Missing start date";
            errors.datesErr = "";
        }
        else if (this.checkDates(startDate, this.state.vacation.endDate)) {
            errors.datesErr = "End date must be later than start date"
            errors.startDateErr = "";
        }
        else {
            errors.startDateErr = "";
            errors.datesErr = "";
        };

        this.setState({ vacation, errors });
    };

    private setEndDate = (args: ChangeEvent<HTMLInputElement>) => {
        const endDate = args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.endDate = endDate;

        const errors = { ...this.state.errors };
        if (endDate === "") {
            errors.endDateErr = "Missing end date";
            errors.datesErr = "";
        }
        else if (this.checkDates(this.state.vacation.startDate, endDate)) {
            errors.datesErr = "End date must be later than start date"
            errors.endDateErr = "";
        }
        else {
            errors.endDateErr = "";
            errors.datesErr = "";
        };

        this.setState({ vacation, errors });
    };

    private checkDates(startDate: string, endDate: string): boolean {
        const start = new Date(startDate);
        const end = new Date(endDate);
        // return false if any of the dates is missing
        if (!start || !end) {
            return false;
        };
        return (start > end);
    };

    private setPrice = (args: ChangeEvent<HTMLInputElement>) => {
        const price = +args.target.value;
        const vacation = { ...this.state.vacation };
        vacation.price = price;

        const errors = { ...this.state.errors };
        if (!price) {
            errors.priceErr = "Missing price";
        } else if (price < 0) {
            errors.priceErr = "Price can't be negative";
        }
        else if (price > 100000) {
            errors.priceErr = "Price can't exceed 100000";
        }
        else {
            errors.priceErr = "";
        };

        this.setState({ vacation, errors });
    };

    private isFormLegal = () => {
        return this.state.errors.destinationErr === "" &&
            this.state.errors.descriptionErr === "" &&
            this.state.errors.startDateErr === "" &&
            this.state.errors.endDateErr === "" &&
            this.state.errors.datesErr === "" &&
            this.state.errors.priceErr === "";
    };

    private updateVacation = async () => {
        if (!this.isFormLegal()) {
            alert("Please correct all errors!");
            return;
        }
        const myFormData = new FormData();
        myFormData.append("description", this.state.vacation.description);
        myFormData.append("destination", this.state.vacation.destination);
        myFormData.append("startDate", this.state.vacation.startDate);
        myFormData.append("endDate", this.state.vacation.endDate);
        myFormData.append("price", this.state.vacation.price.toString());
        if (this.state.vacation.image && this.state.vacation.image.name) {
            myFormData.append("image", this.state.vacation.image, this.state.vacation.image.name);
        };

        try {
            await axios.put<VacationModel>(serverUrl + "/api/vacations/" +
                this.state.vacation.vacationID, myFormData, { withCredentials: true });
            this.props.history.push("/admin");
        }
        catch (err) {
            alert(err.message);
        };
    };

    public render(): JSX.Element {
        return (
            <div className="add-vacation">
                <Heading>Edit Vacation</Heading>
                <form>
                    <input type="text" onChange={this.setDestination} value={this.state.vacation.destination || ""} /><br />
                    <span className="errMsg">{this.state.errors.destinationErr}</span>
                    <br />

                    <textarea onChange={this.setDescription} value={this.state.vacation.description || ""} /><br />
                    <span className="errMsg">{this.state.errors.descriptionErr}</span>
                    <br />

                    <input type="date" onChange={this.setStartDate} value={this.state.vacation.startDate || ""}
                        min={new Date().toISOString().split("T")[0]} /><br />
                    <span className="errMsg">{this.state.errors.startDateErr}</span>
                    <br />

                    <input type="date" onChange={this.setEndDate} value={this.state.vacation.endDate || ""}
                        min={new Date().toISOString().split("T")[0]} /><br />
                    <span className="errMsg">{this.state.errors.endDateErr} {this.state.errors.datesErr}</span>
                    <br />

                    <input type="number" placeholder="price" onChange={this.setPrice}
                        value={this.state.vacation.price || ""} min="0" /><br />
                    <span className="errMsg">{this.state.errors.priceErr}</span>
                    <br />

                    <input type="file" onChange={this.setImage} accept="image/*" ref={fi => this.fileInput = fi} />
                    <button type="button" onClick={() => this.fileInput.click()}>Select Image</button>
                    <br /><br />

                    <img src={this.state.preview} alt="" />
                    <br /><br />

                    <button type="button" onClick={this.updateVacation} disabled={!this.isFormLegal()}>Submit</button>
                </form>
            </div>
        );
    };
};