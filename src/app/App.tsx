import React, { useEffect } from "react";
import { ErrorSnackbar } from "../common/components/ErrorSnackbar/ErrorSnackbar";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { CircularProgress, Container } from "@mui/material";
import { selectIsInitialized } from "./appSelectors";
import { authThunks } from "features/Auth/model/authSlice";
import { useActions } from "common/hooks";
import s from "./App.module.css";
import { AppNavBar } from "./AppNavBar";
import { AppRoutes } from "./AppRoutes";

export const App = () => {
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
        <AppRoutes />
      </Container>
    </BrowserRouter>
  );
};
