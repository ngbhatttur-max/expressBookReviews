const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });
  if (users.find(u => u.username === username)) return res.status(400).json({ message: "User already exists" });
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

public_users.get('/', async function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book);
});

public_users.get('/author/:author', async function (req, res) {
  const authorBooks = Object.values(books).filter(b => b.author === req.params.author);
  if (authorBooks.length === 0) return res.status(404).json({ message: "No books found for this author" });
  return res.status(200).json(authorBooks);
});

public_users.get('/title/:title', async function (req, res) {
  const titleBooks = Object.values(books).filter(b => b.title === req.params.title);
  if (titleBooks.length === 0) return res.status(404).json({ message: "No books found with this title" });
  return res.status(200).json(titleBooks);
});

public_users.get('/review/:isbn', async function (req, res) {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!book.reviews || Object.keys(book.reviews).length === 0) return res.status(200).json({ message: "No reviews found for this book." });
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
