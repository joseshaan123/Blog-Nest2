const express = require("express");
const Blog = require("../models/Blog");
const User = require("../models/User");
const router = express.Router();

// 1. SEARCH (Must be FIRST)
router.get("/search/all", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json({ users: [], blogs: [] });

        const users = await User.find({ username: { $regex: query, $options: "i" } }).select("username _id").limit(5);
        const blogs = await Blog.find({ title: { $regex: query, $options: "i" } }).limit(5);
        res.json({ users, blogs });
    } catch (err) {
        res.status(500).json({ message: "Search failed" });
    }
});

// 2. GET USER BLOGS (For Profile)
router.get("/user/:userId", async (req, res) => {
    try {
        const blogs = await Blog.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: "Fetch failed" });
    }
});

// 3. CREATE
router.post("/create", async (req, res) => {
    try { 
        const newBlog = new Blog(req.body);
        await newBlog.save();
        res.status(201).json({ message: "Saved" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. GET SINGLE BLOG (Must be BELOW Search)
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Not found" });
        res.json(blog);
    } catch (err) { res.status(500).json({ error: "Invalid ID" }); }
});

// 5. UPDATE
router.put("/:id", async (req, res) => {
    try {
        await Blog.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Updated" });
    } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

// 6. DELETE
router.delete("/:id", async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

module.exports = router;