import { createStore, Store } from "@reduxjs/toolkit";
import { persistStore, Persistor } from "redux-persist";
import persistedReducer from "./reducers/persistReducer";
import { TasksState } from "./reducers/tasksSlice";

interface RootState {
  task: TasksState;
}

const store: Store<RootState> = createStore(persistedReducer);

export const persistor: Persistor = persistStore(store);

export default store;
