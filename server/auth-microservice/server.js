const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

// Initialize express app
const app = express();

// Configure middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://studio.apollographql.com'],
  credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/lab3-auth-db')
  .then(() => console.log('Connected to MongoDB (auth-service)'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});

// Start the server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, cors: false });
  
  const PORT = 4001;
  app.listen(PORT, () => {
    console.log(`🚀 Authentication microservice ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
});