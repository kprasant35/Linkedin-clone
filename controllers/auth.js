const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User');

const register = async (req, res)=>{
    console.log('inside');
    console.log(req.body);
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation
        });
        console.log(passwordHash);
        const savedUser = await newUser.save();
        delete savedUser.password;
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json({error : err.message});
    }
}

const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user)return res.status(400).json({msg: "User not found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)return res.status(400).json({msg: "invalid credentials"});
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        
        delete user.password;

        res.status(200).json({token, user});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}
module.exports= {register, login};