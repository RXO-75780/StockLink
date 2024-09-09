"use client";

import React from "react";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conforimPassword, setConforimPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  const handleSignIn = async (e) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setSuccessMessage("User signed in successfully!");
      router.push("/assistant");
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("Error signing In: " + error.message);
    }
  };

  const handleSignUp = async (e) => {
    try {
      if (password === conforimPassword) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        setSuccessMessage("User registered successfully!");
        setIsNewUser(false);
      }
    } catch (error) {
      console.error("Sign-up error:", error);
      setError("Error signing up: " + error.message);
    }
  };

  return (
    <Box
      display="flex"
      // flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100vh"
      sx={{
        background: "#0A0A0A",
        borderColor: "#00FFFF",
        boxShadow: "0 0 10px #00FFFF",
      }}
    >
      {/* Title at the top */}
      <Box
        width="450px"
        height="700px"
        display="flex"
        flexDirection="column"
        sx={{
          backgroundColor: "#0A0A0A",
          color: "#00FFFF",
          zIndex: 1201,
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: "#0A0A0A",
            color: "#00FFFF",
            height: "60px", // Adjust as needed
            // borderBottom: "1px solid #00FFFF",
            zIndex: 1201,
          }}
        >
          <Typography variant="h4">stockLink</Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          {!isNewUser ? "Sign In" : "Sign Up"}
        </Typography>
        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          fullWidth
          margin="normal"
          sx={{
            input: { color: "white" },
            label: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "#00FFFF",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00FFFF",
              },
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#00FFFF",
            },
            "& .MuiInputLabel-root:hover": {
              color: "#00FFFF",
            },
          }}
        />
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          fullWidth
          margin="normal"
          sx={{
            input: { color: "white" },
            label: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "#00FFFF",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00FFFF",
              },
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#00FFFF",
            },
            "& .MuiInputLabel-root:hover": {
              color: "#00FFFF",
            },
          }}
        />
        {isNewUser ? (
          <TextField
            type="password"
            value={conforimPassword}
            onChange={(e) => setConforimPassword(e.target.value)}
            placeholder="Confirm Password"
            fullWidth
            margin="normal"
            sx={{
              input: { color: "white" },
              label: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "#00FFFF",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00FFFF",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#00FFFF",
              },
              "& .MuiInputLabel-root:hover": {
                color: "#00FFFF",
              },
            }}
          />
        ) : (
          ""
        )}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success" variant="body2">
            {successMessage}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => (!isNewUser ? handleSignIn() : handleSignUp())}
          fullWidth
          sx={{
            marginTop: 4,
            background: "#00FFFF",
            color: "#000",
            "&:hover": {
              backgroundColor: "#00CED1",
              boxShadow: "0 0 15px #00FFFF",
            },
          }}
        >
          {!isNewUser ? "Sign In" : "Sign Up"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => setIsNewUser(!isNewUser)}
          fullWidth
          sx={{
            marginTop: 4,
            color: "#f8f9fa",
            borderColor: "#f8f9fa",
            "&:hover": {
              borderColor: "#00CED1",
              boxShadow: "0 0 15px #00FFFF",
            },
          }}
        >
          {isNewUser ? "Switch to Sign In" : "Switch to Sign Up"}
        </Button>
      </Box>
    </Box>
  );
};

export default SignInPage;
