// const express = require('express');
// const cors = require('cors')
// const bodyparser = require('body-parser');
// const connectDB = require('./db/dbconnect');
// const dotenv = require('dotenv');
// const SignUpRouter = require('./routes/Signup');
// const cookie = require('cookie-parser');
// const loginRouter = require('./routes/Login');
// const jwt = require('jsonwebtoken');
// const http = require('http');
// const path = require('path');
// const { Server } = require('socket.io');
// const ACTIONS = require('./src/Actions');

// const server = http.createServer(app);
// const io = new Server(server);

// const app = express()
// dotenv.config()
// const port = process.env.PORT || 3100

// app.use(cookie());
// app.use(cors())
// app.use(bodyparser.json())

// app.use('/', SignUpRouter)
// app.use('/', loginRouter)
    

// app.get('/dashboard', (req, res) => {
//     const token = req.cookies.jwt
//     res.send(`Welcome ${token}`)
//     if(!token) {
//         res.status(401).json({
//             message: 'Unauthorized access'
//         })
//     }
//     try {
//         // Verify the JWT token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         res.send(`Welcome to the dashboard, User ID: ${decoded.user.id}`);
//     } catch (err) {
//         res.status(401).json({
//             message: 'Invalid token, access denied.',
//         });
//     }
//     res.send('Welcome to dashboard');
// })

// app.use(express.static('build'));
// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// const userSocketMap = {};
// function getAllConnectedClients(roomId) {
    
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//         (socketId) => {
//             return {
//                 socketId,
//                 username: userSocketMap[socketId],
//             };
//         }
//     );
// }

// io.on('connection', (socket) => {
//     console.log('socket connected', socket.id);

//     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//         userSocketMap[socket.id] = username;
//         socket.join(roomId);
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit(ACTIONS.JOINED, {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });

//     socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//         socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//         io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on('disconnecting', () => {
//         const rooms = [...socket.rooms];
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id],
//             });
//         });
//         delete userSocketMap[socket.id];
//         socket.leave();
//     });
// });



// connectDB().then(() => {
//     app.listen(port, () => {
//         console.log(`Server is running on port ${port}`)
//     })
// }).catch((err) => {
//     console.log("Failed to start server : ", err);
// })


const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const connectDB = require('./db/dbconnect');
const dotenv = require('dotenv');
const SignUpRouter = require('./routes/Signup');
const cookie = require('cookie-parser');
const loginRouter = require('./routes/Login');
const jwt = require('jsonwebtoken');
const http = require('http');
const path = require('path');
const {v4 : uuidV4} = require('uuid')
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');
const verifyToken = require('./middleware/auth');
dotenv.config(); 

const app = express(); 
const server = http.createServer(app);
//new io server on them
const io = new Server(server);

const port = process.env.PORT || 3100;

app.use(cookie());
app.use(cors());
app.use(bodyparser.json());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


app.use('/', SignUpRouter);
// app.use('/protected', ProtectedRoute)
app.use('/', loginRouter);

app.get('/dashboard', (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized access',
        });
    }
    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.send(`Welcome to the dashboard, User ID: ${decoded.user.id}`);
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid token, access denied.',
        });
    }
});

app.post('/create-room', verifyToken, (req, res) => {
    const roomId = uuidV4();
    // Logic to create a room (this can include room creation code)
    res.status(200).json({ message: 'Room created successfully', roomId});
});

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

connectDB()
    .then(() => {
        server.listen(port, () => { 
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log("Failed to start server: ", err);
    });
