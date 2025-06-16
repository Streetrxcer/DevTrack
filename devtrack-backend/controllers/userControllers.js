const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.userRegistration = async (req, res) => {
  try {
    const { username, email,password} = req.body;

    // Validates user input and checks if all field values have been provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all the fields' });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate salt, add salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Create a new user with the details provided
    const newUser = new User({
      username,
      email,
      password: hashedPass
    });

    // Push the changes to the DB
    const savedUser = await newUser.save();

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token and basic user info
    res.status(201).json({
      jwtToken,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide the credentials'});
    }

    // Check if the user exists
    const user = User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Comparing the password provided with the user's hashed password [bcrypt.compare() un-hashes the password and checks it]
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      jwtToken,
      user: {
        id: user._id,
        name: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};