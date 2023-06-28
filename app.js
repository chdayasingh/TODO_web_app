const USER_NAME = "chdayasingh";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

mongoose
  .connect("mongodb://127.0.0.1:27017/todoDB", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const listSchema = new Schema({
  userName: String,
  lists: Object,
});

const List = new model("List", listSchema);

const dayaList = new List({
  userName: "chdayasingh",
  lists: {
    today: [{ title: "Sample" }, { title: "sample2" }],
    important: [{ title: "SampleImp" }],
  },
});

// dayaList.save();

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
  List.findOne({ userName: "chdayasingh" })
    .then((obj) => {
      res.render("home", { userName: obj.userName, list: obj.lists.today });
      // { userName: obj.userName, list: obj.lists.today }
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/home", (req, res) => {
  const newItem = req.body.newItem;
  addNewObjectToList("today", newItem);

  res.redirect("/home");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

async function addNewObjectToList(listName, item) {
  try {
    const updatedList = await List.findOneAndUpdate(
      { userName: USER_NAME },
      { $push: { "lists.today": { title: item } } },
      { new: true }
    );
    console.log(updatedList);
  } catch (error) {
    console.error(error);
  }
}

// // sample users
// const users = [
//   { id: 1, userName: "Daya", list: [] },
//   { id: 2, userName: "Sakhil", list: [] },
// ];

// // randomly picking a user obj
// const randomIndex = Math.floor(Math.random() * users.length);
// const user = users[randomIndex];
