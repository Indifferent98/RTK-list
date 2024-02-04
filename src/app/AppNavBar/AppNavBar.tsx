import { AppBar, Toolbar, IconButton, Typography, Button, LinearProgress } from "@mui/material";
import { selectStatus } from "app/appSelectors";
import { useActions } from "common/hooks";
import { selectIsLoggedIn } from "features/Auth/model/authSelectors";
import { authThunks } from "features/Auth/model/authSlice";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";

export const AppNavBar = () => {
  const status = useSelector(selectStatus);
  const { LogOutTC } = useActions(authThunks);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const logOut = useCallback(() => {
    LogOutTC();
  }, []);

  return (
    <AppBar position="relative">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
        <Typography variant="h6">Todolist</Typography>
        {isLoggedIn && (
          <Button color="inherit" onClick={logOut}>
            Log out
          </Button>
        )}
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  );
};
