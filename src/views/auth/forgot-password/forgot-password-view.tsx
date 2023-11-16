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
  email: string;
};
const schema = yup
  .object({
    email: yup.string().email("信箱格式錯誤").required("必填"),
  })
  .required();

export default function ForgotPasswordView() {
  const message = useContext(MessageContext);
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: yupResolver(schema),
  });
  const { handleSubmit } = form;

  const sendEmail = async (data: Inputs) => {
    const res = await SendPost("Authenticate/forgot-password", data);
    console.log(res);
    if (res?.status !== "Success") {
      console.log(res.message);
      message.showDialog("error", res?.message);
      return;
    }
    message.showDialog("success", "重置密碼信件已送出，請檢查電子信箱。");
    // setTimeout(() => {
    //   location.replace('/login');
    // }, 1000);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => sendEmail(data);

  return (
    <AuthLayout title="忘記密碼">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <FormTextField
            label="電子信箱"
            size="small"
            variant="outlined"
            fullWidth
            name="email"
            form={form}
          ></FormTextField>
        </div>
        <Button fullWidth variant="contained" type="submit" sx={{mt: 4}}>
          確認
        </Button>
      </form>
    </AuthLayout>
  );
}
