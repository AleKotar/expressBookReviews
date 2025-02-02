const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.find((user) => user.username === username);
  return !!user;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const validUser = users.find(
    (user) => user.username === username && user.password === password
  );

  return !!validUser;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      {
        expiresIn: 60 * 60,
      }
    );

    req.session.authorization = { accessToken, username };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).send("Invalid Login. check username and password");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  const username = req.session.authorization["username"];

  if (!username) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review modified successfully.",
      reviews: books[isbn].reviews,
    });
  } else {
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review added successfully.",
      reviews: books[isbn].reviews,
    });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
