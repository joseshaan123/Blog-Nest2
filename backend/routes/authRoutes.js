const express = require("express");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const router = express.Router();
const isAuth = require('../middleware/auth')

/* --- 1. SIGNUP ROUTE (With Hashing) --- */
router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, dob, username, password } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the user with the HASHED password
        const user = new User({
            fullName,
            email,
            dob,
            username,
            password: hashedPassword // This saves the scrambled version to Mongo
        });

        await user.save();
        console.log("New user created with hashed password:", hashedPassword);

        res.status(201).json({ message: "Signup successful" });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Signup failed" });
    }
});

router.post("/login",isAuth,async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email }).select("password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2. IMPORTANT: Use bcrypt.compare
    // This takes the plain password from the login form and compares it
    // with the hashed password stored in MongoDB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // If it doesn't match, you get "Invalid password"
      return res.status(400).json({ message: "Invalid password" });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    // 3. Success!
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
module.exports = router;

// Find a user by username to get their ID
router.get("/search/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Only send back the ID and Username, not the password/email for privacy
        res.json({ userId: user._id, username: user.username });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/find/:username", async (req, res) => {
    try {
        // Find user by name (exact match)
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.json({ targetId: user._id });
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
module.exports = router;

// Update User Profile
router.put("/update/:id", async (req, res) => {
    try {
        const { username, email, bio } = req.body;
        
        // Update the user in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, bio },
            { new: true } // This returns the updated document
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Profile updated successfully!", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Server error during update" });
    }
});

router.put("/update/:id", async (req, res) => {
    try {
        const { fullName, email, dob, username, password } = req.body;
        
        const updateFields = { fullName, email, dob, username };
        if (password) updateFields.password = password;

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            updateFields, 
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Updated", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during update" });
    }
});