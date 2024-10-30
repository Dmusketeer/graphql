const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const dotenv = require('dotenv');
const graphqlRoute = require('./routes/graphql');

dotenv.config(); // Load environment variables from .env file
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
  }
};

// Call the connect function
connectDB();

// Setup GraphQL route
app.use('/graphql', graphqlHTTP({
  schema: graphqlRoute.schema,
  rootValue: graphqlRoute.root,
  graphiql: true, // Enable GraphiQL interface for testing
}));

// Export the app for testing
module.exports = app;

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}
