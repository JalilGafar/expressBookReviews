const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let user = req.user.data;
  let review = req.body.review;
  let userReview = {};
  userReview[user]  = review
  if (books[isbn]) {
    if (books[isbn].reviews.user ) {
      books[isbn].reviews.user = review
    } else {
      console.log("vue d'ici.");
      books[isbn].reviews = {...books[isbn].reviews, ...userReview};
    }
    
    res.status(200).send(JSON.stringify(books[isbn],null,4))
  } else {
    res.send("Incorrect ISBN !")
  }
  //res.send(user);

 // return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let user = req.user.data;
  if (books[isbn]){
    isReview = Object.keys(books[isbn].reviews).filter(useri=>useri === user )
    if (isReview.length > 0 ){
      let asArray = Object.entries(books[isbn].reviews);
      let filtered = asArray.filter(([key, value]) => key !== user)
      let newReviews = Object.fromEntries(filtered)
      books[isbn].reviews = newReviews;
      //res.status(200).send(filtered)
      res.status(200).send("Review of "+user+" Has ben deleted "+JSON.stringify(books[isbn],null,4))
    }else {
      res.status(200).send(user+" do not have review for this book. "+JSON.stringify(books[isbn],null,4))
    }
  } else {
    res.send("Incorrect ISBN ! ")
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
