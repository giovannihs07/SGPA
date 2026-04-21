import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { HttpClient } from "@src/helpers";
import { useAuthContext } from "@src/states";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";
export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    saveSession
  } = useAuthContext();
  const {
    enqueueSnackbar
  } = useSnackbar();
  const loginFormSchema = yup.object({
    email: yup.string().email("Please enter valid email").required("Please enter email"),
    password: yup.string().required("Please enter password"),
    rememberMe: yup.boolean().oneOf([true], "Checkbox must be checked").optional()
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: "demo@demo.com",
      password: "password"
    }
  });
  const redirectUrl = useMemo(() => (location.state?.from.pathname, "/"), [location.state]);
  const login = handleSubmit(async values => {
    setLoading(true);
    try {
      const res = await HttpClient.post("/login", values);
      if (res.data.token) {
        saveSession({
          ...(res.data ?? {}),
          token: res.data.token
        });
        navigate(redirectUrl);
      }
    } catch (error) {
      if (error.response?.data?.error) {
        enqueueSnackbar(error.response?.data?.error, {
          variant: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  });
  return {
    loading,
    login,
    redirectUrl,
    isAuthenticated,
    control
  };
}