const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// sample users
const users = [
  { id: 1, userName: "Daya", list: [] },
  { id: 2, userName: "Sakhil", list: [] },
];
// randomly picking a user obj
const randomIndex = Math.floor(Math.random() * users.length);
const user = users[randomIndex];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.post("/login", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("home", { userName: user.userName, list: user.list });
});

app.post("/home", (req, res) => {
  const newItem = req.body.newItem;
  user.list.push(newItem);
  //   console.log(user.list);
  res.redirect("/home");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
