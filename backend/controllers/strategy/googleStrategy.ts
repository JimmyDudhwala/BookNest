import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import dotenv from "dotenv"
import type { Request } from "express"
import Users, { type IUSER } from "../../models/Users"

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, cb: (error: any, user?: IUSER | false) => void) => {
      const { emails, displayName, photos } = profile

      try {
        let user = await Users.findOne({ email: emails?.[0].value })

        if (user) {
          if (!user.profilePicture && photos?.[0]?.value) {
            user.profilePicture = photos?.[0]?.value
            await user.save()
          }
          return cb(null, user)
        }

        user = await Users.create({
          googleId: profile.id,
          name: displayName,
          email: emails?.[0]?.value,
          profilePicture: photos?.[0]?.value,
          isVerified: true,
          agreeTerms: true,
        })

        cb(null, user)
      } catch (error) {
        cb(error)
      }
    },
  ),
)

export default passport
