const predefinedLists = ["today", "important", "inbox"];

const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/", (req, res) => {
  res.redirect("inbox");
});

router.get("/inbox", ensureAuthenticated, async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = await User.findOne({ username: req.user.username });
      // console.log(user);
      const customListNames = Array.from(
        new Set(user.tasks.map((task) => task.listName))
      ).filter((listName) => !predefinedLists.includes(listName));
      res.render("tasks", {
        listName: "inbox",
        list: user.tasks,
        displayName: user.displayName,
        customListNames,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/:listName", ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    const tasks = user.tasks.filter(
      (task) => task.listName === req.params.listName
    );
    const customListNames = Array.from(
      new Set(user.tasks.map((task) => task.listName))
    ).filter((listName) => !predefinedLists.includes(listName));
    res.render("tasks", {
      listName: req.params.listName,
      list: tasks,
      displayName: user.displayName,
      customListNames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/:listName", ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    const newItem = {
      listName: req.params.listName,
      name: req.body.newItemName,
      createDate: new Date(),
      status: false,
    };
    user.tasks.push(newItem);
    await user.save();
    res.redirect(`/tasks/${req.params.listName}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/:listName/delete", ensureAuthenticated, async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.user.id },
      { $pull: { tasks: { _id: req.body.deleteButton } } }
    );
    if (result.nModified === 0) {
      return res.status(404).send("Task not found.");
    }
    res.redirect(`/tasks/${req.params.listName}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting the task.");
  }
});

router.post("/:listName/status", ensureAuthenticated, async (req, res) => {
  const listName = req.params.listName;
  const taskId = req.body.taskId;
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    const taskIndex = user.tasks.findIndex(
      (task) => task._id.toString() === taskId
    );
    if (taskIndex === -1) {
      return res.status(404).send("Task not found.");
    }

    // Toggle the status
    user.tasks[taskIndex].status = !user.tasks[taskIndex].status;

    // Save the updated user
    await user.save();
    res.redirect(`/tasks/${listName}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while toggling the task status.");
  }
});

module.exports = router;
