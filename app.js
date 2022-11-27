const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/info", require("./routes/profile.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/file", require("./routes/file.route"));

// Run Server
function start() {
  try {
    mongoose.connect(process.env.MONGO_URI);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server has been running on port - ${PORT}`)
    );
  } catch (err) {
    console.error("Server Error", err.message);
    process.exit(1);
  }
}

start();
