const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'tanya_truong_comp308_lab3_jwt_secret';

const resolvers = {
  Query: {
    currentUser: async (_, __, { req }) => {
      // Get token from cookies
      const token = req.cookies.token;
      if (!token) return null;

      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user by id
        const user = await User.findById(decoded.id);
        if (!user) return null;

        return {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        };
      } catch (error) {
        console.error('Token verification failed:', error);
        return null;
      }
    }
  },
  
  Mutation: {
    signup: async (_, { username, email, password }, { res }) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
          $or: [{ email }, { username }]
        });
        
        if (existingUser) {
          throw new Error('User with this email or username already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
          username,
          email,
          password: hashedPassword
        });

        // Save user to database
        const savedUser = await newUser.save();

        // Generate token
        const token = jwt.sign(
          { id: savedUser._id, email: savedUser.email },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return {
          user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            createdAt: savedUser.createdAt
          },
          token
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    login: async (_, { email, password }, { res }) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Invalid email or password');
        }

        // Generate token
        const token = jwt.sign(
          { id: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        return {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
          },
          token
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    logout: (_, __, { res }) => {
      try {
        // Clear cookie
        res.cookie('token', '', {
          httpOnly: true,
          expires: new Date(0)
        });
        
        return true;
      } catch (error) {
        throw new Error('Logout failed');
      }
    }
  }
};

module.exports = resolvers;