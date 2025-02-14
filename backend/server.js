const app = require('./app');  // Import the app.js file

const port = process.env.PORT || 8181;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
