const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

// JWT Secret (should match auth microservice)
const JWT_SECRET = 'tanya_truong_comp308_lab3_jwt_secret';

// Initialize express app
const app = express();

// Configure middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://studio.apollographql.com'],
  credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/lab3-vital-db')
  .then(() => console.log('Connected to MongoDB (vital-signs-service)'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to extract user from token
const getUserFromToken = async (req) => {
  const token = req.cookies.token;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    const user = await getUserFromToken(req);
    return { user, req, res };
  },
});

// Start the server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, cors: false });
  
  const PORT = 4002;
  app.listen(PORT, () => {
    console.log(`🚀 Vital Signs microservice ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
});