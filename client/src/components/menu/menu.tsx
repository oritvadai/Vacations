import React, { Component } from "react";
import "./menu.css";
import { NavLink } from "react-router-dom";
import { UserModel } from "../../models/user-model";
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";

interface MenuState {
    isLoggedIn: boolean;
    user: UserModel;
};

export class Menu extends Component<any, MenuState> {

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            isLoggedIn: store.getState().isLoggedIn,
            user: store.getState().user
        };
    };

    public componentDidMount(): void {
        this.unsubscribeStore = store.subscribe(() => this.setState({
            isLoggedIn: store.getState().isLoggedIn,
            user: store.getState().user
        }));
    };

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    };

    public render() {
        return (
            <div className="menu">
                <div className="menuOptions">
                    {!this.state.user &&
                        <>
                            <NavLink to="/login" activeClassName="active-route" exact>Login</NavLink>
                            <span> | </span>
                            <NavLink to="/register" activeClassName="active-route" exact>Register</NavLink>
                            <span> | </span>
                        </>
                    }

                    {this.state.user && this.state.user.role === "user" &&
                        <>
                            <NavLink to="/vacations" activeClassName="active-route" exact>Vacations</NavLink>
                            <span> | </span>
                        </>
                    }

                    {this.state.user && this.state.user.role === "admin" &&
                        <>
                            <NavLink to="/admin" activeClassName="active-route" exact>Vacations</NavLink>
                            <span> | </span>
                            <NavLink to="/admin/chart" activeClassName="active-route" exact>Chart</NavLink>
                            <span> | </span>
                        </>
                    }
                    
                    <NavLink to="/about" activeClassName="active-route" exact>About</NavLink>
                    <span> | </span>

                    {this.state.isLoggedIn &&
                        <>
                            <NavLink to="/logout" exact>Logout</NavLink>
                            <span> | </span>
                        </>
                    }

                    <span>Hello {this.state.user ? this.state.user.firstName + " " + this.state.user.lastName : "Guest"}!</span>
                </div>
            </div>
        );
    };
};