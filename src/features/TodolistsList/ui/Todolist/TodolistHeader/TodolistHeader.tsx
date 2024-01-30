import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { useActions } from "common/hooks";
import { TodolistDomain, todolistsThunks } from "features/TodolistsList/model/todolists/todolistsSlice";
import React from "react";

type Props = {
  todolist: TodolistDomain;
};
export const TodolistHeader = ({ todolist }: Props) => {
  const { removeTodolistTC, changeTodolistTitleTC } = useActions(todolistsThunks);
  const removeTodolistHandler = () => {
    removeTodolistTC(todolist.id);
  };
  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitleTC({ todolistId: todolist.id, title });
  };

  return (
    <h3>
      <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
      <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  );
};
