const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../../models/Post');
const Post = mongoose.model('Post');


// get all posts
router.get('/posts', async (req, res) => {
    const filter = {}
    const posts = await Post.find(filter);
    res.send(posts);
});


// create new post
router.post('/createPost', async(req,res) => {

    const newPost = new Post({
        author: req.body.author,
        title: req.body.title,
        image: req.body.image,
        body: req.body.body,
        categories: req.body.categories
    });
    
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
        // console.log(savedPost);
        // console.log(savedPost._id);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
    
    });



module.exports = router;