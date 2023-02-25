const mongoose = require('mongoose');

const UserScheme = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        lastName:{
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        email:{
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        password:{
            type: String,
            required: true,
            min: 8
        },
        picturePath:{
            type: String,
            default: ""
        },
        friends:{
            type: Array,
            default: []
        },
        location:{
            type: String
        },
        occupation:{
            type: String
        },
    }, 
    {timestamps: true}
);

const User = mongoose.model("User", UserScheme);

module.exports= {User};