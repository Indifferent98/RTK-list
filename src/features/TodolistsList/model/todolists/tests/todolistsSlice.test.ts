import { RequestStatus } from "app/appSlice";
import { Todolist } from "features/TodolistsList/api/todolistsApi";
import { v1 } from "uuid";
import { TodolistDomain, todolistsReducer, todolistsThunks, FilterValues, todolistsActions } from "../todolistsSlice";

let todolistId1: string;
let todolistId2: string;
let startState: TodolistDomain[] = [];

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = [
    { id: todolistId1, title: "What to learn", filter: "all", entityStatus: "idle", addedDate: "", order: 0 },
    { id: todolistId2, title: "What to buy", filter: "all", entityStatus: "idle", addedDate: "", order: 0 },
  ];
});

test("correct todolist should be removed", () => {
  const endState = todolistsReducer(
    startState,
    todolistsThunks.removeTodolistTC.fulfilled({ todolistId: todolistId1 }, "requiredId", "1212"),
  );

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  let todolist: Todolist = {
    title: "New Todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };

  const endState = todolistsReducer(
    startState,
    todolistsThunks.addTodolistTC.fulfilled({ todolist }, "requiredId", "12312"),
  );

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(todolist.title);
  expect(endState[0].filter).toBe("all");
});

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist";

  const endState = todolistsReducer(
    startState,
    todolistsThunks.changeTodolistTitleTC.fulfilled({ title: newTodolistTitle, todolistId: todolistId2 }, "reiredId", {
      title: newTodolistTitle,
      todolistId: todolistId2,
    }),
  );

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValues = "completed";

  const endState = todolistsReducer(
    startState,
    todolistsActions.changeTodolistFilter({ filter: newFilter, todolistId: todolistId2 }),
  );

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});
test("todolists should be added", () => {
  const endState = todolistsReducer(
    [],
    todolistsThunks.fetchTodolistsTC.fulfilled({ todolists: startState }, "requiredId", undefined),
  );

  expect(endState.length).toBe(2);
});
test("correct entity status of todolist should be changed", () => {
  let newStatus: RequestStatus = "loading";

  const endState = todolistsReducer(
    startState,
    todolistsActions.changeTodolistEntityStatus({ status: newStatus, todolistId: todolistId2 }),
  );

  expect(endState[0].entityStatus).toBe("idle");
  expect(endState[1].entityStatus).toBe(newStatus);
});
