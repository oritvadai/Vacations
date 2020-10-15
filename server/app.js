const express = require("express");
const cors = require("cors");
const expressSession = require("express-session");
const fileUpload = require("express-fileupload");
const socketIO = require("socket.io");


const vacationController = require("./controllers/vacations-controller");
const expressServer = express();

expressServer.use(cors({ origin: "http://localhost:3001", credentials: true }));
expressServer.use(express.json());
expressServer.use(expressSession({ name: "authenticationCookie", secret: "I-Love-Kittens", resave: true, saveUninitialized: false }));
expressServer.use(fileUpload());

expressServer.use("/api", vacationController);

// start listening, and take the listener object:
const expressListener = expressServer.listen(3000, () => console.log("Listening on http://localhost:3000"));
// create socket.io server:
let socketIOServer = socketIO(expressListener);
// make the socketIOserver accessible from the controller:
expressServer.set("socketIOServer", socketIOServer);

socketIOServer.sockets.on("connection", socket => {
    console.log("One client has been connected. Total clients: " + socketIOServer.engine.clientsCount);

    // setInterval(() => socketIOServer.sockets.emit("msg-from-server", "bla bla bla"), 5000);

    // Client sends message: 
    // socket.on("msg-from-client", msg => {

    //     console.log("Client message: " + msg);

    //     // Send that message to all clients: 
    //     socketIOServer.sockets.emit("msg-from-server", msg);
    // });

    socket.on("disconnect", () => {
        console.log("One client has been disconnected. Total clients: " + socketIOServer.engine.clientsCount);
    });

});