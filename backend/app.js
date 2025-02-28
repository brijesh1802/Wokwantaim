

// const dotenv = require('dotenv');
// dotenv.config();
// const cors = require('cors');
// const express = require('express');
// const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// require('./utils/googleConfig');
// require('./utils/facebookConfig');  
// const jwt = require('jsonwebtoken');

// const dbConnect = require('./db/db');
// const candidateRoutes = require('./routes/candidate.route');
// const employerRoutes = require('./routes/employer.route');
// const resetPassRoute = require('./routes/resetPassword.route');
// const jobsListRoute = require('./routes/jobs.route');
// const candidateProfileRoute = require('./routes/candidate.profile.route');
// const authRoute = require('./routes/auth.route');
// const jobApplicationRoutes = require('./routes/job.application');  // Ensure the correct path


// dbConnect();

// const app = express();

// // Allowed origins for CORS
// const allowedOrigins = [
//   'http://localhost:5173',  
//   'https://wokwantaim.vercel.app',
// ];

// // Configure CORS
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);  // Allow the request
//     } else {
//       callback(new Error('Not allowed by CORS'));  // Reject the request
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// app.use(express.json());

// // Google Authentication using Passport.js
// // Set up session handling
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGO_SESSION_URI,  // Ensure this is correctly set in your .env file
//     ttl: 14 * 24 * 60 * 60 // 14 days session expiry
// })
// }));

// // Initialize passport
// app.use(passport.initialize());
// app.use(passport.session());

// // console.log("Registered Passport Strategies:", passport._strategies);


// // Google Login Route
// app.get('/auth/google',
//   passport.authenticate('google', {
//       scope: ['profile', 'email'],  // You can add more scopes if needed
//   })
// );

// // Google Callback Route
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: `${process.env.VERCEL_URL}/` }),  // If auth fails, redirect to home page
//   (req, res) => {


//       const token = jwt.sign(
//                   {  email: req.user.email, },
//                   process.env.JWT_SECRET,
//                   { expiresIn: "7d", algorithm: "HS256"  }
//               );
//       res.redirect(`${process.env.VERCEL_URL}/redirect?token=${token}`);
//   }
// );

// app.get('/auth/facebook',
//   passport.authenticate('facebook', { scope: ['email'] })
// );

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: `${process.env.VERCEL_URL}/` }),
//   (req, res) => {

//       const token = jwt.sign(
//           { email: req.user.email },
//           process.env.JWT_SECRET,
//           { expiresIn: "7d", algorithm: "HS256" }
//       );
//       res.redirect(`${process.env.VERCEL_URL}/redirect?token=${token}`);
//   }
// );
// ;



// // Static file serving for uploads
// app.use('/uploads', express.static('uploads'));

// // Define routes
// app.use('/api/v1/candidates', candidateRoutes);
// app.use('/api/v1/candidates/info', candidateProfileRoute);
// app.use('/api/v1/employers', employerRoutes);
// app.use('/api/v1/auth', resetPassRoute);
// app.use('/api/v1/jobs', jobsListRoute);
// app.use('/api/v1', authRoute);
// app.use("/api/v1/applications", jobApplicationRoutes);



// // Root endpoint
// app.get('/', (req, res) => {
//   res.send('Welcome to HireNest API');
// });


// // Export the app to be used in `server.js`
// module.exports = app;




const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('./utils/googleConfig');
require('./utils/facebookConfig');  
const jwt = require('jsonwebtoken');

const dbConnect = require('./db/db');
const candidateRoutes = require('./routes/candidate.route');
const employerRoutes = require('./routes/employer.route');
const resetPassRoute = require('./routes/resetPassword.route');
const jobsListRoute = require('./routes/jobs.route');
const candidateProfileRoute = require('./routes/candidate.profile.route');
const authRoute = require('./routes/auth.route');
const jobApplicationRoutes = require('./routes/job.application'); 


dbConnect();

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',  
  'https://wokwantaim.vercel.app',
];

// Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));  // Reject the request
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Google Authentication using Passport.js
// Set up session handling
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_SESSION_URI,  // Ensure this is correctly set in your .env file
    ttl: 14 * 24 * 60 * 60 // 14 days session expiry
})
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// console.log("Registered Passport Strategies:", passport._strategies);


// Google Login Route
app.get('/auth/google',
  passport.authenticate('google', {
      scope: ['profile', 'email'],  // You can add more scopes if needed
  })
);

// Google Callback Route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.VERCEL_URL}/` }),  // If auth fails, redirect to home page
  (req, res) => {


      const token = jwt.sign(
                  {  email: req.user.email, },
                  process.env.JWT_SECRET,
                  { expiresIn: "7d", algorithm: "HS256"  }
              );
      res.redirect(`${process.env.VERCEL_URL}/redirect?token=${token}`);
  }
);

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${process.env.VERCEL_URL}/` }),
  (req, res) => {

      const token = jwt.sign(
          { email: req.user.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d", algorithm: "HS256" }
      );
      res.redirect(`${process.env.VERCEL_URL}/redirect?token=${token}`);
  }
);
;



// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Define routes
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/candidates/info', candidateProfileRoute);
app.use('/api/v1/employers', employerRoutes);
app.use('/api/v1/auth', resetPassRoute);
app.use('/api/v1/jobs', jobsListRoute);
app.use('/api/v1', authRoute);
app.use("/api/v1/applications", jobApplicationRoutes);



// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to HireNest API');
});


// Export the app to be used in `server.js`
module.exports = app;

