import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import User from "./modals/User.js";

// import { register } from "./controllers/auth.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
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
  },
});
const upload = multer({ storage });


app.post('/auth', async (req, res) => {
 
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const isUser = await User.findOne({ email: email.toLowerCase() })
    if(isUser){
        const isMatch = await bcrypt.compare(password, isUser.password);
        if(isMatch){
          const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET);
          const userWithoutPassword = { ...isUser.toObject() };
          delete userWithoutPassword.password;
          res.status(200).json({ token, savedUser:userWithoutPassword });

        }else{
          res.status(409).json({ emailInUse: 'email is already in use' });
        
        }
    }else{
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
      const userWithoutPassword = { ...savedUser.toObject() };
      delete userWithoutPassword.password;
      res.status(201).json({ token, savedUser: userWithoutPassword});
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
);

app.get('/auth/:userId', (req,res)=>{
    const {userId} = req.params;
    res.status(200).json(`Hey this is get ${userId}` );
})

const PORT = 3006;
mongoose
  .connect('mongodb+srv://elijahsmalachi:513119Emas@data.yr0udnb.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
