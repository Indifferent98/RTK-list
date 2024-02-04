import React, { useCallback, useEffect } from "react";
import { TaskType } from "features/TodolistsList/api/todolistsApi";
import { AddItemForm } from "common/components/AddItemForm";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice";
import { TodolistDomain } from "features/TodolistsList/model/todolists/todolistsSlice";
import { FilterTasksButton } from "./FilterTasksButton/FilterTasksButton";
import { TodolistHeader } from "./TodolistHeader/TodolistHeader";
import { Tasks } from "./Tasks/Tasks";

type Props = {
  todolist: TodolistDomain;
  tasks: TaskType[];
};

export const Todolist = React.memo(({ tasks, todolist }: Props) => {
  const { fetchTasksTC, addTaskTC } = useActions(tasksThunks);

  useEffect(() => {
    fetchTasksTC(todolist.id);
  }, []);

  const addTaskHandler = useCallback(
    (title: string) => {
      return addTaskTC({ title, todolistId: todolist.id }).unwrap();
    },
    [addTaskTC, todolist.id],
  );

  return (
    <>
      <TodolistHeader todolist={todolist} />
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <Tasks tasks={tasks} todolist={todolist} />
      <FilterTasksButton todolist={todolist} />
    </>
  );
});
