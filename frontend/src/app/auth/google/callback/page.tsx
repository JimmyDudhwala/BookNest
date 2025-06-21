"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authState, toggleLoginDialog } from "@/store/slice/userSlice";

const GoogleCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("Token from URL:", token);

    if (token) {
      toast.success("Google Login Successful!");
      dispatch(authState());
      dispatch(toggleLoginDialog());
      dispatch(toggleLoginDialog());
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      toast.error("Google Login Failed");
      router.push("/login");
    }
  }, []);

  return <div>Processing Google Login...</div>;
};

export default GoogleCallback;
