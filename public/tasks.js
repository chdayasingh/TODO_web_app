const datePlaceholder = document.getElementById("today-date");

const today = new Date();

const options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};

const formatedDate = today.toLocaleDateString("en-US", options);

datePlaceholder.textContent = formatedDate;

// document.addEventListener("DOMContentLoaded", function () {
//   // Hide the edit panel initially
//   var editPanel = document.getElementById("editPanel");
//   editPanel.style.display = "none";

//   // Click event handler for items
//   var items = document.getElementsByClassName("item");
//   for (var i = 0; i < items.length; i++) {
//     items[i].addEventListener("click", function () {
//       // Get the item name
//       var itemName = this.querySelector("p").textContent;

//       // Set the item name in the edit panel
//       var editedItemNameInput = editPanel.querySelector(
//         "input[name='editedItemName']"
//       );
//       editedItemNameInput.value = itemName;

//       // Toggle the visibility of the edit panel
//       if (editPanel.style.display === "none") {
//         editPanel.style.display = "block";
//       } else {
//         editPanel.style.display = "none";
//       }
//     });
//   }
// });
