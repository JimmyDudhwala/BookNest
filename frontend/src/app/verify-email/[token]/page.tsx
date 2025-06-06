"use client"
import { useVerifyEmailMutation } from "@/store/api"
import { authState, setEmailVerified } from "@/store/slice/userSlice"
import type { RootState } from "@/store/store"
import { useParams } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { CheckCircle, AlertCircle, Loader2, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

const VerifyEmailPage: React.FC = () => {
  const {token} = useParams<{ token: string }>()
  console.log(token)
  const dispatch = useDispatch()
  const [verifyEmail] = useVerifyEmailMutation()
  const isVerifyEmail = useSelector((state: RootState) => state.user.isEmailVerified)

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "alreadyVerified" | "failed">(
    "loading",
  )

  useEffect(() => {
    const verify = async () => {
      if (isVerifyEmail) {
        setVerificationStatus("alreadyVerified")
        return
      }

      try {
        const result = await verifyEmail(token).unwrap()
        if (result.success) {
          dispatch(setEmailVerified(true))
          setVerificationStatus("success")
          dispatch(authState())
          toast.success("Email verified Successfully")
          setTimeout(() => {
            window.location.href = "/"
          }, 3000)
          return
        } else {
          throw new Error(result.message || "verification failed")
        }
      } catch (error) {
        console.log(error)
        setVerificationStatus("failed")
      }
    }

    if (token) {
      verify()
    }
  }, [token, verifyEmail, isVerifyEmail, dispatch])

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center">
            <div className="mb-6">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verifying Your Email</h1>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </div>
        )

      case "success":
        return (
          <div className="text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Email Verified Successfully!</h1>
            <p className="text-gray-600 mb-4">
              Your email has been verified. You will be redirected to the homepage shortly.
            </p>
            <div className="text-sm text-gray-500">Redirecting in 3 seconds...</div>
          </div>
        )

      case "alreadyVerified":
        return (
          <div className="text-center">
            <div className="mb-6">
              <Mail className="w-16 h-16 text-blue-600 mx-auto" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Email Already Verified</h1>
            <p className="text-gray-600 mb-6">Your email address has already been verified.</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Homepage
            </Link>
          </div>
        )

      case "failed":
        return (
          <div className="text-center">
            <div className="mb-6">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-600 mb-6">We couldn't verify your email. The link may be expired or invalid.</p>
            <div className="space-y-3">
              <Link
                href="/resend-verification"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Resend Verification Email
              </Link>
              <div>
                <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Homepage
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

export default VerifyEmailPage
