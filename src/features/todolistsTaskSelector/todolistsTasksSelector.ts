import { AppRootState } from "app/store";

export const selectTodolists = (state: AppRootState) => state.todolists;
export const selectTasks = (state: AppRootState) => state.tasks;
