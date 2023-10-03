"use client"
import { useContext } from 'react';
import { SendPost } from '@/tools/send-api';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { MessageContext } from '@/context/message-context';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import FormTextField from '@/compornets/form-text-field';

type Inputs = {
  email: string;
}
const schema = yup
  .object({
    email: yup.string().email('信箱格式錯誤').required('必填'),
  })
  .required()

export default function ForgotPasswordView() {
  const message = useContext(MessageContext);
  const router = useRouter();


  const form = useForm<Inputs>({
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
  } = form;

  const sendEmail = async (data: Inputs) => {
    const res = await SendPost('Authenticate/forgot-password', data);
    // console.log(res);
    if (res?.status !== 'Success') {
      message.showDialog('error', res?.message);
      return;
    }
    message.showDialog('success', '重置密碼信件已送出，請檢查電子信箱。');
    // setTimeout(() => {
    //   location.replace('/login');
    // }, 1000);
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => sendEmail(data)


  return (
    <div className='w-full'>
      <div className='w-[400px] m-auto p-2  text-center'>
        <h2>忘記密碼</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-2'>
            <FormTextField
              label='電子信箱'
              size='small'
              variant='outlined'
              fullWidth
              name='email'
              form={form}
            ></FormTextField>
          </div>
          <Button className='mt-8 w-full' variant="contained" type='submit'>確認</Button>
        </form>
      </div>
    </div>
  )
}