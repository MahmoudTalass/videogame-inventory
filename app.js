const express = require("express");
const app = express();

require("dotenv").config();

app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
