import React, { Component } from "react";
import "./chart.css"
import { Bar } from "react-chartjs-2"
import { Heading } from "../heading/heading";
import { FollowerCountModel } from "../../models/follower-count-model";
import { VacationModel } from "../../models/vacation-model";
import axios from "axios";
import io from 'socket.io-client';


interface ChartState {
    vacations: FollowerCountModel[];
};

export class Chart extends Component<any, ChartState> {

    // connect to server with socket.io
    private socket = io.connect("http://localhost:3000");

    chartReference: React.RefObject<Bar>;

    constructor(props: any) {
        super(props);
        this.chartReference = React.createRef();
        this.state = {
            vacations: []
        };
    };

    public async componentDidMount() {
        try {
            const response = await axios.get<FollowerCountModel[]>("http://localhost:3000/api/followers-count", { withCredentials: true });
            const vacations = response.data;

            this.setState({ vacations });

            this.socket.on("added-follower", async (vacationID: number) => {

                let index = this.state.vacations.findIndex(v => (v.vacationID === vacationID));
                if (index === -1) {
                    // window.location.reload();
                    const response = await axios.get<VacationModel>(
                        "http://localhost:3000/api/vacations/" + vacationID, { withCredentials: true });
                    const addedVacation = response.data;
                    let vacations = [...this.state.vacations];
                    vacations.push(new FollowerCountModel(addedVacation.vacationID, addedVacation.destination, 1));
                    this.setState({ vacations });
                }
                else {
                    let vacations = [...this.state.vacations];
                    vacations[index].count++
                    this.setState({ vacations });
                };
                this.chartReference.current.chartInstance.update();
                this.render();
            });

            this.socket.on("removed-follower", (vacationID: number) => {
                let vacations = this.state.vacations.map(v => {
                    if (v.vacationID === vacationID) {
                        v.count--
                    };
                    return v;
                });

                vacations = vacations.filter(v => v.count !== 0);

                this.setState({ vacations });
                this.chartReference.current.chartInstance.update();
                this.render();
            });
        }
        catch (err) {
            alert(err.message);
        };
    };

    public async componentWillUnmount() {
        this.socket.disconnect();
    };

    public render(): JSX.Element {

        let chartData = {
            labels: this.state.vacations.map(v => v.destination),
            datasets: [
                {
                    label: "Followers",
                    data: this.state.vacations.map(v => v.count),
                    backgroundColor: this.state.vacations.map(v => "SteelBlue")
                }
            ],
        };

        let options = {
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontSize: 20,
                }
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                        fontSize: 20,
                    }
                }],
                xAxes: [{
                    gridLines: { display: false },
                    ticks: {
                        fontSize: 20,
                    }
                }]
            }
        };

        return (
            <div className="chart">
                <Heading>Vacation Followers</Heading>
                <Bar
                    ref={this.chartReference}
                    data={chartData}
                    options={options}
                />
            </div>
        );
    };
};
