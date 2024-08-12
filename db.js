// Import mongoose
const mongoose = require('mongoose');

// Set up your MongoDB connection URI
const mongoURI = 'mongodb+srv://Deepak:deepak2703@cluster0.j8pojdz.mongodb.net/project_db?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a promise for the connection
const dbConnectionPromise = new Promise((resolve, reject) => {
  // Event handler for successful connection
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
    resolve(mongoose.connection); // Resolve the promise with the connection object
  });

  // Event handler for connection error
  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
    reject(err); // Reject the promise with the error
  });
});

// Export the promise so that other modules can use it
module.exports = dbConnectionPromise;