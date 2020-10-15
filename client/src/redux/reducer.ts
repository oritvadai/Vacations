import { AppState } from "./app-state";
import { ActionType } from "./action-type";
import { Action } from "./action";

export class Reducer {

    public static reduce(oldAppState: AppState, action: Action): AppState {

        const newAppState = { ...oldAppState };

        switch (action.type) {

            case ActionType.Login:
                newAppState.isLoggedIn = true;
                newAppState.user = action.payload;
                sessionStorage.setItem("user", JSON.stringify(newAppState.user));
                break;

            case ActionType.Logout:
                newAppState.isLoggedIn = false;
                newAppState.user = null;
                sessionStorage.removeItem("user");
                break;

            default: break;
        };

        return newAppState;
    };
};
