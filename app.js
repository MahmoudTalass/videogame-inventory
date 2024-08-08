const express = require("express");
const app = express();

require("dotenv").config();

app.set("view engine", "ejs");

const indexRouter = require("./routes/index.route");
const developersRouter = require("./routes/developers.route");
const gamesRouter = require("./routes/games.route");
const genresRouter = require("./routes/genres.route");
const platformsRouter = require("./routes/platform.routes");

app.use("/", indexRouter);
app.use("/developers", developersRouter);
app.use("/games", gamesRouter);
app.use("/genres", genresRouter);
app.use("/platforms", platformsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
