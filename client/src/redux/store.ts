import { createStore } from "redux";
import { Reducer } from "./reducer";
import { AppState } from "./app-state";

export const store = createStore(Reducer.reduce, new AppState());