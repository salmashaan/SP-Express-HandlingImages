const express = require("express");
const productRoutes = require("./apis/products/routes");
const shopsRoutes = require("./apis/shops/routes");
const userRoutes = require("./apis/user/users.routes");
const connectDB = require("./database");
const morgan = require("morgan");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middleware/passport");

const app = express();

connectDB();

// Passport
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(logger);
app.use((req, res, next) => {
  if (req.body.name === "Broccoli Soup")
    res.status(400).json({ message: "I HATE BROCCOLI!! KEEFY! " });
  else next();
});

// Routes

app.use("/apis", userRoutes);

app.use("/api/products", productRoutes);

app.use("/media", express.static(path.join(__dirname, "media")));

app.use("/api/shops", shopsRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Path not found" });
});

app.use(errorHandler);

const PORT = 8002;
app.listen(PORT, () => console.log(`Application running on localhost:${PORT}`));
