require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const connectDB = require("./database");

const User = require("./models/user");
const Note = require("./models/Note");

const app = express();
app.use(cors({
    origin: "https://college-notes-platform-eight.vercel.app",
    credentials: true
}))

connectDB();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));


// ================= REGISTER =================

app.post("/register", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        message: "All fields required",
      });

    }

    const userExists = await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "Registration Successful",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});


// ================= LOGIN =================

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "User not found",
      });

    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {

      return res.status(400).json({
        message: "Invalid Password",
      });

    }

    const token = jwt.sign(
      { id: user._id },
      "secretkey"
    );

    res.json({
      token,
      message: "Login Successful",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});


// ================= FORGOT PASSWORD =================

app.put("/forgot-password", async (req, res) => {

  try {

    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        message: "User Not Found",
      });

    }

    user.password = newPassword;

    await user.save();

    res.json({
      message: "Password Updated Successfully ✅",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});

// ================= MULTER =================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads");

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );

  },

});

const upload = multer({
  storage: storage,
});


// ================= UPLOAD NOTE =================

app.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {

    try {

      const {
        subject,
        branch,
        semester,
        username,
      } = req.body;

      const note = new Note({

        subject,
        branch,
        semester,
        username,

        file: req.file.filename,

      });

      await note.save();

      res.json({
        message:
          "File Uploaded Successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Upload Failed",
      });

    }

  }
);


// ================= GET NOTES =================

app.get("/notes", async (req, res) => {

  try {

    const notes = await Note.find();

    res.json(notes);

  } catch (error) {

    console.log(error);

  }

});


// ================= DELETE =================

app.delete("/delete/:id", async (req, res) => {

  try {

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted",
    });

  } catch (error) {

    console.log(error);

  }

});


app.listen(5000, () => {

  console.log("Server Running On Port 5000");

});