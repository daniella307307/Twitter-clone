const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const router = require('./router/router');
const connectToMongoDB = require("./config/databaseConfig");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

try {
  connectToMongoDB();
} catch (error) {
  console.log(error);
}
app.use("/api/v1", router);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});