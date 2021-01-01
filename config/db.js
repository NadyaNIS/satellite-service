const mongoose = require("mongoose");

const dbURI = "mongodb+srv://starlinkspacexuser:0vJ9hnxejF0vaiWm@cluster0.gxtne.mongodb.net/starlinkspacexdb?retryWrites=true&w=majority";
const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

// require any models

require("../models/Satellite");