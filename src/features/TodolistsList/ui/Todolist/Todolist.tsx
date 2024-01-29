import React, { useCallback, useEffect } from "react";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { Task } from "./Task/Task";
import { TaskType } from "features/TodolistsList/api/todolistsApi";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TaskStatuses } from "common/enum";
import { AddItemForm } from "common/components/AddItemForm";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice";
import {
  TodolistDomain,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistsList/model/todolists/todolistsSlice";
import s from "./todolist.module.css";

type Props = {
  todolist: TodolistDomain;
  tasks: TaskType[];
  demo?: boolean;
};

export const Todolist = React.memo(({ demo = false, tasks, todolist }: Props) => {
  const { removeTodolistTC, changeTodolistTitleTC } = useActions(todolistsThunks);
  const { fetchTasksTC, addTaskTC } = useActions(tasksThunks);
  const { changeTodolistFilter } = useActions(todolistsActions);

  useEffect(() => {
    fetchTasksTC(todolist.id);
  }, []);

  const addTaskHandler = useCallback(
    (title: string) => {
      addTaskTC({ title, todolistId: todolist.id });
    },
    [addTaskTC, todolist.id],
  );

  const removeTodolistHandler = () => {
    removeTodolistTC(todolist.id);
  };
  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitleTC({ todolistId: todolist.id, title });
    },
    [todolist.id, changeTodolistTitleTC],
  );

  const onAllClickHandler = () => changeTodolistFilter({ filter: "all", todolistId: todolist.id });
  const onActiveClickHandler = () => changeTodolistFilter({ filter: "active", todolistId: todolist.id });
  const onCompletedClickHandler = () => changeTodolistFilter({ filter: "completed", todolistId: todolist.id });

  let tasksForTodolist = tasks;

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist &&
          tasksForTodolist.map((t) => {
            return <Task key={t.id} task={t} todolistId={todolist.id} />;
          })}
      </div>
      <div className={s.list}>
        <Button variant={todolist.filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
          All
        </Button>
        <Button
          variant={todolist.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={todolist.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
