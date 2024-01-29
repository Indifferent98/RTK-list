import { TaskStatuses, TaskPriorities } from "common/enum";
import { TaskType } from "features/TodolistsList/api/todolistsApi";
import { v1 } from "uuid";
import { todolistsThunks } from "../../todolists/todolistsSlice";
import { TasksStateType, tasksReducer, tasksThunks, UpdateDomainTaskModelType } from "../tasksSlice";

let startState: TasksStateType = {};
beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const endState = tasksReducer(
    startState,
    tasksThunks.removeTaskTC.fulfilled(
      {
        taskId: "2",
        todolistId: "todolistId2",
      },
      "requiredId",
      { taskId: "2", todolistId: "todolistId2" },
    ),
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(2);
  expect(endState["todolistId2"].every((t) => t.id != "2")).toBeTruthy();
});
test("correct task should be added to correct array", () => {
  const endState = tasksReducer(
    startState,
    tasksThunks.addTaskTC.fulfilled(
      {
        task: {
          todoListId: "todolistId2",
          title: "juce",
          status: TaskStatuses.New,
          addedDate: "",
          deadline: "",
          description: "",
          order: 0,
          priority: 0,
          startDate: "",
          id: "id exists",
        },
      },
      "requiredId",
      { title: "juce", todolistId: "todolistId2" },
    ),
  );

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified task should be changed", () => {
  const endState = tasksReducer(
    startState,
    tasksThunks.updateTaskTC.fulfilled(
      { taskId: "2", todolistId: "todolistId2", model: { status: TaskStatuses.New } },
      "requiredId",
      { model: {} as UpdateDomainTaskModelType, taskId: "2", todolistId: "todolistId2" },
    ),
  );

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});
test("title of specified task should be changed", () => {
  const endState = tasksReducer(
    startState,
    tasksThunks.updateTaskTC.fulfilled(
      { taskId: "2", todolistId: "todolistId2", model: { title: "yogurt" } },
      "requiredId",
      { model: {} as UpdateDomainTaskModelType, taskId: "2", todolistId: "todolistId2" },
    ),
  );

  expect(endState["todolistId1"][1].title).toBe("JS");
  expect(endState["todolistId2"][1].title).toBe("yogurt");
  expect(endState["todolistId2"][0].title).toBe("bread");
});
test("new array should be added when new todolist is added", () => {
  const action = todolistsThunks.addTodolistTC.fulfilled(
    {
      todolist: {
        id: "blabla",
        title: "new todolist",
        order: 0,
        addedDate: "",
      },
    },
    "requiredId",
    "123123123",
  );

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
test("propertry with todolistId should be deleted", () => {
  const action = todolistsThunks.removeTodolistTC.fulfilled({ todolistId: "todolistId2" }, "requiredId", "121212");

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});

// test.skip("empty arrays should be added when we set todolists", () => {
//   const action = setTodolists({
//     todolists: [
//       { id: "1", title: "title 1", order: 0, addedDate: "" },
//       { id: "2", title: "title 2", order: 0, addedDate: "" },
//     ],
//   });

//   const endState = tasksReducer({}, action);

//   const keys = Object.keys(endState);

//   expect(keys.length).toBe(2);
//   expect(endState["1"]).toBeDefined();
//   expect(endState["2"]).toBeDefined();
// });

test("tasks should be added for todolist", () => {
  const todolistId3 = v1();
  const todolistId4 = v1();
  const startTasks: TasksStateType = {
    [todolistId4]: [],
    [todolistId3]: [],
  };
  const tasks: TaskType[] = [
    {
      addedDate: "",
      deadline: "",
      description: "",
      id: "32423",
      order: 0,
      priority: TaskPriorities.Low,
      startDate: "asr",
      status: TaskStatuses.New,
      title: "new title",
      todoListId: todolistId3,
    },
    {
      addedDate: "",
      deadline: "",
      description: "",
      id: "32423",
      order: 0,
      priority: TaskPriorities.Low,
      startDate: "asr",
      status: TaskStatuses.New,
      title: "new title2",
      todoListId: todolistId3,
    },
  ];
  const endState = tasksReducer(
    startTasks,
    tasksThunks.fetchTasksTC.fulfilled(
      {
        tasks,
        todolistId: todolistId3,
      },
      "requestId",
      todolistId3,
    ),
  );
  expect(endState[todolistId3].length).toBe(2);
  expect(endState[todolistId4].length).toBe(0);
});
