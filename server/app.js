const express = require("express");
const cors = require("cors");
const expressSession = require("express-session");
const fileUpload = require("express-fileupload");
const socketIO = require("socket.io");
const config = require("./config.json");


const vacationController = require("./controllers/vacations-controller");
const expressServer = express();

expressServer.use(cors({ origin: `http://localhost:${config.client.port}`, credentials: true }));
expressServer.use(express.json());
expressServer.use(expressSession({
    name: "authenticationCookie", 
    secret: config.secrets.expressSession,
    resave: true, 
    saveUninitialized: false
}));
expressServer.use(fileUpload());

expressServer.use("/api", vacationController);

// start listening, and take the listener object:
const expressListener = expressServer.listen(
    config.server.port, () => console.log(`Listening on http://localhost:${config.server.port}`)
);
// create socket.io server:
let socketIOServer = socketIO(expressListener);
// make the socketIOserver accessible from the controller:
expressServer.set("socketIOServer", socketIOServer);

socketIOServer.sockets.on("connection", socket => {
    console.log("One client has been connected. Total clients: " + socketIOServer.engine.clientsCount);

    socket.on("disconnect", () => {
        console.log("One client has been disconnected. Total clients: " + socketIOServer.engine.clientsCount);
    });
});