const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database Connection with mongodb
mongoose.connect(
  "mongodb+srv://acountryman00:PGl6aEiBvyTpDgux@cluster0.wtpo2.mongodb.net/e-commerce"
);

// API Creation

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

//Image storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()} ${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// creating Upload
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`,
  });
});

const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number },
  date: { type: Date, default: Date.now },
});

app.post("/addproduct", async (req, res) => {
  const product = new Product({
    id: req.body.id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    price: req.body.price,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port" + port);
  } else {
    console.log("Error" + error);
  }
});
