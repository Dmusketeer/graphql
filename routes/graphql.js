const { buildSchema } = require('graphql');
const bookController = require('../controllers/bookControllers');
const { getBookById,getAllBooks, createBook, updateBook, deleteBook } = require('../controllers/bookControllers');

// GraphQL schema

const schema=buildSchema(`
    
    type Book {
      id: ID!
      title: String!
      author: String!
      price: Float!
    }

    type Query {
      getBook(id: ID!): Book!
      getBooks: [Book]
    }

    input BookInput{
      title:String!
      author:String!
      price:Float!
    }

    type Mutation{
    createBook(input:BookInput):Book
    updateBook(id:ID! , input:BookInput):Book
    deleteBook(id:ID!): String
    }
    
    `)

// GraphQL resolvers

const root = {
    getBook : bookController.getBookById,
    getBooks : bookController.getAllBooks,
    createBook: bookController.createBook,
    updateBook:bookController.updateBook,
    deleteBook:bookController.deleteBook,
}


module.exports = {
    schema,
    root,
  };