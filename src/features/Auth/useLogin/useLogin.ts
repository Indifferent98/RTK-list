import { useFormik } from "formik";

import { LoginParamsType } from "features/Auth/api/authApi";
import { useActions } from "common/hooks";
import { authThunks } from "../model/authSlice";

type formikErrorsType = Partial<Omit<LoginParamsType, "captcha">>;
export const useLogin = () => {
  const { LoginTC } = useActions(authThunks);
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

  return { formik, buttonDisableCondition };
};
