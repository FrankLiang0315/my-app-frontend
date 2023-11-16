"use client"
import { useContext, useEffect, useState } from 'react';
import { SendPost } from '@/tools/send-api';
import { Button } from '@mui/material';
import { notFound, useRouter } from 'next/navigation';
import { MessageContext } from '@/context/message-context';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import FormTextField from '@/compornets/form-text-field';
import { useSearchParams } from 'next/navigation'

type Inputs = {
  password: string;
  confirmPassword: string;
}
const schema = yup
  .object({
    password: yup
      .string()
      .min(6, '密碼的最小長度為6個字符')
      .matches(/[0-9]/, '密碼必須包含至少一個數字')
      .matches(/[a-z]/, '密碼必須包含至少一個小寫字母')
      .matches(/[A-Z]/, '密碼必須包含至少一個大寫字母')
      .matches(/[^a-zA-Z0-9]/, '密碼必須包含至少一個非字母數字字符，如符號或特殊字符')
      .notOneOf(['password', '123456', 'abcdef'], '密碼不得包含常見的密碼')
      .required('必填'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], '確認密碼與密碼不符').required('必填'),
  })
  .required()

export default function ResetPasswordView() {
  const message = useContext(MessageContext);
  const router = useRouter();
  const searchParams = useSearchParams()
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
 


  const form = useForm<Inputs>({
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
  } = form;

  useEffect(()=>{
    setToken(searchParams.get('token'));
    setEmail(searchParams.get('email'));
  },[]);

  const register = async (data: Inputs) => {
    const res = await SendPost('Authenticate/reset-password', {email, token, ...data});
    // console.log(res);
    if (res?.status !== 'Success') {
      message.showDialog('error', res?.message);
      return;
    }
    message.showDialog('success', '設置新密碼成功');
    setTimeout(() => {
      location.replace('/login');
    }, 1000);
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => register(data)

  if (token === null || email === null) {
    return notFound();
  } else {
    return (
      <div className='w-full'>
        <div className='w-[400px] m-auto p-2  text-center'>
          <h2>設置新密碼</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-2'>
              <FormTextField
                label='密碼'
                type='password'
                size='small'
                variant='outlined'
                fullWidth
                name='password'
                form={form}
              ></FormTextField>
              <FormTextField
                label='確認密碼'
                type='password'
                size='small'
                variant='outlined'
                fullWidth
                name='confirmPassword'
                form={form}
              ></FormTextField>
  
            </div>
            <Button fullWidth variant="contained" type='submit' sx={{mt: 4}}>確認</Button>
          </form>
        </div>
      </div>
    )
  }
  
}