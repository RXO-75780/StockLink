"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  ListItemButton,
  ListItemText,
  List,
  Drawer,
} from "@mui/material";
import useStockStore from "../useUserstore";
import StockChartWidget from "../components/StockChartWidget";
import { useState, useEffect } from "react";
import {
  OpenIcon,
  CloseIcon,
  GraphIcon,
  DeleteIcon,
  FolderIcon,
  AssistantIcon,
} from "../components/icons";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase"; // Adjust import based on your setup
import {
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

export default function Conversations() {
  const {
    stockData,
    fileName,
    setStockData,
    setFilename,
    drawerOpen,
    setDrawerOpen,
  } = useStockStore((state) => ({
    stockData: state.stockData,
    fileName: state.fileName,
    setStockData: state.setStockData,
    setFilename: state.setFilename,
    toggleDrawer: state.toggleDrawer,
    setDrawerOpen: state.setDrawerOpen,
    drawerOpen: state.drawerOpen,
  }));
  const { toggleDrawer } = useStockStore((state) => ({
    toggleDrawer: state.toggleDrawer,
  }));
  const setSymbol = useStockStore((state) => state.setSymbol);
  const symbol = useStockStore((state) => state.symbol);
  const [chartOpen, setChartOpen] = useState(false);
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to store selected file conversations
  const [filenames, setFilenames] = useState([]);
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const toggleChart = () => {
    setChartOpen((prev) => !prev); // Toggle chart open state

    // Close the drawer if the chart is being opened
    if (!chartOpen && drawerOpen) {
      setDrawerOpen(false);
    }
  };

  useEffect(() => {
    const fetchFilenames = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const conversationsCollection = collection(userDocRef, "conversations");
        const conversationSnapshot = await getDocs(conversationsCollection);
        const filenames = conversationSnapshot.docs.map((doc) => doc.id);
        setFilenames(filenames);
      } else {
        alert("No user is logged in.");
      }
    };

    fetchFilenames();
  }, []);

  const handleFileClick = async (filename) => {
    setChartOpen(false);
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const conversationRef = doc(userDocRef, "conversations", filename);
      const conversationSnapshot = await getDoc(conversationRef);
      if (conversationSnapshot.exists()) {
        setSelectedFile(conversationSnapshot.data().messages);
      } else {
        alert("No conversation found.");
      }
    } else {
      alert("No user is logged in.");
    }
  };

  const handleDeleteConversation = async (filename) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const conversationRef = doc(userDocRef, "conversations", filename);
      try {
        await deleteDoc(conversationRef);
        alert("Conversation deleted successfully.");
        setFilenames(filenames.filter((name) => name !== filename)); // Update the filenames state after deletion
        setSelectedFile(null); // Reset selected conversation
      } catch (error) {
        console.error("Error deleting conversation: ", error);
      }
    } else {
      alert("No user is logged in.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.setTickerSymbol = (symbol) => {
        setSymbol(symbol);
        setChartOpen(true);
        setDrawerOpen(false);
      };
    }
  }, [setSymbol, setChartOpen]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100vh"
      sx={{
        background: "#0A0A0A",
        borderColor: "#00FFFF",
        boxShadow: "0 0 10px #00FFFF",
        position: "relative",
      }}
    >
      {/* Title at the top */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#0A0A0A",
          color: "#00FFFF",
          height: "60px", // Adjust as needed
          borderBottom: "1px solid #00FFFF",
          zIndex: 1201,
        }}
      >
        <Typography variant="h4">stockLink</Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        height="calc(100% - 60px)" // Adjust height to account for the title bar
        width="100%"
        justifyContent="center"
        alignItems="center"
        sx={{ position: "relative" }}
      >
        {/* Drawer for the sidebar */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: 24,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              backgroundColor: "#0A0A0A",
              color: "#00FFFF",
              boxShadow: "0 0 15px #00FFFF",
              marginTop: "60px",
            },
          }}
        >
          <Box
            sx={{
              marginTop: 2,
              marginBottom: 2,
            }}
          >
            <List>
              <ListItemButton onClick={() => handleNavigation("/assistant")}>
                <ListItemText primary="AI Assistant" />
                <AssistantIcon />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleNavigation("/conversations")}
              >
                <ListItemText primary="Conversations" />
                <FolderIcon />
              </ListItemButton>
            </List>
          </Box>

          {/* Display file names below the navigation */}
          <List
            sx={{
              borderTop: "2px solid #00FFFF",
            }}
          >
            {filenames.map((name, index) => (
              <ListItemButton
                key={index}
                onClick={() => handleFileClick(name)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between", // Ensures space between name and button
                  alignItems: "center", // Aligns text and button vertically
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1, // Allows the name to take up remaining space
                    marginRight: "16px", // Adds space between the filename and the button
                  }}
                >
                  {name}
                </Box>
                <Button
                  variant="contained"
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent event from triggering ListItemButton
                    handleDeleteConversation(name);
                  }}
                  aria-label={"Delete Conversation"}
                  sx={{
                    background: "#00FFFF",
                    color: "#000",
                    zIndex: 1201,
                    padding: "3px 6px", // Shortens padding
                    minWidth: "auto", // Ensures button only takes necessary space
                    "&:hover": {
                      backgroundColor: "#00CED1",
                      boxShadow: "0 0 15px #00FFFF",
                    },
                  }}
                >
                  <DeleteIcon />
                </Button>
              </ListItemButton>
            ))}
          </List>

          <Button
            onClick={toggleDrawer}
            aria-label="Close drawer"
            sx={{
              position: "absolute",
              top: "43%",
              right: 20,
              backgroundColor: "#00FFFF",
              color: "#000",
              zIndex: 1201,
              borderRadius: "50%",
              minWidth: "auto",
              padding: 1,
              "&:hover": {
                backgroundColor: "#00CED1",
                boxShadow: "0 0 15px #00FFFF",
              },
            }}
          >
            <CloseIcon />
          </Button>

          {/* Close button for the drawer */}
        </Drawer>

        {/* Main content area */}
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="row"
          height="100%"
          alignItems="center"
          justifyContent="center"
          sx={{
            marginLeft: drawerOpen ? 24 : 0,
            transition: "margin-left 0.3s",
          }}
        >
          {chartOpen && (
            <Box
              width="50%"
              height="700px"
              sx={{
                overflow: "hidden",
                border: "1px solid #444",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                borderColor: "#00ffff",
                boxShadow: "0 0 10px #00FFFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StockChartWidget sy={symbol} key={symbol} />
            </Box>
          )}
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
              {selectedFile ? (
                selectedFile.map((msg, index) => (
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
                ))
              ) : (
                <Typography>Select a file to view the conversation</Typography>
              )}
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Toggle button for drawer */}
      {!drawerOpen && (
        <Button
          onClick={toggleDrawer}
          aria-label="Open drawer"
          sx={{
            position: "absolute",
            top: "50%",
            left: 20,
            backgroundColor: "#00FFFF",
            color: "#000",
            zIndex: 1201,
            borderRadius: "50%",
            minWidth: "auto",
            padding: 1,
            "&:hover": {
              backgroundColor: "#00CED1",
              boxShadow: "0 0 15px #00FFFF",
            },
          }}
        >
          <OpenIcon />
        </Button>
      )}
      <Button
        variant="contained"
        onClick={toggleChart}
        aria-label={chartOpen ? "Close chart" : "Open chart"}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "#00FFFF",
          color: "#000",
          zIndex: 1201,
          "&:hover": {
            backgroundColor: "#00CED1",
            boxShadow: "0 0 15px #00FFFF",
          },
        }}
      >
        <GraphIcon />
      </Button>
    </Box>
  );
}
