const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const { Schema, model } = mongoose;

const taskSchema = new Schema({
  listName: {
    type: String,
    required: true,
  },
  name: String,
  description: String,
  createDate: Date,
  deadline: Date,
  status: Boolean,
});

// const Task = mongoose.model("Task", taskSchema);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  googleId: String,
  displayName: String,
  tasks: [taskSchema],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = {
  userSchema,
  User,
};
