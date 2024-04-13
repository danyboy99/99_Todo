const express = require("express");
const mongoose = require("mongoose");
const items = require("./model/items");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//connection string to data base with mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/Todolist")
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(err.message));
app.get("/get-items", (req, res) => {
  items
    .find()
    .then((data) => {
      res.render("index", { items: data });
    })
    .catch((err) => {
      //res.send(err.message);
      console.log(err.message);
      res.render("index", { items: [] });
    });
});
app.get("/", (req, res) => {
  res.redirect("/get-items");
});

app.get("/add-items", (req, res) => {
  res.render("add-items");
});

app.post("/items", (req, res) => {
  items
    .create(req.body)
    .then(() => {
      res.redirect("/get-items");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.get("/items/:id", (req, res) => {
  items
    .findById(req.params.id)
    .then((data) => {
      res.render("item-details", { item: data });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.delete("/items/:id", (req, res) => {
  const id = req.params.id;
  items
    .findByIdAndDelete(id)
    .then(() => {
      res.json({ redirect: "/get-items" });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.put("/items/:id", (req, res) => {
  const id = req.params.id;
  items
    .findByIdAndUpdate(id, req.body)
    .then(() => {
      res.json({ msg: "updated sucessfuly" });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.use((req, res) => {
  res.render("error");
});

app.listen(6500, () => {
  console.log("app is running on port 6500");
});
