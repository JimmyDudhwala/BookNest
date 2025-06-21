"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authState, toggleLoginDialog } from "@/store/slice/userSlice";

const GoogleCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    console.log("Token from cookie:", token);

    if (token) {
      toast.success("Google Login Successful!");
      dispatch(authState());
      dispatch(toggleLoginDialog());
      setTimeout(() => {
        router.push("/"); // or '/dashboard'
      }, 1500);
    } else {
      toast.error("Google Login Failed");
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Processing Google login...</p>
    </div>
  );
};

export default GoogleCallback;
