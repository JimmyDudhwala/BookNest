"use client"
import { useResetPasswordMutation } from "@/store/api"
import { useParams, useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { CheckCircle, AlertCircle, Loader2, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const [resetStatus, setResetStatus] = useState<"form" | "loading" | "success" | "failed">("form")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})

  useEffect(() => {
    if (!token) {
      setResetStatus("failed")
    }
  }, [token])

  const validateForm = () => {
    const newErrors: { password?: string; confirm?: string } = {}

    if (!newPassword) {
      newErrors.password = "Password is required"
    } else if (newPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirm = "Please confirm your password"
    } else if (newPassword !== confirmPassword) {
      newErrors.confirm = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setResetStatus("loading")

    try {
      const result = await resetPassword({ token, newPassword }).unwrap()

      if (result.success) {
        setResetStatus("success")
        toast.success("Password reset successful!")
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        throw new Error(result.message || "Password reset failed")
      }
    } catch (error: any) {
      console.error(error)
      setResetStatus("failed")
      toast.error(error.data?.message || "Password reset failed")
    }
  }

  const renderContent = () => {
    switch (resetStatus) {
      case "form":
        return (
          <div className="text-center">
            <div className="mb-6">
              <Lock className="w-16 h-16 text-blue-600 mx-auto" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reset Your Password</h1>
            <p className="text-gray-600 mb-6">Enter your new password below</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={errors.confirm ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirm && <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>
        )

      case "loading":
        return (
          <div className="text-center">
            <div className="mb-6">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Resetting Password</h1>
            <p className="text-gray-600">Please wait while we reset your password...</p>
          </div>
        )

      case "success":
        return (
          <div className="text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Password Reset Successfully!</h1>
            <p className="text-gray-600 mb-4">
              Your password has been reset. You will be redirected to the login page shortly.
            </p>
            <div className="text-sm text-gray-500">Redirecting in 3 seconds...</div>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          </div>
        )

      case "failed":
        return (
          <div className="text-center">
            <div className="mb-6">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reset Failed</h1>
            <p className="text-gray-600 mb-6">We couldn't reset your password. The link may be expired or invalid.</p>
            <div className="space-y-3">
              <Link
                href="/forgot-password"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Request New Reset Link
              </Link>
              <div>
                <Link
                  href="/login"
                  className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">{renderContent()}</div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
