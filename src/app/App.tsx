import React, { useCallback, useEffect } from "react";
import "./App.css";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
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
import { selectIsInitialized, selectStatus } from "./app-selectors";
import { selectIsLoggedIn } from "features/Auth/auth-selectors";
import { authThunks } from "features/Auth/auth-reducer";
import { Login } from "features/Auth/Login";
import { useActions } from "common/hooks";

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const { LogOutTC, initializeAppTC } = useActions(authThunks);

  const status = useSelector(selectStatus);
  const isInitialized = useSelector(selectIsInitialized);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    initializeAppTC();
  }, []);

  const logoutHandler = useCallback(() => {
    LogOutTC();
  }, []);

  if (!isInitialized) {
    return (
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">News</Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
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
      </div>
    </BrowserRouter>
  );
}

export default App;
