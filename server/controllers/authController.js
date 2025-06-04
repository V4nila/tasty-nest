const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const getUser = async (req,res) => {

    try{
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
res.json(user);

    }catch(error){
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Error fetching profile data" });
    }

}

const loginUser = async (req,res)  => {

const {email , password} = req.body;

const user = await User.findOne({email});
if(user && (await bcrypt.compare(password,user.password))) {

const token = jwt.sign(
 {_id : user._id, username : user.username},
 process.env.JWT_SECRET,
 {expiresIn : '1d'}

)
res.status(201).json({ token })

}else{
    res.status(401).json({ message: 'Invalid email or password' })
}

}
const registerUser = async (req,res) => {
const {username, email , password} = req.body;
try{
const userExists = await User.findOne({email});
if(userExists){
    return res.status(400).json({message:"User already exists"});
}
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password,salt);

const newUser = new User({

username,
email,
password:hashedPassword

})
await newUser.save();


const token = jwt.sign(
    {_id:newUser._id , username : newUser.username},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}

)
res.status(201).json({ token });


}catch(err){
    console.error(err)
    res.status(500).json({message:"something went wrong"});
}



}





module.exports = {loginUser ,registerUser , getUser}