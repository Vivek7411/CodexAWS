

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

editor page - app.js



{
  "name": "codex",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@chakra-ui/react": "^2.8.2",
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "@monaco-editor/react": "^4.6.0",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.7.7",
    "codemirror": "^5.65.17",
    "express": "^4.19.2",
    "framer-motion": "^11.5.6",
    "react": "^18.3.1",
    "react-avatar": "^5.0.3",
    "react-dom": "^18.3.1",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.25.1",
    "react-scripts": "^5.0.1",
    "socket.io": "^4.7.5",
    "socket.io-client": "^4.7.5",
    "uuid": "^10.0.0",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "server:dev": "nodemon server.js",
    "server:prod": "node server.js",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11",
    "nodemon": "^3.1.4"
  }
}





import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { executeCode } from '../api';
import { LANGUAGE_VERSIONS } from '../constants.js';
import axios from 'axios'; // Import axios for making HTTP requests

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(''); 
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [output, setOutput] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(location.state?.language || 'javascript');

    useEffect(() => {
        const init = async () => {
            try {
                socketRef.current = await initSocket();

                socketRef.current.on('connect_error', handleErrors);
                socketRef.current.on('connect_failed', handleErrors);

                function handleErrors(e) {
                    console.log('socket error', e);
                    toast.error('Socket connection failed, try again later.');
                    reactNavigator('/');
                }

                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username: location.state?.username,
                });

                socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current || '', 
                        socketId,
                    });
                });

                socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) =>
                        prev.filter((client) => client.socketId !== socketId)
                    );
                });

            } catch (error) {
                console.error('Socket initialization failed:', error);
                toast.error('Failed to initialize socket.');
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
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID. You can copy it manually.');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    const runCode = async () => {
        const code = codeRef.current;
        if (!code) {
            toast.error('No code to run');
            return;
        }

        try {
            const response = await executeCode(selectedLanguage, code); 
            setOutput(response.run.output); 
        } catch (error) {
            toast.error('Error running the code');
            console.error(error);
        }
    };

    // Save code to backend
    const saveCode = async () => {
        const code = codeRef.current;
        if (!code) {
            toast.error('No code to save');
            return;
        }

        try {
            const token = localStorage.getItem('token')
             
            
            const response = await axios.post('http://localhost:5100/save-code', {
                roomId,

                code,
            },
            {
                headers:{
                Authorization: `Bearer ${token}`,
            }
        }
        );
            toast.success(response.data.message || 'Code saved successfully!');
        } catch (error) {
            toast.error('Failed to save code');
            console.error('Save code error:', error);
        }
    };

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src="/code-logo.png" alt="logo" />
                    </div>
                    <h3>Connected</h3>
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
                <button className="btn saveBtn" onClick={saveCode}> {/* Add Save Button */}
                    Save Code
                </button>
            </div>
            
            <div className="editorOutputWrap">
                <div className="editorWrap">
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
                            <option value="" disabled>Select Language</option>
                            {Object.entries(LANGUAGE_VERSIONS).map(([lang, version]) => (
                                <option key={lang} value={lang}>
                                    {`${lang} (${version})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <h4>Output:</h4>
                    <pre>{output || 'No output yet'}</pre>
                </div>
            </div>
        </div>
    );
};

>>>>>>> 902c6d927fce0782cc2359c9c825e8561bfdcf61
export default EditorPage;