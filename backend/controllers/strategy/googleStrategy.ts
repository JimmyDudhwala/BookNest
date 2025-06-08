import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import dotenv from "dotenv"
import type { Request } from "express"
import Users, { type IUSER } from "../../models/Users"

dotenv.config()

console.log("Setting up Google Strategy with:")
console.log("Client ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set")
console.log("Client Secret:", process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set")
console.log("Callback URL:", process.env.GOOGLE_CALLBACK_URL)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, cb: (error: any, user?: IUSER | false) => void) => {
      console.log("Google Strategy callback executed")
      console.log("Profile ID:", profile.id)
      console.log("Profile emails:", profile.emails)

      const { emails, displayName, photos } = profile

      try {
        let user = await Users.findOne({ email: emails?.[0].value })

        if (user) {
          console.log("Existing user found:", user.email)
          if (!user.profilePicture && photos?.[0]?.value) {
            user.profilePicture = photos?.[0]?.value
            await user.save()
          }
          return cb(null, user)
        }

        console.log("Creating new user for:", emails?.[0]?.value)
        user = await Users.create({
          googleId: profile.id,
          name: displayName,
          email: emails?.[0]?.value,
          profilePicture: photos?.[0]?.value,
          isVerified: true,
          agreeTerms: true,
        })

        console.log("New user created:", user.email)
        cb(null, user)
      } catch (error) {
        console.error("Google Strategy error:", error)
        cb(error)
      }
    },
  ),
)

export default passport
