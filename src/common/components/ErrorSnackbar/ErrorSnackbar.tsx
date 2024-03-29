import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAppError } from "../../../app/appSlice";
import { AlertProps, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { selectError } from "app/appSelectors";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export const ErrorSnackbar = () => {
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setAppError({ error: null }));
  };

  const isOpen = error !== null;

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {error}
      </Alert>
    </Snackbar>
  );
};
