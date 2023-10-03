"use client"
import { ReactNode, createContext, useEffect, useState } from 'react'
import { SendPost } from '@/tools/send-api';

type Props = {
    children: ReactNode;
};

type UserInfo = {
    userId: string,
    roles: string[]
};

type AuthValuesType = {
    isLogin: boolean,
} & UserInfo;

const defaultProvider: AuthValuesType = {
    isLogin: false,
    userId: "",
    roles: []
};

const AuthContext = createContext(defaultProvider)
const AuthProvider = ({ children }: Props) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo>({ userId: '', roles: [] });

    useEffect(() => {
        SendPost('Authenticate/user-info', null).then((res) => {
            console.log(res.data)
            setUserInfo(res.data)
            setIsLogin(true);
        }).catch((error)=> {
            setIsLogin(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ isLogin, ...userInfo }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };
