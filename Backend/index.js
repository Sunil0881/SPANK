const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./Models/User");

require('dotenv').config();

const app = express();

app.use(cors());
 

app.use(express.json({ limit: '10mb' })); // Increase limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));


const dbURI = process.env.MONGODB;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

  app.post('/api/user', async (req, res) => {
    console.log(req.body); // Log the incoming request body
    const { address, referralCode } = req.body; // Extract address and referral code

    try {
        // Check if the user already exists
        let user = await User.findOne({ address });

        if (user) {
            // User exists, return their score and level
            return res.status(200).json({
                message: "User found.",
                score: user.score,
                level: user.level,
                referralCode: user.referralCode,
            });
        }

        // User does not exist, create a new user
        user = new User({ address });

        // If a referral code is provided, find the referrer
        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                user.referredBy = referrer.address; // Set the referrer address
                referrer.referralCount += 1; // Increment the referrer’s count
                referrer.referrals.push(address); // Add the new user to the referrer’s referral list
                await referrer.save(); // Save the updated referrer data
            }
        }

        await user.save();
        console.log("User created");

        // Return user details including the generated referral code
        return res.status(201).json({
            message: "User created.",
            score: user.score,
            level: user.level,
            referralCode: user.referralCode,
        });

    } catch (error) {
        console.error("Error in POST /api/user:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
});



app.put('/api/user/update', async (req, res) => {
  const { address, score, level } = req.body;

  try {
      // Find the user by their address
      let user = await User.findOne({ address });

      if (!user) {
          // If the user does not exist, return a 404 error
          return res.status(404).json({ message: "User not found." });
      }

      // Update the score and level fields
      user.score = score || user.score; // Update score if provided, otherwise keep the existing value
      user.level = level || user.level; // Update level if provided, otherwise keep the existing value
      await user.save();

      // Return the updated user details
      return res.status(200).json({
          message: "User score and level updated.",
          score: user.score,
          level: user.level,
      });
  } catch (error) {
      console.error("Error in PUT /api/user/update:", error);
      return res.status(500).json({ message: "Server error.", error: error.message });
  }
});




  const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});