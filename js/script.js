let userLoggedIn = false;
let isAdmin = false;

let user1 = {
    username: "admina",
    password: "password",
    role: "admin",
    name: "Mina"
}

let user2 = {
    username: "normalo",
    password: "password",
    role: "non-admin",
    name: "Norman"
}

let userArray = [user1, user2]

let loc1 = {
    title: "Baustelle",
    description: "Die Baustelle auf der Brückenstraße sollte eigentlich schon vor einem halben Jahre fertig sein. Leider sind dort kaum Fortschritte zu sehen. Dies führt du einem Umweg von mindestens 15 Minuten für die meisten Studierenden, die normalerweise von Schöneweide die Tram nehmen.",
    street: "Brückenstraße 9",
    zip: 12459,
    city: "Berlin",
    category: "Public transportation",
    temporary: true,
    image: "img/Baustelle_Vert.jpg"
}

let loc2 = {
    title: "Industriegebiet nahe der HTW Berlin",
    description: "Das Industriegebiet so nah an der Hochschule verschlimmert die Luftqualität und die Umgebung des sonst ziemlich idyllischen Spreeufers.",
    street: "Wilhelminenhofstraße 75A",
    zip: 12459,
    city: "Berlin",
    category: "Industry",
    temporary: false,
    image: "img/Industrie_Horiz.jpg"
}

let loc3 = {
    title: "Ladesäule für Elektroautos",
    description: "Diese Ladesäule ist die einzige im Umkreis und zwar ein guter Anfang, jedoch durch gegebenes Zeitlimit und häufige Besetzung eher unpraktisch.",
    street: "Arnouxstraße 11",
    zip: 13127,
    city: "Berlin",
    category: "Cars/Car-Infrastructure",
    temporary: false,
    image: "img/Elektro_Horiz.jpg"
}

let locArray = [loc1, loc2, loc3] // TODO: Use this Array for displaying the list on the Main Page. Admina should be able to add and remove Locations from this array.

// Hide all Screens by default
document.getElementById("screen1").style.display = "none";
document.getElementById("screen2").style.display = "none";
document.getElementById("screen3").style.display = "none";
document.getElementById("screen4").style.display = "none";


if (userLoggedIn === false) {
    document.getElementById("screen1").style.display = "block"; // Display Login Screen when nobody is logged in
}
const loginUser = function (e) {
    e.preventDefault();
    let username = document.getElementById("usernameId").value;
    let password = document.getElementById("password").value;
    for (const e of userArray) { // Compare username and password with User Array
        if (username === e.username && password === e.password) { // If matching Combination found
            userLoggedIn = true;
            if(e.role === "admin") {
                isAdmin = true;
                document.getElementById("addButton").style.display="center"; // show add button
            } else {
                isAdmin = false;
                document.getElementById("addButton").style.display="none"; // hide add button
            }
            document.getElementById("greeting").textContent += ", " + e.name + "!"; // Personal Greeting
            document.getElementById("screen1").style.display = "none"; // Hide Login Screen
            document.getElementById("screen2").style.display = "block"; // Show Main Screen
            for (const e of locArray) {
                //TODO: Create list of Locations on Screen 2 by iterating through Array of Locations
                //TODO: Instead of hardcoded Locations as it is currently
            }
        }
    }
    if (userLoggedIn === false) {
        alert("Username or password is invalid");
    }
}

const logoutUser = function () {
    location.reload(); // Reloads Webpage to get default state, deletes changes
    //TODO: When admin logs out, save their changes, so that on next login (user or admin) the admins edits save
}

const viewLocation = function (e) { // go to view screen
    e.preventDefault();
    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen4").style.display = "block";
}

const addLocation = function () { // go to add screen
    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen3").style.display = "block";
}

const saveLocation = function () {
    //TODO
}

const cancel = function () { // Go back to location screen, hide other screens
    document.getElementById("screen2").style.display = "block";
    document.getElementById("screen3").style.display = "none";
    document.getElementById("screen4").style.display = "none";

}

document.getElementById("screen1").onsubmit = loginUser;
document.getElementById("logoutButton").onclick = logoutUser;
document.getElementById("location1").onclick = viewLocation;
document.getElementById("location2").onclick = viewLocation;
document.getElementById("location3").onclick = viewLocation;
document.getElementById("addButton").onclick = addLocation;
document.getElementById("button-submit").onclick = saveLocation;
document.getElementById("button-cancel").onclick = cancel;
document.getElementById("button-cancel-update-screen").onclick = cancel;




