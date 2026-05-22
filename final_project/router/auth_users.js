const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const accessToken = jwt.sign({ username }, "access");
  req.session.authorization = { accessToken };
  return res.status(200).json({ message: "Logged in successfully", accessToken });
});

// Task 8: Add/modify book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const username = req.user.username;
  const book = books[req.params.isbn];
  
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  book.reviews[username] = review;
  return res.status(200).json({ message: "Review posted successfully" });
});

// Task 9: Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const book = books[req.params.isbn];
  
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "No review found by you for this book" });
  }
  
  delete book.reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;