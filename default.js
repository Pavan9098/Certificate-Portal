const mongoose = require('mongoose');

// Define schema for your collection
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String
});

// Create a Mongoose model using the schema
const Person = mongoose.model('Person', personSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://Deepak:deepak2703@cluster0.j8pojdz.mongodb.net/new_db?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Get reference to default connection
const db = mongoose.connection;

// Once connected, insert document into the collection
db.once('open', async () => {
  try {
    // Create a new instance of the model with data
    const newPerson = new Person({
      name: 'John Doe',
      age: 30,
      email: 'john.doe@example.com'
    });

    // Save the instance to the database
    await newPerson.save();
    console.log('Document inserted successfully!');
  } catch (error) {
    console.error('Error inserting document:', error);
  } finally {
    mongoose.disconnect();
  }
});
