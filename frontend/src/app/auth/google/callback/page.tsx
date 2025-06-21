"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authState, toggleLoginDialog } from "@/store/slice/userSlice";

const GoogleCallback = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = Cookies.get("accessToken");
      console.log("Checking token:", token);

      if (token) {
        toast.success("Google Login Successful!");
        dispatch(authState());
        dispatch(toggleLoginDialog());
        setChecking(false);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        // Try again after 500ms
        setTimeout(checkToken, 500);
      }
    };

    checkToken();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>{checking ? "Processing Google login..." : "Redirecting..."}</p>
    </div>
  );
};

export default GoogleCallback;
