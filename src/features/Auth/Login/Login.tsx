import React from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import { selectIsLoggedIn } from "../auth-selectors";
import { authThunks } from "../auth-reducer";
import { useActions } from "common/hooks";
import { LoginParamsType } from "common/api/auth-api";

export const Login = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { LoginTC } = useActions(authThunks);

  type formikErrorsType = Partial<Omit<LoginParamsType, "captcha">>;

  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: formikErrorsType = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.trim().length < 4) {
        errors.password = "Password must be longer";
      }
      return errors;
    },

    onSubmit: (values) => {
      LoginTC(values);
      // formik.resetForm();
    },
  });

  const buttonDisableCondition =
    formik.errors.email ||
    formik.errors.password ||
    formik.errors.rememberMe ||
    !formik.values.email.length ||
    !formik.values.password.length
      ? true
      : false;

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{" "}
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                error={formik.errors.email && formik.touched.email ? true : false}
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email ? <div style={{ color: "red" }}>{formik.errors.email}</div> : null}
              <TextField
                error={formik.errors.password && formik.touched.password ? true : false}
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password && formik.touched.password ? (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              ) : null}
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox {...formik.getFieldProps("rememberMe")} checked={formik.values.rememberMe} />}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"} disabled={buttonDisableCondition}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
