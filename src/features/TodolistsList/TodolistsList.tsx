import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { FilterValuesType, todolistsActions, todolistsThunks } from "./todolists-reducer";
import { tasksThunks } from "./tasks-reducer";
import { Grid, Paper } from "@mui/material";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { selectIsLoggedIn } from "features/Auth/api/auth-selectors";
import { TaskStatuses } from "common/enum";
import { selectTasks, selectTodolists } from "features/todolists-task-selector";
import { AddItemForm } from "common/components/AddItemForm";
import { useActions } from "common/hooks";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const { fetchTodolistsTC, removeTodolistTC, changeTodolistTitleTC, addTodolistTC } = useActions(todolistsThunks);
  const { removeTaskTC, addTaskTC, updateTaskTC } = useActions(tasksThunks);
  const { changeTodolistFilter } = useActions(todolistsActions);
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
  const removeTask = useCallback(
    function (id: string, todolistId: string) {
      removeTaskTC({ taskId: id, todolistId });
    },
    [dispatch],
  );

  const addTask = useCallback(
    function (title: string, todolistId: string) {
      addTaskTC({ title, todolistId });
    },
    [dispatch],
  );

  const changeStatus = useCallback(
    function (taskId: string, status: TaskStatuses, todolistId: string) {
      updateTaskTC({ taskId, model: { status }, todolistId });
    },
    [dispatch],
  );

  const changeTaskTitle = useCallback(
    function (taskId: string, newTitle: string, todolistId: string) {
      updateTaskTC({ taskId, model: { title: newTitle }, todolistId });
    },
    [dispatch],
  );

  const changeFilter = useCallback(
    function (value: FilterValuesType, todolistId: string) {
      changeTodolistFilter({ filter: value, todolistId });
    },
    [dispatch],
  );

  const removeTodolist = useCallback(
    function (id: string) {
      removeTodolistTC(id);
    },
    [dispatch],
  );

  const changeTodolistTitle = useCallback(
    function (todolistId: string, title: string) {
      changeTodolistTitleTC({ title, todolistId });
    },
    [dispatch],
  );

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
                <Todolist
                  todolist={tl}
                  tasks={tasks[tl.id]}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
