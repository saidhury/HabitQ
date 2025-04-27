const db = require('../models');
const User = db.User;
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).send({ message: 'Username, email, and password are required.' });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ where: { [db.Sequelize.Op.or]: [{ email }, { username }] } });
    if (existingUser) {
      return res.status(400).send({ message: 'Username or email already exists.' });
    }

    // Create user (password hashing handled by hook in model)
    const user = await User.create({
      username,
      email,
      passwordHash: password // Pass plain password, hook will hash it
    });

    // Don't send password hash back
    user.passwordHash = undefined;

    res.status(201).send({ message: 'User registered successfully!', user });

  } catch (error) {
    res.status(500).send({ message: error.message || 'Error registering user.' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send({ message: 'Invalid Credentials.' }); // User not found
    }

    // Use instance method to validate password
    const passwordIsValid = await user.isValidPassword(password);

    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: 'Invalid Credentials.' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h' // e.g., 24 hours
    });

    // Don't send password hash back
    user.passwordHash = undefined;

    res.status(200).send({
      user: { // Send necessary user info
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        avatarState: user.avatarState
      },
      accessToken: token
    });

  } catch (error) {
    res.status(500).send({ message: error.message || 'Error logging in.' });
  }
};

// Placeholder for getting current user (requires JWT middleware)
// exports.getMe = async (req, res) => {
//   try {
//     // req.userId should be attached by the verifyToken middleware
//     const user = await User.findByPk(req.userId, {
//       attributes: { exclude: ['passwordHash'] } // Exclude sensitive info
//     });
//     if (!user) {
//       return res.status(404).send({ message: 'User not found.' });
//     }
//     res.status(200).send(user);
//   } catch (error) {
//      res.status(500).send({ message: error.message || 'Error fetching user profile.' });
//   }
// }