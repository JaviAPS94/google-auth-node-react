import React from "react";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const handleLoginSuccess = async (response) => {
    // Send the Google ID Token to the backend for verification
    try {
      const res = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: response.credential, // Use `credential` instead of `tokenId`
        }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("jwtToken", data.token); // Store the JWT token in localStorage
        console.log("User authenticated successfully");
      } else {
        console.error("Authentication failed");
      }
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </div>
  );
}

export default App;
