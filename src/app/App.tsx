import React, { useEffect } from "react";
import { TodolistsList } from "../features/TodolistsList/ui/TodolistsList";
import { ErrorSnackbar } from "../common/components/ErrorSnackbar/ErrorSnackbar";
import { useSelector } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { CircularProgress, Container } from "@mui/material";
import { selectIsInitialized } from "./appSelectors";
import { authThunks } from "features/Auth/model/authSlice";
import { Login } from "features/Auth/Login";
import { useActions } from "common/hooks";
import s from "./App.module.css";
import { AppNavBar } from "./AppNavBar";

type Props = {
  demo?: boolean;
};

export const App = ({ demo = false }: Props) => {
  const { initializeAppTC } = useActions(authThunks);

  const isInitialized = useSelector(selectIsInitialized);

  useEffect(() => {
    initializeAppTC();
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
      <AppNavBar />
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
