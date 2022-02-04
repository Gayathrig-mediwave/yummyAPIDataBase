const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
app.use(express.json());
app.use(cors());
//const recipeRoute = require("./route");
const recipeRoutes = require("./route");

app.use("/", recipeRoutes);
app.use("/recipes", recipeRoutes);
app.use((req, res, next) => {
  return res.status(404).send({
    message: "resource not found",
  });
});
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`running on port ${PORT}`);
});
