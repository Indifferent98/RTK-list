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
import s from "./todolistsList.module.css";

type Props = {
  demo?: boolean;
};

export const TodolistsList: React.FC<Props> = ({ demo = false }) => {
  const { fetchTodolistsTC, addTodolistTC } = useActions(todolistsThunks);

  const todolists = useSelector(selectTodolists);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const tasks = useSelector(selectTasks);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    fetchTodolistsTC();
  }, [dispatch]);

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
      <Grid container className={s.grid}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={4}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id} className={s.grid}>
              <Paper className={s.paper}>
                <Todolist todolist={tl} tasks={tasks[tl.id]} demo={demo} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
