const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config()

const authRoutes = require('./routes/auth.route');

const app = express();

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
