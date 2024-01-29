import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { todolistsThunks } from "../model/todolists/todolistsSlice";
import { Grid, Paper } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { selectIsLoggedIn } from "features/Auth/model/authSelectors";
import { AddItemForm } from "common/components/AddItemForm";
import { useActions } from "common/hooks";
import { selectTasks, selectTodolists } from "features/todolistsTaskSelector";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const { fetchTodolistsTC, addTodolistTC } = useActions(todolistsThunks);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    fetchTodolistsTC();
  }, [dispatch]);

  const todolists = useSelector(selectTodolists);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const tasks = useSelector(selectTasks);

  const addTodolist = useCallback(
    (title: string) => {
      addTodolistTC(title);
    },
    [dispatch],
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist todolist={tl} tasks={tasks[tl.id]} demo={demo} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
