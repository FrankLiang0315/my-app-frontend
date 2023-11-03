"use client"
import { ReactNode, createContext, useEffect, useState } from 'react'
import { SendPost } from '@/tools/send-api';
import { useRouter } from 'next/navigation';

type Props = {
    children: ReactNode;
};

type UserInfo = {
    userId: string,
    roles: string[]
};

type AuthValuesType = {
    isLogin: boolean,
    getUserInfo: (goToLogin?:boolean) => void;
} & UserInfo;

const defaultProvider: AuthValuesType = {
    isLogin: false,
    getUserInfo: (goToLogin?:boolean) => null,
    userId: "",
    roles: []
};

const AuthContext = createContext(defaultProvider)
const AuthProvider = ({ children }: Props) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo>({ userId: '', roles: [] });

    const route = useRouter();

    useEffect(() => {
        getUserInfo(false);
    }, []);

    const getUserInfo = (goToLogin: boolean = true) => {
        SendPost('Authenticate/user-info', null).then((res) => {
            console.log(res.data)
            setUserInfo(res.data)
            setIsLogin(true);
        }).catch((error) => {
            setIsLogin(false);
            if (goToLogin) route.push('/login');
        });
    };
    


    return (
        <AuthContext.Provider value={{ isLogin, getUserInfo, ...userInfo }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };
