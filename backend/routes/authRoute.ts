import { type NextFunction, Router, type Request, type Response } from "express"
import * as authController from "../controllers/authController"
import { authenticatedUser } from "../middleware/authMiddlerware"
import passport from "passport"
import { generateToken } from "../utils/generateToken"
import type { IUSER } from "../models/Users"

const router = Router()

// Add debug logging
router.use((req, res, next) => {
  console.log(`Auth Route Hit: ${req.method} ${req.path}`)
  console.log("Query params:", req.query)
  console.log("Full URL:", req.url)
  next()
})

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/verify-email/:token", authController.verifyEmail)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password/:token", authController.resetPassword)
router.get("/logout", authController.logout)
router.get("/verify-auth", authenticatedUser, authController.checkUSerAuth)

// Add a test route
router.get("/test", (req, res) => {
  res.json({
    message: "Auth routes working",
    environment: {
      googleClientId: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
      googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
      frontendUrl: process.env.FRONTEND_URI,
    },
  })
})

router.get("/google", (req, res, next) => {
  console.log("Google auth route hit")
  console.log("Environment variables:")
  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set")
  console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set")
  console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL)

  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next)
})

router.get('/google/callback', 
    passport.authenticate('google', {
      failureRedirect: process.env.FRONTEND_URI || "/",
      session: false
    }),
    async (req, res, next) => {
      try {
        console.log('=== CALLBACK SUCCESS HANDLER START ===');
        console.log('req.user exists:', !!req.user);
        console.log('FRONTEND_URL value:', process.env.FRONTEND_URI);
        console.log('FRONTEND_URL type:', typeof process.env.FRONTEND_URI);
        
        const user = req.user;
        if (!user) {
          console.log('No user found, redirecting to frontend');
          return res.redirect(process.env.FRONTEND_URI || '/');
        }
        
        console.log('User found, generating token...');
        const accessToken = await generateToken(user as IUSER);
        console.log('Token generated successfully');
        
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000
        });
        
        const redirectUrl = process.env.FRONTEND_URI;
        console.log('About to redirect to:', redirectUrl);
        console.log('Redirect URL type:', typeof redirectUrl);
        
        res.redirect(redirectUrl || '/');
        console.log('Redirect executed');
        
      } catch (error) {
        console.error('=== CALLBACK ERROR ===', error);
        next(error);
      }
    }
  );

export default router
