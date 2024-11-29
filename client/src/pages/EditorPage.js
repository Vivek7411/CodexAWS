import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { executeCode } from "../api";
import { LANGUAGE_VERSIONS } from "../constants.js";

const fileExtensionMapping = {
  cpp: "cpp",
  java: "java",
  python: "py",
  javascript: "js",
  typescript: "ts",
  csharp: "cs",
  php: "php",
};

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef("");
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false); //------------28-11-2024
  const [isPanelVisible, setIsPanelVisible] = useState(true); // Toggle state for aside panel
  const [input, setInput] = useState(""); // Custom input state
  const [selectedLanguage, setSelectedLanguage] = useState(
    location.state?.language || "javascript"
  );

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();

        socketRef.current.on("connect_error", handleErrors);
        socketRef.current.on("connect_failed", handleErrors);

        function handleErrors(e) {
          console.log("socket error", e);
          toast.error("Socket connection failed, try again later.");
          reactNavigator("/");
        }

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.username,
        });

        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
              toast.success(`${username} joined the room.`);
              console.log(`${username} joined`);
            }
            setClients(clients);
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current || "",
              socketId,
            });
          }
        );

        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) =>
            prev.filter((client) => client.socketId !== socketId)
          );
        });
      } catch (error) {
        console.error("Socket initialization failed:", error);
        toast.error("Failed to initialize socket.");
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, [location.state?.username, reactNavigator, roomId]);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID. You can copy it manually.");
      console.error(err);

      const roomIdDisplay = document.getElementById("roomIdDisplay");
      if (roomIdDisplay) {
        roomIdDisplay.textContent = `Room ID: ${roomId} (You can copy it from here)`;
        roomIdDisplay.style.display = "block";
      }
    }
  }
  function leaveRoom() {
    reactNavigator("/");
  }

  const runCode = async () => {
    const code = codeRef.current;
    if (!code) {
      toast.error("No code to run");
      return;
    }

    setIsRunning(true);
    try {
      const response = await executeCode(selectedLanguage, code, input);
      setOutput(response.run.output);
    } catch (error) {
      toast.error("Error running the code");
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const exportCode = () => {
    const codeVal = codeRef.current.trim();
    if (!codeVal) {
      toast.error("No code to save");
      return;
    }
    const codeBlob = new Blob([codeVal], { type: "text/plain" });
    const downloadUrl = URL.createObjectURL(codeBlob);
    const codelink = document.createElement("a");
    codelink.href = downloadUrl;
    codelink.download = `code.${fileExtensionMapping[selectedLanguage]}`;
    codelink.click();
  };

  const toggleAsidePanel = () => {
    setIsPanelVisible((prev) => !prev);
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      {isPanelVisible && (
        <div className="aside">
          <div className="asideInner">
            <div className="logo">
              <img className="logoImage" src="/code-logo.png" alt="logo" />
            </div>
            <h3>Active Coders</h3>
            <div className="clientsList">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>

          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy ROOM ID
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            Leave
          </button>
          <button className="btn runBtn" onClick={runCode}>
            Run Code
          </button>
        </div>
      )}

      <div className="editorOutputWrap">
        <div className="editorWrap">
          <button className="toggleAsideBtn" onClick={toggleAsidePanel}>
            <div className="hamburger">
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </div>
          </button>
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>

        <div className="outputWrap">
          <div className="topRightCorner">
            <select
              className="languageSelect"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="" disabled>
                Select Language
              </option>
              {Object.entries(LANGUAGE_VERSIONS).map(([lang, version]) => (
                <option key={lang} value={lang}>
                  {`${lang} (${version})`}
                </option>
              ))}
            </select>
            <button className="downbtn" onClick={exportCode}>
              Download Code
            </button>
          </div>

          <h4>Output:</h4>
          {isRunning ? (
            <div className="spinner"></div>
          ) : (
            <pre>{output || 'No output yet'}</pre>
          )}

          <div className="customInputWrap">
            <h4>Custom Input:</h4>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter custom input"
              rows={5}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;