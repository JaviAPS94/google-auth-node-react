import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Controller for handling Google authentication
const handleGoogleAuth = async (req, res) => {
  const { token } = req.body;
  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Check if user exists in the database, or create a new user
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
      });
      await user.save();
    }

    // Generate JWT token for the authenticated user
    const accessToken = jwt.sign(
      { userId: user.googleId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the access token
    res.json({ accessToken });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(400).send("Authentication failed");
  }
};

export { handleGoogleAuth };
