const express = require("express");
const cors = require("cors");
const router = require("./router/router");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

app.use("/api", router);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});