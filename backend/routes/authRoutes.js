const express = require("express");
const User = require("../models/User");
const router = express.Router();

/* SIGNUP */
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, dob, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      fullName,
      email,
      dob,
      username,
      password // plain password (FOR NOW)
    });

    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});


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
        const user = await User.findById(req.params.id).select("username email");
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