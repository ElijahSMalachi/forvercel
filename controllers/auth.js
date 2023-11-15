import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  res.status(200).json('Heylo from register');
// function capitalizeFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       picturePath,
//       friends,
//       location,
//       occupation,
//     } = req.body;

//     const isUser = await User.findOne({ email: email.toLowerCase() })
//     if(isUser){
//         const isMatch = await bcrypt.compare(password, isUser.password);
//         if(isMatch){
//           const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET);
//           const userWithoutPassword = { ...isUser.toObject() };
//           delete userWithoutPassword.password;
//           res.status(200).json({ token, savedUser:userWithoutPassword });

//         }else{
//           res.status(409).json({ emailInUse: 'email is already in use' });
        
//         }
//     }else{
//       const salt = await bcrypt.genSalt();
//       const passwordHash = await bcrypt.hash(password, salt);
//       const newUser = new User({
//         firstName: capitalizeFirstLetter(firstName),
//         lastName: capitalizeFirstLetter(lastName),
//         email: email.toLowerCase(),
//         password: passwordHash,
//         picturePath,
//         friends,
//         location,
//         occupation,
//         viewedProfile: Math.floor(Math.random() * 10000),
//         impressions: Math.floor(Math.random() * 10000),
//       });
//       const savedUser = await newUser.save();
//       const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
//       const userWithoutPassword = { ...savedUser.toObject() };
//       delete userWithoutPassword.password;
//       res.status(201).json({ token, savedUser: userWithoutPassword});
//     }

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ NoUser: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ IncPass: "Wrong Password. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;
    res.status(200).json({ token, user:userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
