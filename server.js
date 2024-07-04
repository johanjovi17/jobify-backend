const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const connectDb = require("./config/dbConnection");

connectDb();

// app.use(cors());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://jobify-frontend-inky.vercel.app",
    ],
    // Update with your Vercel domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/jobs", require("./routes/jobRoutes.js"));
app.use("/api/users", require("./routes/userRoutes.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app is running on port number ${PORT}`);
});
