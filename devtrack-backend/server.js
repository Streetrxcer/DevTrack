// Import the required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

// Configure dotenv to read the .env file
dotenv.config();

// Create an Express app
const app = express();

// Connect to the MongoDB Cluster
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection is successful');
    mongoose.connection.once('open', () => {
      console.log('Mongo connected to database: ', mongoose.connection.name);
    });
  } catch (err) {
    console.error('MongoDB connection error: ', err);
    process.exit(1);
  } 
}

connectToDatabase();

// Apply middleware
app.use(cors());                                                          // Allows frontend to connect
app.use(express.json());                                                  // Parses incoming JSON data

// Routes
app.use('/api/tasks', taskRoutes);                                        // This means that all the routes used for the Tasks model will use the prefix '/api/tasks' 
app.use('/api/users', userRoutes);                                        // Similarly, all the routes used for the Users model will use the prefix '/api/users'

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});