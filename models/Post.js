const mongoose = require('mongoose');

/**
 * Schema for a blog post.
 */


const postSchema = new mongoose.Schema({
  // Author of the post.
  author: {
    type: String,
    required: true
  },
  // Date the post was created.
  date: {
    type: Date,
    default: Date.now
  },
  // Title of the post.
  title: {
    type: String,
    required: true
  },
  // URL of the image for the post.
  image: {
    type: String,
    required: true
  },
  // Body content of the post.
  body: { 
    type: mongoose.Schema.Types.Mixed, // Allows storing JSON
    required: true },
  // Categories that the post belongs to.
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  // Comments on the post.
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  // Users who liked the post.
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  // Tags associated with the post.
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ]
});


module.exports = mongoose.model('Post', postSchema);

