import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import md5 from "md5";

import { loginUser } from "../utils/authService";
import { setAdminUser } from "../../redux/adminSlice";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.literal("admin").default("admin").optional(),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

type LoginResponse = {
  userExist: {
    password: string;
    [k: string]: any;
  };
  [k: string]: any;
};

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "admin",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    const toastId = toast.loading("Authenticating…");
    try {
      const data = (await loginUser(values.email, values.password)) as LoginResponse;

      toast.success("Login successful", { id: toastId });
      dispatch(setAdminUser(data.userExist));

      const currentPasswordHash = md5(data.userExist.password);
      localStorage.setItem("admin_password_ref", currentPasswordHash);

      navigate("/admin/dashboard");
    } catch (err: unknown) {
      const message =
        (err as any)?.message ||
        "Something went wrong. Please check your credentials and try again.";
      toast.error(message, { id: toastId });
      form.setError("root", { type: "server", message });
    } finally {
      setLoading(false);
    }
  };

  return { form, onSubmit, loading };
};

export default useLogin;
