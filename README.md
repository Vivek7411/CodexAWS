
# Codex

**Codex** is a collaborative real-time code editor built using the MERN stack and powered by **Socket.io** for seamless communication. The platform ensures user-friendly interaction with features like protected routes, room creation, and code-saving functionality.

## 🌐 Deployed URL

You can access the live application here:  
[http://13.211.228.124](http://13.211.228.124)

## 🚀 Features

- **Real-Time Collaboration**: Share a room with others and collaborate on code in real-time.
- **Protected Routes**: Secured access to pages such as login, signup, dashboard, and editor.
- **Authentication**: Login and signup functionality ensures user management.
- **Dashboard Navigation**: Logged-in users are redirected to the dashboard to manage their sessions.
- **Room Management**:
  - Create rooms after logging in.
  - Join rooms without requiring authentication.
- **Code Saving**: Hosts can save their work in the database and retrieve it when they log back in or rejoin.
- **Responsive UI**: Optimized for all screen sizes for better usability.

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Real-Time Communication**: Socket.io
- **Authentication**: JSON Web Tokens (JWT)

## 📂 Project Structure

-CODEX
  -client
  -server


## ⚙️ Installation

To set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Codex.git
   cd Codex

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install


MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
SOCKET_PORT=your-socket-port


# Start server
cd server
npm start

# Start client
cd ../client
npm start


Here's a README.md file for your Codex project, incorporating the deployed URL:

markdown
Copy code
# Codex

**Codex** is a collaborative real-time code editor built using the MERN stack and powered by **Socket.io** for seamless communication. The platform ensures user-friendly interaction with features like protected routes, room creation, and code-saving functionality.

## 🌐 Deployed URL

You can access the live application here:  
[http://13.211.228.124](http://13.211.228.124)

## 🚀 Features

- **Real-Time Collaboration**: Share a room with others and collaborate on code in real-time.
- **Protected Routes**: Secured access to pages such as login, signup, dashboard, and editor.
- **Authentication**: Login and signup functionality ensures user management.
- **Dashboard Navigation**: Logged-in users are redirected to the dashboard to manage their sessions.
- **Room Management**:
  - Create rooms after logging in.
  - Join rooms without requiring authentication.
- **Code Saving**: Hosts can save their work in the database and retrieve it when they log back in or rejoin.
- **Responsive UI**: Optimized for all screen sizes for better usability.

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Real-Time Communication**: Socket.io
- **Authentication**: JSON Web Tokens (JWT)

## 📂 Project Structure

Codex ├── client # Frontend React app ├── server # Backend Node.js app └── README.md # Project documentation

bash
Copy code

## ⚙️ Installation

To set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Codex.git
   cd Codex
Install dependencies for both the client and server:

bash
Copy code
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
Create a .env file in the server directory with the required environment variables:

env
Copy code
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
SOCKET_PORT=your-socket-port
Start the development servers:

bash
Copy code
# Start server
cd server
npm start

# Start client
cd ../client
npm start
Open the app in your browser at http://localhost:3000.



🤝 Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.

📧 Contact
If you have any questions or suggestions, feel free to reach out:

Author: 1. Vikhyat Garg (Backend Developer)
        2. Sumit Sagar (Lead Developer)
        3. Vivek Nehra (UI/UX, Deployment)
        
Email: vikhyatgarg9690@gmail.com

