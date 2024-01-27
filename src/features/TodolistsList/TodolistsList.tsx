import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { changeTodolistFilter, FilterValuesType, todolistThunks } from "./todolists-reducer";
import { tasksThunks } from "./tasks-reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { selectIsLoggedIn } from "features/Auth/auth-selectors";
import { TaskStatuses } from "common/enum";
import { selectTasks, selectTodolists } from "features/todolists-task-selector";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    dispatch(todolistThunks.fetchTodolistsTC());
  }, [dispatch]);

  const todolists = useSelector(selectTodolists);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const tasks = useSelector(selectTasks);
  const removeTask = useCallback(
    function (id: string, todolistId: string) {
      const thunk = tasksThunks.removeTaskTC({ taskId: id, todolistId });
      dispatch(thunk);
    },
    [dispatch],
  );

  const addTask = useCallback(
    function (title: string, todolistId: string) {
      dispatch(tasksThunks.addTaskTC({ title, todolistId }));
    },
    [dispatch],
  );

  const changeStatus = useCallback(
    function (taskId: string, status: TaskStatuses, todolistId: string) {
      dispatch(tasksThunks.updateTaskTC({ taskId, model: { status }, todolistId }));
    },
    [dispatch],
  );

  const changeTaskTitle = useCallback(
    function (taskId: string, newTitle: string, todolistId: string) {
      dispatch(tasksThunks.updateTaskTC({ taskId, model: { title: newTitle }, todolistId }));
    },
    [dispatch],
  );

  const changeFilter = useCallback(
    function (value: FilterValuesType, todolistId: string) {
      dispatch(changeTodolistFilter({ filter: value, todolistId }));
    },
    [dispatch],
  );

  const removeTodolist = useCallback(
    function (id: string) {
      const thunk = todolistThunks.removeTodolistTC(id);
      dispatch(thunk);
    },
    [dispatch],
  );

  const changeTodolistTitle = useCallback(
    function (todolistId: string, title: string) {
      const thunk = todolistThunks.changeTodolistTitleTC({ title, todolistId });
      dispatch(thunk);
    },
    [dispatch],
  );

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistThunks.addTodolistTC(title));
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
