const express = require("express");
const vacationsLogic = require("../business-logic-layer/vacations-logic");
const router = express.Router();

// User + Admin ---------------------------------------------------------------------------------

// Get All Vacations - GET http://localhost:3000/api/vacations
router.get("/vacations", async (request, response) => {
    try {
        if (!request.session.isLoggedIn) {
            response.status(403).send("Access Denied, Please Log-In");
            return;
        };
        const vacations = await vacationsLogic.getAllVacationsAsync();
        response.json(vacations);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});

// Get Image - GET http://localhost:3000/api//uploads/:imgName
router.get("/uploads/:imgName", async (request, response) => {
    try {
        if (!request.session.isLoggedIn) {
            response.status(403).send("Access Denied, Please Log-In");
            return;
        };
        const imgName = request.params.imgName;
        const imgPath = await vacationsLogic.getImagePathAsync(imgName);
        response.sendFile(imgPath);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});


// Admin ----------------------------------------------------------------------------------------

// Get One Vacation - GET http://localhost:3000/api/vacations/:id
router.get("/vacations/:id", async (request, response) => {
    try {
        if (!request.session.isAdmin) {
            response.status(403).send("Access Denied");
            return;
        };
        const id = +request.params.id;
        const vacation = await vacationsLogic.getVacationAsync(id);
        response.json(vacation);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});

// Add Vacation - POST http://localhost:3000/api/vacations/
router.post("/vacations", async (request, response) => {
    try {
        if (!request.session.isAdmin) {
            response.status(403).send("Access Denied");
            return;
        };
        if (!request.files) {
            response.status(400).send("No File Sent");
            return;
        };
        const image = request.files.image;
        const vacation = request.body;
        let err = "";

        let startDate = (new Date(vacation.startDate)).getTime();
        let endDate = (new Date(vacation.endDate)).getTime();
        let now = new Date();

        if (!vacation.destination || !vacation.description ||
            !vacation.startDate || !vacation.endDate || !vacation.price) {
            err = "Missing vacation data fields";
        }
        else if (vacation.destination.length > 50 || vacation.description.length > 500) {
            err = "The text entered exceeds the maximum length";
        }
        else if (!startDate || !endDate) {
            err = "Invalid date";
        }
        else if (startDate > endDate) {
            err = "End date must be later than start date";
        }
        else if (startDate < now || endDate < now) {
            err = "Dates must be in the future";
        }
        else if (!parseFloat(vacation.price) || vacation.price < 0) {
            err = "Price must be a positive number";
        };
        if (err !== "") {
            console.log(err);
            response.status(400).send(err);
            return;
        };
        const addedVacation = await vacationsLogic.addVacationAsync(vacation, image);
        // send new vacation to all clients:
        request.app.get("socketIOServer").sockets.emit("added-vacation", addedVacation);
        response.status(201).json(addedVacation);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});

// Update Vacation - PUT http://localhost:3000/api/vacations/:id
router.put("/vacations/:id", async (request, response) => {
    try {
        if (!request.session.isAdmin) {
            response.status(403).send("Access Denied");
            return;
        };
        const image = (request.files) ? request.files.image : null;
        const id = +request.params.id;
        const vacation = request.body;
        vacation.vacationID = id;

        let startDate = (new Date(vacation.startDate)).getTime();
        let endDate = (new Date(vacation.endDate)).getTime();
        let now = new Date();

        let err = "";
        if (!vacation.destination || !vacation.description ||
            !vacation.startDate || !vacation.endDate || !vacation.price) {
            err = "Missing vacation data fields";
        }
        else if (vacation.destination.length > 50 || vacation.description.length > 500) {
            err = "The text entered exceeds the maximum length";
        }
        else if (!startDate || !endDate) {
            err = "Invalid date";
        }
        else if (startDate > endDate) {
            err = "End date must be later than start date";
        }
        else if (startDate < now || endDate < now) {
            err = "Dates must be in the future";
        }
        else if (!parseFloat(vacation.price) || vacation.price < 0) {
            err = "Price must be a positive number";
        };
        if (err !== "") {
            console.log(err);
            response.status(400).send(err);
            return;
        };

        const updatedVacation = await vacationsLogic.updateVacationAsync(vacation, image);
        if (!updatedVacation) {
            response.status(404)
            return
        };

        // send edited vacation to all clients:
        request.app.get("socketIOServer").sockets.emit("updated-vacation", updatedVacation);

        response.json(updatedVacation);
    } catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});

// Delete Vacation - DELETE http://localhost:3000/api/vacations/:id
router.delete("/vacations/:id", async (request, response) => {
    try {
        if (!request.session.isAdmin) {
            response.status(403).send("Access Denied");
            return;
        };
        const id = +request.params.id;
        await vacationsLogic.deleteVacationAsync(id);

        // send deleted vacation ID to all clients:
        request.app.get("socketIOServer").sockets.emit("del-vacation-id", id);
        response.sendStatus(204);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});

// Get Followers Count Data - GET http://localhost:3000/api/followers-count
router.get("/followers-count", async (request, response) => {
    try {
        if (!request.session.isAdmin) {
            response.status(403).send("Access Denied, Please Log-In");
            return;
        };
        const followers = await vacationsLogic.getFollowersCountAsync();
        response.json(followers);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});


// Users ---------------------------------------------------------------------------------------

// Get Followed Per User - GET http://localhost:3000/api/followed
router.get("/followed", async (request, response) => {
    try {
        if (!request.session.isLoggedIn) {
            response.status(403).send("Access Denied, Please Log-In");
            return;
        };
        const username = request.session.username;
        const followed = await vacationsLogic.getFollowedPerUserAsync(username);
        response.json(followed);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});

// Add Followed Vacation - POST http://localhost:3000/api/followers
router.post("/followers", async (request, response) => {
    try {
        if (!request.session.isLoggedIn) {
            response.status(403).send("Access Denied, Please Log-In");
            return;
        };
        const username = request.session.username;
        const vacationID = +request.body.vacationID;
        const result = await vacationsLogic.addFollowerAsync(username, vacationID);

        if (result) {
            // update followers chart:
            request.app.get("socketIOServer").sockets.emit("added-follower", vacationID);
        };
        console.log(result + " " + vacationID);

        response.status(201).json(result);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});

// Delete Followed Vacation - DELETE http://localhost:3000/api/followers/vacationID
router.delete("/followers/:vacationID", async (request, response) => {
    try {
        if (!request.session.isLoggedIn) {
            response.status(403).send("Access Denied, Please Log-In");
            return;
        };
        const username = request.session.username;
        const vacationID = +request.params.vacationID;
        const result = await vacationsLogic.deleteFollowerAsync(username, vacationID);
        if (result) {
            // update followers chart:
            request.app.get("socketIOServer").sockets.emit("removed-follower", vacationID);
        };
        console.log(result + " " + vacationID);

        response.sendStatus(204)
    } catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});


// Login/out and Register --------------------------------------------------------------------

// Login - POST http://localhost:3000/api/login
router.post("/login", async (request, response) => {
    try {
        const username = request.body.username;
        const password = request.body.password;
        const user = await vacationsLogic.loginAsync(username, password);
        if (!user) {
            response.status(403).send("Incorrect username or password");
            return;
        }
        request.session.isLoggedIn = true;
        request.session.isAdmin = (user.role == "admin");
        request.session.username = username;
        response.json(user);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});

// Logout - POST http://localhost:3000/api/logout
router.post("/logout", (request, response) => {
    request.session.destroy();
    response.send();
});

// Register - POST http://localhost:3000/api/users
router.post("/users", async (request, response) => {
    try {
        const user = request.body;
        console.log(user.firstName + user.lastName + user.username + user.password)

        let err = "";
        if (!user.firstName || !user.lastName || !user.username || !user.password) {
            // console.log(user.firstName + user.lastName + user.username + user.password)
            err = "Missing registration data fields";
        }
        else if (user.firstName.length > 50 || user.lastName.length > 50 ||
            user.username.length > 50 || user.password.length > 50) {
            err = "The text entered exceeds the maximum length";
        }
        else if (user.password.length < 6) {
            err = "Password too short";
        };
        if (err !== "") {
            console.log(err);
            response.status(400).send(err);
            return;
        };

        const addedUser = await vacationsLogic.addUserAsync(user);

        request.session.isLoggedIn = true;
        request.session.isAdmin = false;
        request.session.username = user.username;
        response.status(201).json(addedUser);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send(err.message);
    };
});


module.exports = router;