const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const helmet = require("helmet")
const morgan = require("morgan");
const verifyToken = require("./middleware/auth");
const path = require("path");
const { register } = require("./controllers/auth");
const { createPost } = require("./controllers/posts");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");

dotenv.config();
const app = express();

//middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));



/* FILE STORAGE */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer(storage);


/* Routes */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);


app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);


/* Mongoose setup */
const port = process.env.PORT;

console.log(`try 1`);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useunifiedtopology: true
}).then(() => {
    app.listen(port, () => console.log(`Listening on port ${port}`))


}).catch((error) => console.log(`${error} did not connect`))




