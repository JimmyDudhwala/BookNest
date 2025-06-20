"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BASE_URL, useForgotPasswordMutation, useLoginMutation, useRegisterMutation } from "@/store/api"
import { authState, toggleLoginDialog } from "@/store/slice/userSlice"
import { CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import Cookies from "js-cookie"
interface AuthPageProps {
  isLoginOpen: boolean
  setIsLoginOpen: (open: boolean) => void
}

interface LoginForm {
  email: string
  password: string
}

interface SignupForm {
  name: string
  email: string
  password: string
  agreeTerms: boolean
}

interface ForgotForm {
  email: string
}

const AuthPage: React.FC<AuthPageProps> = ({ isLoginOpen, setIsLoginOpen }) => {
  const [currentTab, setCurrentTab] = useState<"login" | "signup" | "forgot">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)
  const [forgetLoading, setForgetLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const [register] = useRegisterMutation()
  const [login] = useLoginMutation()
  const [forgot] = useForgotPasswordMutation()

  const dispatch = useDispatch()
  const router = useRouter()

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm<LoginForm>({})

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup },
  } = useForm<SignupForm>({})

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
  } = useForm<ForgotForm>({})

  const onSubmitSignup = async (data: SignupForm) => {
    setSignupLoading(true)

    try {
      const { email, password, name } = data
      const result = await register({ email, password, name }).unwrap()

      if (result.success) {
        toast.success("Verification link sent to email successfully, please verify")
        dispatch(toggleLoginDialog())
      }
    } catch (error) {
      toast.error("Email already registered: " + error)
    } finally {
      setSignupLoading(false)
    }
  }

  const onSubmitLogin = async (data: LoginForm) => {
    setLoginLoading(true)

    try {
      const { email, password } = data
      const result = await login({ email, password }).unwrap()

      if (result.success) {
        toast.success("Login successful")
        dispatch(toggleLoginDialog())
        dispatch(authState())
        window.location.reload()
      }
    } catch (error) {
      toast.error("Login failed: " + error)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    router.push(`${BASE_URL}/auth/google`); // full redirect
  };
  

  // useEffect(() => {
  //   const token = Cookies.get("accessToken");
  //   if (token) {
  //     // Do after-login things:
  //     toast.success("Login successful!");
  //     dispatch(toggleLoginDialog());
  //     dispatch(authState());
  //     window.location.reload();
  //   } else {
  //     toast.error("Login failed");
  //   }
  // }, []);
  
  const onSubmitForgotPassword = async (data: ForgotForm) => {
    setForgetLoading(true)

    try {
      const result = await forgot({ email: data.email }).unwrap()

      if (result.success) {
        toast.success("Password reset link sent to your email")
        setForgotPasswordSuccess(true)
      }
    } catch (error) {
      toast.error("Failed to send forgot password link: " + error)
    } finally {
      setForgetLoading(false)
    }
  }

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold mb-4">Welcome To BookNest</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as "login" | "signup" | "forgot")}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="forgot">Forgot</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSubmitLogin(onSubmitLogin)} className="space-y-4">
                  <div className="relative">
                    <Input
                      {...registerLogin("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="Email"
                      type="email"
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  </div>
                  {errorsLogin.email && <p className="text-red-500 text-sm">{errorsLogin.email.message}</p>}

                  <div className="relative">
                    <Input
                      {...registerLogin("password", {
                        required: "Password is required",
                      })}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    {showPassword ? (
                      <Eye
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={20}
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeOff
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={20}
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                  {errorsLogin.password && <p className="text-red-500 text-sm">{errorsLogin.password.message}</p>}

                  <Button type="submit" className="w-full font-bold" disabled={loginLoading}>
                    {loginLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>

                <div className="flex items-center my-4">
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <div className="mx-2 text-gray-500 text-sm">Or</div>
                  <div className="h-px flex-1 bg-gray-300"></div>
                </div>

                <Button
                  onClick={handleGoogleLogin}
                  className="w-full item-center gap-2 flex justify-center bg-white text-gray-700 border-gray-300 border hover:bg-gray-50"
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                      Login with Google
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSubmitSignup(onSubmitSignup)} className="space-y-4">
                  <div className="relative">
                    <Input
                      {...registerSignup("name", {
                        required: "Name is required",
                      })}
                      placeholder="Name"
                      type="text"
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  </div>
                  {errorsSignup.name && <p className="text-red-500 text-sm">{errorsSignup.name.message}</p>}

                  <div className="relative">
                    <Input
                      {...registerSignup("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="Email"
                      type="email"
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  </div>
                  {errorsSignup.email && <p className="text-red-500 text-sm">{errorsSignup.email.message}</p>}

                  <div className="relative">
                    <Input
                      {...registerSignup("password", {
                        required: "Password is required",
                      })}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    {showPassword ? (
                      <Eye
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={20}
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeOff
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={20}
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                  {errorsSignup.password && <p className="text-red-500 text-sm">{errorsSignup.password.message}</p>}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...registerSignup("agreeTerms", {
                        required: "You must agree to the terms and conditions",
                      })}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-500">I agree to the terms & conditions</label>
                  </div>
                  {errorsSignup.agreeTerms && <p className="text-red-500 text-sm">{errorsSignup.agreeTerms.message}</p>}

                  <Button type="submit" className="w-full font-bold" disabled={signupLoading}>
                    {signupLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Creating account...
                      </>
                    ) : (
                      "Signup"
                    )}
                  </Button>
                </form>

                <div className="flex items-center my-4">
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <div className="mx-2 text-gray-500 text-sm">Or</div>
                  <div className="h-px flex-1 bg-gray-300"></div>
                </div>

                <Button
                  onClick={handleGoogleLogin}
                  className="w-full item-center gap-2 flex justify-center bg-white text-gray-700 border-gray-300 border hover:bg-gray-50"
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                      Signup with Google
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="forgot" className="space-y-4">
                {forgotPasswordSuccess ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
                    <h3 className="text-xl font-semibold text-gray-700">Reset Link Sent</h3>
                    <p className="text-gray-500">
                      A reset link has been sent to your email address. Please check your inbox and follow the
                      instructions to reset your password.
                    </p>
                    <Button
                      onClick={() => {
                        setForgotPasswordSuccess(false)
                      }}
                      className="w-full"
                    >
                      Send Another Link
                    </Button>
                  </motion.div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmitForgot(onSubmitForgotPassword)}>
                    <div className="relative">
                      <Input
                        {...registerForgot("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                        placeholder="Email"
                        type="email"
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    </div>
                    {errorsForgot.email && <p className="text-red-500 text-sm">{errorsForgot.email.message}</p>}

                    <Button type="submit" className="w-full font-bold" disabled={forgetLoading}>
                      {forgetLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <p className="text-sm text-gray-600 text-center">
          By clicking &quot;agree&quot;, you agree to our{" "}
          <Link
            onClick={() => setIsLoginOpen(false)}
            href="/terms-condition"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            onClick={() => setIsLoginOpen(false)}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  )
}

export default AuthPage
