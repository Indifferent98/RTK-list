import { TodolistDomain, todolistsReducer, todolistsThunks } from "./todolists/todolistsSlice";
import { tasksReducer, TasksState } from "./tasks/tasksSlice";
import { Todolist } from "features/TodolistsList/api/todolistsApi";

test("ids should be equals", () => {
  const startTasksState: TasksState = {};
  const startTodolistsState: TodolistDomain[] = [];

  let todolist: Todolist = {
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
