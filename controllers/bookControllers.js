const Book = require('../models/book');

// Fetch a single book by ID
exports.getBookById = async (args) => {
  try {
    return await Book.findById(args.id);
  } catch (err) {
    throw new Error('Book not found');
  }
};

// Fetch all books
exports.getAllBooks = async () => {
  try {
    return await Book.find();
  } catch (err) {
    throw new Error('Error fetching books');
  }
};

// Create a new book
exports.createBook = async (args) => {
  const { input } = args;
  const newBook = new Book(input);
  try {
    return await newBook.save();
  } catch (err) {
    throw new Error('Error creating book');
  }
};

// Update an existing book
exports.updateBook = async (args) => {
  const { id, input } = args;
  try {
    return await Book.findByIdAndUpdate(id, input, { new: true });
  } catch (err) {
    throw new Error('Error updating book');
  }
};

// Delete a book
exports.deleteBook = async (args) => {
  try {
    await Book.findByIdAndDelete(args.id);
    return 'Book deleted successfully';
  } catch (err) {
    throw new Error('Error deleting book');
  }
};
