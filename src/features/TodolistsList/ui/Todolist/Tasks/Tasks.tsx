import { TaskType } from "features/TodolistsList/api/todolistsApi";
import React from "react";
import { Task } from "./Task/Task";
import { TodolistDomain } from "features/TodolistsList/model/todolists/todolistsSlice";
import { TaskStatuses } from "common/enum";
type Props = {
  tasks: TaskType[];
  todolist: TodolistDomain;
};
export const Tasks = ({ tasks, todolist }: Props) => {
  let tasksForTodolist = tasks;

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  return <>{tasksForTodolist && tasks.map((t) => <Task key={t.id} task={t} todolistId={t.todoListId} />)}</>;
};
