const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const booksData = books;

    return res.status(200).json({ books: booksData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    const bookDetails = books[isbn];
    return res.status(200).json({ book: isbn });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const authorName = req.params.author;

  try {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const filteredBooks = Object.values(books).filter(
      (book) => book.author === authorName
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json({ books: filteredBooks });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const byTitle = req.params.title;

  try {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const filteredBooks = Object.values(books).filter(
      (book) => book.title === byTitle
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json({ books: filteredBooks });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json({ reviews: books[isbn].reviews });
});

module.exports.general = public_users;
