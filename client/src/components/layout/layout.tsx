import React, { Component } from "react";
import "./layout.css"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Login } from "../login/login";
import { Vacations } from "../vacations/vacations";
import { Register } from "../register/register";
import { Admin } from "../admin/admin";
import { AddVacation } from "../add-vacation/add-vacation";
import { EditVacation } from "../edit-vacation/edit-vacation";
import { PageNotFound } from "../page-not-found/page-not-found";
import { Menu } from "../menu/menu";
import { Footer } from "../footer/footer";
import { Logout } from "../logout/logout";
import { Chart } from "../chart/chart";
import { About } from "../about/about";

export class Layout extends Component {
    public render(): JSX.Element {
        return (
            <div className="layout">
                <BrowserRouter>
                    <header>
                        <Menu />
                    </header>
                    <main>
                        <Switch>
                            <Route path="/login" component={Login} exact />
                            <Route path="/logout" component={Logout} exact />
                            <Route path="/register" component={Register} exact />
                            <Route path="/vacations" component={Vacations} exact />
                            <Route path="/admin" component={Admin} exact />
                            <Route path="/admin/add-vacation" component={AddVacation} exact />
                            <Route path="/admin/edit-vacation/:id" component={EditVacation} exact />
                            <Route path="/admin/chart" component={Chart} exact />
                            <Route path="/about" component={About} exact />
                            <Redirect from="/" to="/login" exact />
                            <Route component={PageNotFound} />
                        </Switch>
                    </main>
                    <footer>
                        <Footer />
                    </footer>
                </BrowserRouter>
            </div>
        );
    };
};