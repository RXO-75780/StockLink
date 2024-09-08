"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import useStockStore from "../useUserstore";
import { GraphIcon, SaveIcon } from "./icons";
import { db, auth } from "../firebase"; // Import Firestore and Auth
import {
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "I am an AI-powered Stock Research Assistant, how can I help you?",
    },
  ]);
  const [chartOpen, setChartOpen] = useState(false);
  const setSymbol = useStockStore((state) => state.setSymbol);
  const [message, setMessage] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  const [processedTickers, setProcessedTickers] = useState(new Set());
  const [open, setOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const {
    setStockData,
    setFilename: updateFileName,
    fileName,
  } = useStockStore((state) => ({
    setStockData: state.setStockData,
    setFilename: state.setFilename,
    fileName: state.fileName,
  }));
  // console.log(messages);
  // console.log(message);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.setTickerSymbol = (symbol) => {
        setSymbol(symbol);
      };
    }
  }, [setSymbol]);

  const generateTickerJson = (symbol) => {
    // Check if ticker has already been processed
    if (processedTickers.has(symbol)) {
      return false; // or some indication that it's already processed
    }

    // Add ticker to the set of processed tickers
    setProcessedTickers((prevSet) => new Set(prevSet).add(symbol));
    return true;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFilenameChange = (event) => {
    const newFileName = event.target.value;
    setFilename(newFileName);
  };

  const handleSave = async () => {
    if (filename) {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const conversationRef = doc(userDocRef, "conversations", filename);
        await setDoc(conversationRef, {
          messages,
          timestamp: new Date(),
        });
        setStockData(filename, messages);
        updateFileName(filename);
        alert(`Conversation saved as ${filename}`);
        handleClose();
      } else {
        alert("No user is logged in.");
      }
    }
  };

  // const handleSave = () => {
  //   if (filename) {
  //     setStockData(filename, messages);
  //     updateFileName(filename);
  //     alert(`Conversation saved as ${filename}`);
  //   }
  // };

  const sendMessage = async () => {
    // Clear the input field and update the messages state to include the new user message
    setMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      // Fetch the response from the chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = ""; // Variable to store the entire response

      // Function to handle reading the stream
      const processText = ({ done, value }) => {
        if (done) {
          // When the stream is complete, log the full accumulated result
          extractTickerJSON(result);
          return;
        }

        // Decode the current chunk of text
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        result += text; // Accumulate the streamed text

        const cleanedResult = result.replace(
          /```json\s*("ticker":\s*\[\s*{[^}]*}\s*\])\s*```/s,
          (match, jsonText) => {
            const jsonString = `{${jsonText.trim()}}`;
            let tickerSymbol = "";

            try {
              const jsonObject = JSON.parse(jsonString);
              tickerSymbol = jsonObject.ticker[0].symbol;
              const isNewTicker = generateTickerJson(tickerSymbol);

              const tickerLink = isNewTicker
                ? `<br/><br/>Ticker symbol: <a href="#" onclick="window.setTickerSymbol('${tickerSymbol}'); setChartOpen(true); return false;">${tickerSymbol}</a>`
                : "";

              return `${result.trim()}${tickerLink}`;
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        );

        const cleanedResult2 = cleanedResult.replace(
          /```json\s*("ticker":\s*\[\s*{[^}]*}\s*\])\s*```/s,
          ""
        );

        // Update the last message in the state with the accumulated result so far
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: cleanedResult2, // Update the message with the accumulated result
            },
          ];
        });

        // Continue reading the stream
        return reader.read().then(processText);
      };

      // Start reading the stream and handle potential errors
      reader
        .read()
        .then(processText)
        .catch((error) => {
          console.error("Error reading from the stream:", error);
        });
    } catch (error) {
      console.error("Error while sending the message:", error);
    }
  };

  const extractTickerJSON = (text) => {
    // Use a regular expression to extract the ticker JSON part, capturing everything inside the backticks
    const jsonStringMatch = text.match(
      /```json\s*("ticker":\s*\[\s*{[^}]*}\s*\])\s*```/s
    );

    // Check if jsonStringMatch is not null and has a valid match
    if (jsonStringMatch && jsonStringMatch[1]) {
      // Extracted JSON string
      const jsonString = `{ ${jsonStringMatch[1]} }`; // Properly wrap in {}

      // Parse the JSON object
      try {
        const jsonObject = JSON.parse(jsonString);

        // Use the JSON object
        const newSymbol = jsonObject.ticker[0].symbol; // Output: TSLA
        setStockSymbol(`NASDAQ:${newSymbol}`);
        if (newSymbol) {
          setSymbol(newSymbol);
        }
        // Perform additional actions with the extracted JSON object here
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("No ticker JSON object found in the response.");
    }
  };

  return (
    <Stack
      direction="column"
      width="80%"
      height="700px"
      p={2}
      spacing={3}
      sx={{
        backgroundColor: "#0A0A0A",
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="column"
        flexGrow={1}
        overflow="auto"
        spacing={2}
        p={2}
        maxHeight="100%"
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={
              msg.role === "assistant" ? "flex-start" : "flex-end"
            }
          >
            <Box
              p={2}
              borderRadius="10px"
              width="fit-content"
              maxWidth="80%"
              display="flex"
              alignItems="center"
              sx={{
                color: msg.role === "assistant" ? "#212529" : "#f8f9fa",
                fontFamily: "Roboto, sans-serif",
                fontWeight: "bold",
                backgroundColor:
                  msg.role === "assistant" ? "#f8f9fa" : "#212529",
              }}
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
          </Box>
        ))}
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
        <Button
          variant="contained"
          onClick={sendMessage}
          sx={{
            backgroundColor: "#00FFFF",
            color: "#000000",
            boxShadow: "0 0 10px #00FFFF",
            "&:hover": {
              backgroundColor: "#00CED1",
              boxShadow: "0 0 15px #00FFFF",
            },
          }}
        >
          Send
        </Button>
      </Stack>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{
          position: "absolute",
          top: 0,
          right: 20,
          background: "#00FFFF",
          color: "#000",
          zIndex: 1206,
          "&:hover": {
            backgroundColor: "#00CED1",
            boxShadow: "0 0 15px #00FFFF",
          },
        }}
      >
        Save
        <SaveIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save As</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="filename"
            label="File Name"
            type="text"
            fullWidth
            variant="standard"
            // value={filename}
            onChange={handleFilenameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
