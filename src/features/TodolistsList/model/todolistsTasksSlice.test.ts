import { TodolistDomainType, todolistsReducer, todolistsThunks } from "./todolists/todolistsSlice";
import { tasksReducer, TasksStateType } from "./tasks/tasksSlice";
import { TodolistType } from "features/TodolistsList/api/todolistsApi";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: TodolistDomainType[] = [];

  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };

  const action = todolistsThunks.addTodolistTC.fulfilled({ todolist }, "requiredId", "123123");

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
