const express = require("express");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const isAuth = require('../middleware/auth');

/* --- MULTER CONFIGURATION --- */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // This ensures it finds the uploads folder regardless of where you start the server
        cb(null, path.join(__dirname, '../uploads/')); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

/* --- 1. SIGNUP ROUTE --- */
router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, dob, username, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullName,
            email,
            dob,
            username,
            password: hashedPassword 
        });

        await user.save();
        res.status(201).json({ message: "Signup successful" });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Signup failed" });
    }
});

/* --- 2. LOGIN ROUTE --- */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        req.session.userId = user._id;
        req.session.username = user.username;
        
        res.cookie("username", user.username, {
            maxAge: 1000 * 60 * 15, 
            httpOnly: true, 
        });

        res.status(200).json({ 
            message: "Login successful", 
            userId: user._id, 
            username: user.username 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* --- 3. SEARCH / FIND ROUTES --- */
router.get("/search/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ userId: user._id, username: user.username });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

/* --- 4. THE UNIFIED UPDATE ROUTE --- */
router.put("/update/:id", upload.single('profilePic'), async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, bio, fullName, dob, password } = req.body;
        
        let updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (bio) updateFields.bio = bio;
        if (fullName) updateFields.fullName = fullName;
        if (dob) updateFields.dob = dob;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        if (req.file) {
            updateFields.profilePic = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $set: updateFields }, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (err) { 
        console.error("Update Error:", err); 
        res.status(500).json({ message: "Server error during update" });
    }
});

// IMPORTANT: ONLY ONE EXPORT AT THE VERY BOTTOM
module.exports = router;