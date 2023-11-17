"use client";
import "@/globals.css";
import {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
} from "react";
import { SendPost, SendGet } from "@/tools/send-api";
import { Box, TextField, Card, Button, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/auth-context";
import { MessageContext } from "@/context/message-context";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { resolve } from "path";
import FormTextField from "@/compornets/form-text-field";
import AuthLayout from "@/views/auth/auth-layout";

type Inputs = {
  username: string;
  password: string;
};

const schema: any = yup
  .object({
    username: yup.string().required("必填"),
    password: yup
      .string()
      .min(6, "密碼的最小長度為6個字符")
      .matches(/[0-9]/, "密碼必須包含至少一個數字")
      .matches(/[a-z]/, "密碼必須包含至少一個小寫字母")
      .matches(/[A-Z]/, "密碼必須包含至少一個大寫字母")
      .matches(
        /[^a-zA-Z0-9]/,
        "密碼必須包含至少一個非字母數字字符，如符號或特殊字符"
      )
      .notOneOf(["password", "123456", "abcdef"], "密碼不得包含常見的密碼")
      .required("必填"),
  })
  .required();

export default function LoginView() {
  // hooks
  const message = useContext(MessageContext);
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  // functions
  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => login(data);

  const login = async (data: Inputs) => {
    const res = await SendPost("Authenticate/login", data);
    // console.log(res.token);

    if (!!!res.token) {
      message.showDialog("error", "帳號或密碼錯誤");
    } else {
      message.showDialog("success", "登入成功");
      setTimeout(() => {
        localStorage.setItem("LoginToken", res.token);
        location.replace("/");
      }, 1000);
    }
  };
  const toRegister = () => {
    router.push("./register");
  };

  return (
    <AuthLayout title="登入">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <FormTextField
            label="帳號"
            size="small"
            variant="outlined"
            fullWidth
            name="username"
            form={form}
          ></FormTextField>
          <FormTextField
            label="密碼"
            type="password"
            size="small"
            variant="outlined"
            fullWidth
            name="password"
            form={form}
          ></FormTextField>
        </div>
        <Button fullWidth variant="contained" type="submit" sx={{mt: 4}}>
          登入
        </Button>
      </form>

      <p
        className="underline text-gray-500 mt-2 mb-0 cursor-pointer"
        onClick={() => router.push("./forgot-password")}
      >
        忘記密碼
      </p>
      <Divider sx={{my:2.5}}></Divider>

      <h2>沒有帳號嗎?</h2>
      <Button variant="contained" onClick={toRegister} sx={{width:"25%"}}>
        註冊
      </Button>
    </AuthLayout>
  );
}
