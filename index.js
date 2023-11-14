import bodyParser from "body-parser";
import express from 'express';
import mongoose from "mongoose";
import User from "./modals/User.js";

const app = express()
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.post('/post', async(req,res)=>{
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
    
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: 'ElijahSMalachi@gmail.com',
            password,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
          });
          const savedUser = await newUser.save();
          res.status(201).json({ savedUser});
        }
    
);

app.get('/post', (req,res)=>{
    res.status(200).json('Hey this is get');
})

const PORT = 3006;
mongoose
  .connect('mongodb+srv://elijahsmalachi:513119Emas@data.yr0udnb.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
