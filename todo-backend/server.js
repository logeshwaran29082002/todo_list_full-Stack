// Using Express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// create an instance of an Express
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes
//Sample in -memory storage for todo items
// let todos =[];

// connect to MongoDB;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));


// creating a schema for todo items
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});

//creating a model for todo items

const todomodel = mongoose.model("Todo", todoSchema);

// Create a new todo item
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  // const newTodo ={
  //     id:todos.length + 1, // Simple ID generation
  //     title,
  //     description,
  // };
  // todos.push(newTodo);
  // console.log(todos);
  try {
    const newTodo = new todomodel({
      title,
      description,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all items;
app.get("/todos", async (req, res) => {
  try {
    const todos = await todomodel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// Update a todo item
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updateTodo = await todomodel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updateTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updateTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a todo item
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todomodel.findByIdAndDelete(id);
    res.status(204).end(); // No content response after deletion
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//Start the server
const port = 3000;
app.listen(port, () => {
  console.log("Server is listening on port" + port);
});
