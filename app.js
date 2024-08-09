const express = require("express");
const app = express();

require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const indexRouter = require("./routes/index.route");
const developersRouter = require("./routes/developers.route");
const gamesRouter = require("./routes/games.route");
const genresRouter = require("./routes/genres.route");
const platformsRouter = require("./routes/platform.routes");

app.use("/home", indexRouter);
app.use("/developers", developersRouter);
app.use("/games", gamesRouter);
app.use("/genres", genresRouter);
app.use("/platforms", platformsRouter);

app.get("/", (req, res) => res.redirect("/home"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
