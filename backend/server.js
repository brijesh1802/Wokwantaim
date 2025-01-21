const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const dbConnect = require('./db/db');
const candidateRoutes = require('./routes/candidate.route');
const employerRoutes = require('./routes/employer.route');
dbConnect();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/employers', employerRoutes);

app.get('*', (req, res) => {
    res.status(404).send('404 Not Found: The requested resource could not be found.');
});

app.get('/', (req, res) => {
    res.send('Welcome to HireNest API');
}
);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});