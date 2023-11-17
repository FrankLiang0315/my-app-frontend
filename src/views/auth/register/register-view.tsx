"use client";
import { useContext } from "react";
import { SendPost } from "@/tools/send-api";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { MessageContext } from "@/context/message-context";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormTextField from "@/compornets/form-text-field";
import AuthLayout from "@/views/auth/auth-layout";

type Inputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const schema = yup
  .object({
    username: yup.string().matches(/^[a-zA-Z0-9]+$/, '只能包含英文和數字').required("必填"),
    email: yup.string().email("信箱格式錯誤").required("必填"),
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
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "確認密碼與密碼不符")
      .required("必填"),
  })
  .required();

export default function RegisterView() {
  const message = useContext(MessageContext);
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: yupResolver(schema),
  });
  const { handleSubmit } = form;

  const register = async (data: Inputs) => {
    const res = await SendPost("Authenticate/register", data);
    // console.log(res);
    if (res?.status !== "Success") {
      message.showDialog("error", res?.message);
      return;
    }
    message.showDialog("success", "帳號創建成功");
    setTimeout(() => {
      location.replace("/login");
    }, 1000);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => register(data);

  return (
    <AuthLayout title="註冊">
      <form onSubmit={handleSubmit(onSubmit)}>
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
            label="電子信箱"
            size="small"
            variant="outlined"
            fullWidth
            name="email"
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
          <FormTextField
            label="確認密碼"
            type="password"
            size="small"
            variant="outlined"
            fullWidth
            name="confirmPassword"
            form={form}
          ></FormTextField>
        </div>
        <Button fullWidth variant="contained" type="submit"  sx={{ mt: 4 }}>
          註冊
        </Button>
      </form>
    </AuthLayout>
  );
}
