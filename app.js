// const express = require("express");
// const cors = require("cors");

// const mongoose = require("mongoose");
// const mainRouter = require("./routes/index");

// const app = express();

// const { PORT = 3001 } = process.env;

// mongoose
//   .connect("mongodb://127.0.0.1:27017/wtwr_db")
//   .then(() => {
//     console.log("Connected to DB");
//   })
//   .catch(console.error);

// app.use(cors());

// app.use(express.json());

// app.use("/", mainRouter);

// app.listen(PORT, () => {
//   console.log(`Server is running on ${PORT}`);
// });

const express = require("express");

require("dotenv").config();

const { errors } = require("celebrate");

const cors = require("cors");

const mongoose = require("mongoose");

const mainRouter = require("./routes/index");

const dataBase = "mongodb://127.0.0.1:27017/wtwr_db";

const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;
mongoose.connect(dataBase, () => {});

app.use(cors());
app.use(express.json());

app.use(requestLogger);

// test crash

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// test crash

app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
