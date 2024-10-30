const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

afterAll(async () => {
  await mongoose.connection.close(); // Close the database connection after tests
});

describe('GraphQL API', () => {
  let bookId; // Variable to hold the ID of the created book

  it('creates a new book', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createBook(input: { title: "The Alchemist", author: "Paulo Coelho", price: 9.99 }) {
              id
              title
              author
              price
            }
          }
        `,
      })
      .expect(200);

    // Extract the book ID from the response
    bookId = response.body.data.createBook.id;

    expect(response.body.data.createBook).toHaveProperty('id');
    expect(response.body.data.createBook.title).toBe("The Alchemist");
    expect(response.body.data.createBook.author).toBe("Paulo Coelho");
    expect(response.body.data.createBook.price).toBe(9.99);
  });

  it('fetches all books', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ getBooks { id title author price } }',
      })
      .expect(200);

    expect(response.body.data.getBooks).toBeDefined();
    expect(response.body.data.getBooks.length).toBeGreaterThan(0); // Check that there is at least one book
  });

  it('fetches a book by ID', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            getBook(id: "${bookId}") {
              id
              title
              author
              price
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data.getBook).toBeDefined();
    expect(response.body.data.getBook.id).toBe(bookId);
    expect(response.body.data.getBook.title).toBe("The Alchemist");
  });

  it('updates a book', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            updateBook(id: "${bookId}", input: { title: "The Alchemist - Updated", author: "Paulo Coelho", price: 12.99 }) {
              id
              title
              author
              price
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data.updateBook).toBeDefined();
    expect(response.body.data.updateBook.title).toBe("The Alchemist - Updated");
    expect(response.body.data.updateBook.price).toBe(12.99);
  });

  it('deletes a book', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            deleteBook(id: "${bookId}") {
              id
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data.deleteBook).toBeDefined();
    expect(response.body.data.deleteBook.id).toBe(bookId);
  });

  it('ensures the book is deleted', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `{ getBook(id: "${bookId}") { id title } }`,
      })
      .expect(200);

    expect(response.body.data.getBook).toBeNull(); // Expect the book to be null after deletion
  });
});
