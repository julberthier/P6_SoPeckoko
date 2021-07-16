require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const helmet = require("helmet");
const session = require('express-session');
const rateLimit = require('express-rate-limit');

//ROUTES 
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//CONNECT TO DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 100,
  message: 'You have exceeded the 100 requests in 24 hrs limit!', 
  headers: true,
});

app.use(rateLimiterUsingThirdParty)

var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

//COOKIES
app.set('trust proxy', 1) // trust first proxy
app.use(session({
   secret : 's3Cur3',
   name : 'sessionId',
   httpOnly: true,
   resave: true,
   saveUninitialized: true,
   expires: expiryDate
  })
);

app.use(helmet());

//HEADERS
app.use((req, res, next) => {
	res.setHeader(
		"Access-Control-Allow-Origin", "*"
		);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
		);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
		);
	next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
