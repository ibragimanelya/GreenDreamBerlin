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

let locArray = [loc1, loc2, loc3]

document.getElementById("screen1").style.display = "none";
document.getElementById("screen2").style.display = "none";
document.getElementById("screen3").style.display = "none";
document.getElementById("screen4").style.display = "none";


if (userLoggedIn === false) {
    document.getElementById("screen1").style.display = "block";
}
const loginUser = function (e) {
    e.preventDefault();
    let username = document.getElementById("usernameId").value;
    let password = document.getElementById("password").value;
    for (const e of userArray) {
        if (username === e.username && password === e.password) {
            userLoggedIn = true;
            if(e.role === "admin") {
                isAdmin = true;
                document.getElementById("addButton").style.display="center";
            } else {
                isAdmin = false;
                document.getElementById("addButton").style.display="none";
            }
            document.getElementById("greeting").textContent += ", " + e.name + "!"; // Personal Greeting
            document.getElementById("screen1").style.display = "none";
            document.getElementById("screen2").style.display = "block";
            showLocations();
        }
    }
    if (userLoggedIn === false) {
        alert("Username or password is invalid");
    }
}

const logoutUser = function () {
    location.reload(); // Reloads Webpage to get default state
}

const showLocations = function () {
    const locationsContainer = document.getElementById("locationsContainer");
    locationsContainer.innerHTML = "";

    locArray.forEach((location, index) => {
        const locationDiv = document.createElement("div");
        locationDiv.classList.add("gallery");
        locationDiv.onclick = function () {
            viewLocation(index);
        };

        const locationImg = document.createElement("img");
        locationImg.src = location.image;
        locationImg.alt = location.title;

        const locationDesc = document.createElement("div");
        locationDesc.classList.add("desc");
        locationDesc.innerHTML = `${location.title}<br>PLZ: ${location.zip}<br>Stadt: ${location.city}<br>Straße: ${location.street}`;

        locationDiv.appendChild(locationImg);
        locationDiv.appendChild(locationDesc);
        locationsContainer.appendChild(locationDiv);
    });
};

const viewLocation = function (index) {
    const locationData = locArray[index];

    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen4").style.display = "block";

    document.getElementById("nameUpdate").value = locationData.title;
    document.getElementById("descriptionUpdate").value = locationData.description;
    document.getElementById("streetUpdate").value = locationData.street;
    document.getElementById("zipUpdate").value = locationData.zip;
    document.getElementById("cityUpdate").value = locationData.city;
    document.getElementById("categoryUpdate").value = locationData.category;
    document.getElementById("temporaryUpdate").checked = locationData.temporary;

    const cancelButton = document.getElementById("button-cancel-update-screen");
    cancelButton.style.display = "inline-block"; // show cancel button for any user

    const deleteButton = document.getElementById("button-delete");
    const submitButton = document.getElementById("button-update");

    // Show delete and submit buttons only if user is admin
    let username = document.getElementById("usernameId").value;
    let password = document.getElementById("password").value;
    for (const e of userArray) {
        if (username === e.username && password === e.password) {
            userLoggedIn = true;
            if (e.role === "admin") {
                isAdmin = true;
                deleteButton.style.display = "inline-block";
                submitButton.style.display = "inline-block";
            } else {
                isAdmin = false;
                deleteButton.style.display = "none";
                submitButton.style.display = "none";
            }

            // TODO show the picture as well
            // TODO Longitude, Latitude Aufruf
        }
    }
}

const addLocation = function () {
    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen3").style.display = "block";
}

const saveLocation = function () {
    //TODO
}

const cancel = function () {
    document.getElementById("screen2").style.display = "block";
    document.getElementById("screen3").style.display = "none";
    document.getElementById("screen4").style.display = "none";

}

document.getElementById("screen1").onsubmit = loginUser;
document.getElementById("logoutButton").onclick = logoutUser;
document.getElementById("addButton").onclick = addLocation;
document.getElementById("button-submit").onclick = saveLocation;
document.getElementById("button-cancel").onclick = cancel;
document.getElementById("button-cancel-update-screen").onclick = cancel;




