import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import tasksSlice from "./tasksSlice";
import { TasksState } from "./tasksSlice";

export interface RootState {
  task: TasksState;
}

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers<RootState>({
  task: tasksSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
