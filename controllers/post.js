const Post = require('../models/Post');
const User = require('../models/User');

// create
const createPost = async (req, res)=>{
    try{
        const {userId, description, picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post(
            {
                userId,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location,
                description,
                userPicturePath: user.picturePath,
                picturePath,
                likes:{},
                comments:[]
            }
        );
        await newPost.save();

        const posts = await Post.find();  // we are returning all the post, so that frontend can update the feed with latest posts
        res.status(201).json(posts);
    }catch(err){
        res.status(409).json({message: err.message});
    }
};

// Read
const getFeedPosts = async (req, res)=>{
    try{
        const posts = await Post.find(); 
        res.status(200).json(posts);
    }catch(err){
        res.status(404).json({message: err.message});
    }
}

const getUserPosts = async (req, res)=>{
    try{
        const {userId} = req.params;
        const posts = await Post.find({userId}); 
        res.status(200).json(posts);
    }catch(err){
        res.status(404).json({message: err.message});
    }
}


// Update
const likePost = async (req, res)=>{  // in this we Id of the post itself
    try{
        const {id} = req.params;
        const {userId} = req.body; // we will send this from frontend

        const post = await Post.findById(id);
        const isLiked = post.liked.get(userId);

        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        );

        res.status(200).json(updatedPost);
    }catch(err){
        res.status(404).json({message: err.message});
    }
};


module.exports = {likePost, getFeedPosts, getUserPosts, createPost};