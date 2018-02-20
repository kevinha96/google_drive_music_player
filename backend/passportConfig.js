let passport = require('passport')
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

import ServerConfig from './ServerConfig'

const {GoogleDriveConfig} = ServerConfig

passport.use(new GoogleStrategy({

        consumerKey: GoogleDriveConfig.appId,
        clientSecret: GoogleDriveConfig.appKey,
        callbackURL: GoogleDriveConfig.callbackURl
    }, (accessToken, refreshToken, profile, done) => {

        User.findOrCreate({googleId: profile.id}, (err, user) => {

            return done(err, user)
        })
    }
))