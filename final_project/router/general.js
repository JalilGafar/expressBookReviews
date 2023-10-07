const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
/*
public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify(books,null,4))
});
*/

///******Get the book list available in the shop using Promise callbacks or async-await with Axios
public_users.get('/', async(req, res) =>{
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 3000)
  });
  let result = await promise;
  res.status(200).send(JSON.stringify(result,null,4));
  //throw new Error("Whoops!");
})


// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn],null,4))
  } else {
    res.send("Incorrect ISBN !")
  }
});
*/
// Get book details based on ISBN using Promise callbacks or async-await with Axios
public_users.get('/isbn/:isbn', async(req, res)=>{
  let promise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    try {
      setTimeout(() => {
        let data = JSON.stringify(books[isbn],null,4);
        resolve(data);
      }, 3000)
    } catch (error) {
      reject("error")
    }
  });
  let result = await promise;
  res.status(200).send(result);
})

  
// Get book details based on author
/*
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let authorBook = Object.values(books).filter(book=>book.author === author);
  if (authorBook.length > 0) {
    res.status(200).send(authorBook);
  } else {
    res.send("There is no book of "+author+" in our database !")
  }
});
*/

// Get book details based on author using Promise callbacks or async-await with Axios
public_users.get('/author/:author', async(req, res)=>{
  let promise = new Promise((resolve, reject) => {
    const author = req.params.author;
    let authorBook = Object.values(books).filter(book=>book.author === author);
    try {
      setTimeout(() => {
        let data = authorBook;
        if (authorBook.length > 0) {
          resolve(data);
        } else {
          resolve("There is no book of "+author+" in our database !")
        }
      }, 3000)
    } catch (error) {
      reject("error")
    }
  });
  let result = await promise;
  res.status(200).send(result);
});

// Get all books based on title
/*
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let titleBook = Object.values(books).filter(book=>book.title === title);
  if (titleBook.length > 0) {
    res.status(200).send(titleBook);
  }else {
    res.send("There is no book with title "+title+" in our database !")
  }
});
*/

// Get all books based on title using Promise callbacks or async-await with Axios
public_users.get('/title/:title', async(req, res)=> {
  let promise = new Promise((resolve, reject) => {
    const title = req.params.title;
    let titleBook = Object.values(books).filter(book=>book.title === title);
    try {
      setTimeout(() => {
        let data = titleBook;
        if (titleBook.length > 0) {
          resolve(data);
        } else {
          resolve("There is no book with title "+title+" in our database !");
        }
      }, 3000)
    } catch (error) {
      reject("error")
    }
  });
  let result = await promise;
  res.status(200).send(result);
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbnReview = req.params.isbn;
  if (books[isbnReview]) {
    let review = books[isbnReview].reviews
    res.status(200).send(review)
  } else {
    res.send("Incorrect ISBN !")
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
