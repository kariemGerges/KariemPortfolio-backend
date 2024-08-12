const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


require('../../../models/Category');
const Category = mongoose.model('Category');


// get all categories
router.get('/categories', async(res,req) =>{
    const filter = {};
    const categories = await Category.find(filter);
    res.send(categories);
});


// create new category
router.post('/createCategory', async(req,res) => {

    const newCategory = new Category({
        name: req.body.name,
        description: req.body.description
    });
    
    try {
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = router;