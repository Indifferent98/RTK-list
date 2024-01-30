import { Button } from "@mui/material";
import s from "./FilterTasksButton.module.css";
import { TodolistDomain, todolistsActions } from "features/TodolistsList/model/todolists/todolistsSlice";
import { useActions } from "common/hooks";
import React from "react";

type Props = {
  todolist: TodolistDomain;
};
export const FilterTasksButton = ({ todolist }: Props) => {
  const { changeTodolistFilter } = useActions(todolistsActions);
  const onAllClickHandler = () => changeTodolistFilter({ filter: "all", todolistId: todolist.id });
  const onActiveClickHandler = () => changeTodolistFilter({ filter: "active", todolistId: todolist.id });
  const onCompletedClickHandler = () => changeTodolistFilter({ filter: "completed", todolistId: todolist.id });

  return (
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
  );
};
