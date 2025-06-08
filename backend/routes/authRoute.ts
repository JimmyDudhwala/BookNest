import { type NextFunction, Router, type Request, type Response } from "express"
import * as authController from "../controllers/authController"
import { authenticatedUser } from "../middleware/authMiddlerware"
import passport from "passport"
import { generateToken } from "../utils/generateToken"
import type { IUSER } from "../models/Users"

const router = Router()

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/verify-email/:token", authController.verifyEmail)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password/:token", authController.resetPassword)
router.get("/logout", authController.logout)
router.get("/verify-auth", authenticatedUser, authController.checkUSerAuth)

router.get("/test", (req, res) => {
  res.json({
    message: "Auth routes working",
    environment: {
      googleClientId: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
      googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
      frontendUri: process.env.FRONTEND_URI,
    },
  })
})

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URI || "/",
    session: false,
  }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUSER

      if (!user) {
        return res.redirect(process.env.FRONTEND_URI || "/")
      }

      const accessToken = await generateToken(user)

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })

      res.redirect(process.env.FRONTEND_URI || "/")
    } catch (error) {
      next(error)
    }
  },
)

export default router
