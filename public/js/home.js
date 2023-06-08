const datePlaceholder = document.getElementById("today-date");

const today = new Date();

const options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};

const formatedDate = today.toLocaleDateString("en-US", options);

datePlaceholder.textContent = formatedDate;

// const weekdays = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// // Use the weekdayNumber to access the corresponding weekday name from the array
// const weekday = weekdays[today.getDay()];
// document.getElementById("heading").textContent = weekday + " Todo: ";
