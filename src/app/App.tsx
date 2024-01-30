import React, { useCallback, useEffect } from "react";
import { TodolistsList } from "../features/TodolistsList/ui/TodolistsList";
import { ErrorSnackbar } from "../common/components/ErrorSnackbar/ErrorSnackbar";
import { useSelector } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { selectIsInitialized, selectStatus } from "./appSelectors";
import { selectIsLoggedIn } from "features/Auth/model/authSelectors";
import { authThunks } from "features/Auth/model/authSlice";
import { Login } from "features/Auth/Login";
import { useActions } from "common/hooks";
import s from "./app.module.css";

type Props = {
  demo?: boolean;
};

export const App = ({ demo = false }: Props) => {
  const { LogOutTC, initializeAppTC } = useActions(authThunks);
  const status = useSelector(selectStatus);
  const isInitialized = useSelector(selectIsInitialized);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    initializeAppTC();
  }, []);

  const logOut = useCallback(() => {
    LogOutTC();
  }, []);

  if (!isInitialized) {
    return (
      <div className={s.circularProgress}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ErrorSnackbar />
      <AppBar position="relative">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logOut}>
              Log out
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList demo={demo} />} />
          <Route path={"/login"} element={<Login />} />
          <Route
            path={"*"}
            element={
              <>
                <h1>404: PAGE NOT FOUND </h1>
                <Link to={"/"}>go to main page</Link>
              </>
            }
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};
