const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const dbConnect = require('./db/db');
const candidateRoutes = require('./routes/candidate.route');
const employerRoutes = require('./routes/employer.route');
const resetPassRoute = require('./routes/resetPassword.route');
const jobsListRoute = require('./routes/jobs.route');
const candidateProfileRoute = require('./routes/candidate.profile.route');
const authRoute = require('./routes/auth.route');

dbConnect();

const app = express();
const port = process.env.PORT || 8181;

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
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/candidates/info', candidateProfileRoute);
app.use('/api/v1/employers', employerRoutes);
app.use('/api/v1/auth', resetPassRoute);
app.use('/api/v1/jobs',jobsListRoute)
app.use('/api/v1', authRoute);



app.get('/', (req, res) => {
    res.send('Welcome to HireNest API');
}
);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
