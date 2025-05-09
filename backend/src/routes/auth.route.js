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
  scope: ['r_emailaddress', 'r_liteprofile'],
}, function (accessToken, refreshToken, profile, done){
  console.log('LinkedIn profile:', profile);
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

router.get('/linkedin', (req, res) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.CALLBACK_URL,
    state: Math.random().toString(36).substring(2, 15),
    scope: ['r_emailaddress', 'r_liteprofile'],
  });

  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`);
  
});

router.get('/linkedin/callback',
    
  passport.authenticate('linkedin', { failureRedirect: `${process.env.FRONTEND_URL}` }),
  (req, res) => {
    const user = req.user;

    jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT Sign Error:', err);
        return res.status(500).send('Internal Server Error');
      }

      res.cookie('LinkedInToken', token, {
        httpOnly: false,
        maxAge: 3600000 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      const redirectUrl = `${process.env.CLIENT_SUCCESS_URL}` +
        `?name=${encodeURIComponent(user.displayName)}` +
        `&email=${encodeURIComponent(user.emails?.[0]?.value || '')}` +
        `&picture=${encodeURIComponent(user.photos?.[0]?.value || '')}`;

      res.redirect(redirectUrl);
    });
  }
);

router.get('/logout', logoutUser);

module.exports = router;
