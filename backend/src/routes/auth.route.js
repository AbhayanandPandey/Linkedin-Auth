const express = require('express');
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { logoutUser } = require('../controllers/auth.controller');
const router = express.Router();

dotenv.config();
router.use(cookieParser());

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  scope: ['r_emailaddress', 'r_liteprofile']
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

router.get('/linkedin', passport.authenticate('linkedin'));

router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', {
    failureRedirect: process.env.FRONTEND_URL,
    session: true, 
    httpOnly: false,
  }),
  (req, res) => {
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=NoUserInfo`);
    }

    const payload = {
      name: user.displayName || '',
      email: user.emails?.[0]?.value || '',
      picture: user.photos?.[0]?.value || '',
      id: user.id,
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT Sign Error:', err);
        return res.status(500).send('Internal Server Error');
      }

      res.cookie('LinkedInToken', token, {
        httpOnly: true, 
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      });

      const redirectUrl = `${process.env.CLIENT_SUCCESS_URL}?` +
        `name=${encodeURIComponent(payload.name)}&` +
        `email=${encodeURIComponent(payload.email)}&` +
        `picture=${encodeURIComponent(payload.picture)}`;

      return res.redirect(redirectUrl);
    });
  }
);


router.get('/logout', logoutUser);

module.exports = router;
