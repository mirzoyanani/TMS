import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  creation_date: string;
  end_date: string;
}

interface Status {
  status: string;
}

export interface TasksState {
  tasks: Task[];
  allStatuses: Status[];
}

const initialState: TasksState = {
  tasks: [],
  allStatuses: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setAllStatuses: (state, action: PayloadAction<Task[]>) => {
      state.allStatuses = action.payload;
    },
  },
});

export const { setTasks, setAllStatuses } = tasksSlice.actions;
export default tasksSlice.reducer;
