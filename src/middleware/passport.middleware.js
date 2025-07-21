import { configDotenv } from "dotenv";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
configDotenv({ path: './config/dev.env' })


export const googleStrategy = passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/redirect"
}, (accessToken, refreshToken, user, done) => {
    done(null, user);
}));

export const githubStrategy = passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/github/redirect"
}, (accessToken, refreshToken, user, done) => {
    done(null, user);
}));


