import { UserModel } from "../models/user-model";

export class AppState {
    public isLoggedIn: boolean;
    public user: UserModel;

    public constructor() {
        this.user = JSON.parse(sessionStorage.getItem("user"));
        this.isLoggedIn = this.user !== null;
    };
};