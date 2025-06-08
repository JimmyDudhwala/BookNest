"use client"
import { useEffect, useState } from "react";
import { useVerifyAuthMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store"; // Adjust the path to where your store is defined
import { logout, setEmailVerified, setUser } from "../slice/userSlice";
import BookLoader from "@/lib/BookLoader";
import toast from "react-hot-toast";


export default function AuthCheck({children}:{children:React.ReactNode}){
    const [verifyAuth, {isLoading} ] =  useVerifyAuthMutation()
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user.user)
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)

    useEffect(()=>{
        const checkAuth = async()=>{
            try{
                const response = await verifyAuth({}).unwrap();
                
                if(response.success){
                    dispatch(setUser(response.data))
                    dispatch(setEmailVerified(response.data.isVerified))
                   
                }else{
                    dispatch(logout())
                }
            }catch(error){
                dispatch(logout())
                toast("logout" + error)
            }
            finally{
                setIsCheckingAuth(false)
            }
        };

        if(!user && isLoggedIn){
            checkAuth();
        }else{
            setIsCheckingAuth(false)
        }
    },[verifyAuth, dispatch, user, isLoggedIn]) // Added isLoggedIn to dependency array

    if(isLoading || isCheckingAuth){
        return <BookLoader />
    }

    return <>{children}</>
}