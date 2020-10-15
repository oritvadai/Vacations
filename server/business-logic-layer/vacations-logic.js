const dal = require("../data-access-layer/dal");
const uuid = require("uuid/v4");
const fs = require("fs");
const path = require("path");

// User + Admin ---------------------------------------------------------------------------------

// Get all vacations
async function getAllVacationsAsync() {
    const sql = `SELECT vacationID, description, destination, picFileName, 
        DATE_FORMAT(startDate,'%Y-%m-%d') as startDate,
        DATE_FORMAT(endDate,'%Y-%m-%d') as endDate, price
        FROM Vacations`;
    const vacations = await dal.executeAsync(sql);
    return vacations;
};

// Get Image
// (could also be sync bcz it's fast, kept for consistency)
async function getImagePathAsync(imgName) {
    return path.join(__dirname, "../uploads", imgName);
};


// Admin -------------------------------------------------------------------

// Get One vacation
async function getVacationAsync(id) {
    const sql = `SELECT vacationID, description, destination, picFileName, 
        DATE_FORMAT(startDate,'%Y-%m-%d') as startDate,
        DATE_FORMAT(endDate,'%Y-%m-%d') as endDate, price
        FROM Vacations
        WHERE vacationID = ${id}`;
    const vacation = await dal.executeAsync(sql);
    return vacation[0];
};

// Add Vacation
async function addVacationAsync(vacation, image) {
    if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
    }
    const extension = image.name.substr(image.name.lastIndexOf("."));
    const fileName = uuid() + extension;
    vacation.picFileName = fileName;
    image.mv("./uploads/" + fileName);

    const sql = `INSERT INTO Vacations(description, destination, picFileName, startDate, endDate, price)
        VALUES('${vacation.description}','${vacation.destination}','${vacation.picFileName}',
        '${vacation.startDate}','${vacation.endDate}',${vacation.price})`;

    const info = await dal.executeAsync(sql);
    vacation.vacationID = info.insertId;
    return vacation;
};

// Update Vacation
async function updateVacationAsync(vacation, image) {
    if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
    }

    const sqlFileName = `SELECT picFileName FROM Vacations WHERE vacationID = ${vacation.vacationID}`;
    const response = await dal.executeAsync(sqlFileName);
    const oldFileName = response[0].picFileName;

    let isImageSaved = false;

    if (!image) {
        // no new image - keep previous image
        vacation.picFileName = oldFileName;
    }
    else {
        // new image - save with new uuid name
        const extension = image.name.substr(image.name.lastIndexOf("."));
        const newFileName = uuid() + extension;
        vacation.picFileName = newFileName;
        image.mv("./uploads/" + newFileName)
            .then(() => isImageSaved = true)
            .catch(err => err.message);
    };

    const sqlUpdateVac = `
        UPDATE Vacations SET
        description = '${vacation.description}',
        destination = '${vacation.destination}',
        picFileName = '${vacation.picFileName}',
        startDate = '${vacation.startDate}',
        endDate = '${vacation.endDate}',
        price = ${vacation.price}
        WHERE vacationID = ${vacation.vacationID}`;

    const info = await dal.executeAsync(sqlUpdateVac);

    // successful update - delete old picture
    if (isImageSaved && info.affectedRows !== 0) {
        imagePath = path.join(__dirname, "../uploads", oldFileName);
        fs.unlinkSync(imagePath);
    };

    return info.affectedRows === 0 ? null : vacation;
};

// Delete Vacation
async function deleteVacationAsync(id) {
    const sqlFileName = `SELECT picFileName FROM Vacations WHERE vacationID = ${id}`;
    const response = await dal.executeAsync(sqlFileName);
    const picFileName = response[0].picFileName;
    // console.log("picFileName: " + picFileName);

    // delete uses cascade in mysql database to remove followed entries
    const sqlDelVac = `DELETE FROM Vacations WHERE vacationID = ${id}`;
    await dal.executeAsync(sqlDelVac);

    // TODO: don't delete image if sql delete didn't work
    imagePath = path.join(__dirname, "../uploads", picFileName);
    fs.unlinkSync(imagePath);
};

// Get Followers Count Data
async function getFollowersCountAsync() {
    const sql = `SELECT vacations.vacationID, vacations.destination, COUNT(*) AS count
        FROM vacations JOIN Followers
        on vacations.vacationID = followers.vacationID
        GROUP BY followers.vacationID`;
    const followers = await dal.executeAsync(sql);
    return followers;
};


// Users -------------------------------------------------------------------

// Get Followed Vacations Per User
async function getFollowedPerUserAsync(username) {
    const sql = `SELECT vacationID                                
        FROM Followers as F JOIN Users as U              
        ON F.userID = U.userID
        WHERE U.username = '${username}'`;
    const followedPerUser = await dal.executeAsync(sql);
    return followedPerUser;
};

// Add Followed Vacation
async function addFollowerAsync(username, vacationID) {
    const sql = `INSERT INTO Followers(userID, vacationID)
        SELECT userID, ${vacationID} FROM users WHERE username = '${username}'`;
    const info = await dal.executeAsync(sql);
    return (info.affectedRows === 1);
};

// Delete Followed Vacation
async function deleteFollowerAsync(username, vacationID) {
    const sql = `DELETE F FROM Followers AS F JOIN Users AS U
        ON F.userID = U.userID
        WHERE U.username = '${username}' AND F.vacationID = ${vacationID}`;
    const info = await dal.executeAsync(sql);
    return (info.affectedRows === 1);
};


// Login/out and Register --------------------------------------------------------------------

// Login (check if user or admin)
async function loginAsync(username, password) {
    const sql = `SELECT username, firstName, lastName, isAdmin FROM Users WHERE username = '${username}' AND password = '${password}'`;
    const queryResult = await dal.executeAsync(sql);
    if (queryResult.length === 0) {
        return null;
    };
    let user = {
        "username": username,
        "firstName": queryResult[0].firstName,
        "lastName": queryResult[0].lastName,
        "role": (queryResult[0].isAdmin === 1) ? "admin" : "user"
    };
    return user;
};

// Register New User
async function addUserAsync(user) {
    const sql = `INSERT INTO Users(firstName, lastName, username, password)
        VALUES('${user.firstName}','${user.lastName}','${user.username}',
        '${user.password}')`;
    const info = await dal.executeAsync(sql);
    delete user.password;
    user.id = info.insertId;
    user.role = "user";
    return user;
};



module.exports = {
    // User + Admin
    getAllVacationsAsync,
    getImagePathAsync,
    
    // Admin
    getVacationAsync,
    addVacationAsync,
    updateVacationAsync,
    deleteVacationAsync,
    getFollowersCountAsync,

    // Users
    getFollowedPerUserAsync,
    addFollowerAsync,
    deleteFollowerAsync,

    // Users
    loginAsync,
    addUserAsync
};