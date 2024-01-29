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

type Props = {
  todolist: TodolistDomain;
  tasks: TaskType[];
  demo?: boolean;
};

export const Todolist = React.memo(({ demo = false, ...props }: Props) => {
  const { removeTodolistTC, changeTodolistTitleTC } = useActions(todolistsThunks);
  const { fetchTasksTC, addTaskTC } = useActions(tasksThunks);
  const { changeTodolistFilter } = useActions(todolistsActions);

  useEffect(() => {
    fetchTasksTC(props.todolist.id);
  }, []);

  const addTaskHandler = useCallback(
    (title: string) => {
      addTaskTC({ title, todolistId: props.todolist.id });
    },
    [addTaskTC, props.todolist.id],
  );

  const removeTodolistHandler = () => {
    removeTodolistTC(props.todolist.id);
  };
  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitleTC({ todolistId: props.todolist.id, title });
    },
    [props.todolist.id, changeTodolistTitleTC],
  );

  const onAllClickHandler = () => changeTodolistFilter({ filter: "all", todolistId: props.todolist.id });
  const onActiveClickHandler = () => changeTodolistFilter({ filter: "active", todolistId: props.todolist.id });
  const onCompletedClickHandler = () => changeTodolistFilter({ filter: "completed", todolistId: props.todolist.id });

  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist &&
          tasksForTodolist.map((t) => {
            return <Task key={t.id} task={t} todolistId={props.todolist.id} />;
          })}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button
          variant={props.todolist.filter === "all" ? "outlined" : "text"}
          onClick={onAllClickHandler}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={props.todolist.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={props.todolist.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
