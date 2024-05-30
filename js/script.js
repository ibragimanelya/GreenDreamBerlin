let userLoggedIn = false;
let isAdmin = false;
let apiUrl = "https://nominatim.openstreetmap.org/search?q="

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
    lat: 52.4580228,
    lon: 13.511759,
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
    lat: 52.4573936,
    lon: 13.5269565,
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
    lat: 52.6067482,
    lon: 13.425493,
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

// Listener, um neu hochgeladenes Bild auch vor dem Save/Submit bzw. cancel anzuzeigen
document.getElementById('formFileUpdate').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('locationImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('formFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('locationImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

/*const updateUI = function (e) {
    e.preventDefault();

    if (userLoggedIn) {
        document.getElementById("screen1").style.display = "none";
        document.getElementById("screen2").style.display = "block";
        document.getElementById("greeting").textContent  += ", " + e.name + "!";

        if (isAdmin) {
            document.getElementById("addButton").style.display = "block";
        } else {
            document.getElementById("addButton").style.display = "none";
        }
        showLocations();
    } else {
        document.getElementById("usernameId").value = "";
        document.getElementById("password").value = "";
        document.getElementById("screen1").style.display = "block";
        document.getElementById("screen2").style.display = "none";
        document.getElementById("screen3").style.display = "none";
        document.getElementById("screen4").style.display = "none";
    }
}

const loginUser = function (e) {
    e.preventDefault();
    let username = document.getElementById("usernameId").value;
    let password = document.getElementById("password").value;

    for (const e of userArray) {
        if (username === e.username && password === e.password) {
            userLoggedIn = true;
            if (e.role === "admin") {
                isAdmin = true;
                updateUI();
                return;
            }
        }
    }
    if (userLoggedIn === false) {
        alert("Username or password is invalid!");
    }
}

const logoutUser = function () {
    userLoggedIn = false;
    updateUI();
}*/

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
    userLoggedIn = false;
    isAdmin = false;
    document.getElementById("greeting").textContent = "";
    document.getElementById("usernameId").value = "";
    document.getElementById("password").value = "";
    document.getElementById("screen1").style.display = "block";
    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen3").style.display = "none";
    document.getElementById("screen4").style.display = "none";
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

let currentIndex = -1;

const viewLocation = function (index) {
    currentIndex = index;
    const locationData = locArray[index];

    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen4").style.display = "block";

    document.getElementById("nameUpdate").value = locationData.title;
    document.getElementById("descriptionUpdate").value = locationData.description;
    document.getElementById("streetUpdate").value = locationData.street;
    document.getElementById("zipUpdate").value = locationData.zip;
    document.getElementById("cityUpdate").value = locationData.city;
    document.getElementById("latitudeUpdate").value = locationData.lat;
    document.getElementById("longitudeUpdate").value = locationData.lon;
    document.getElementById("categoryUpdate").value = locationData.category;
    document.getElementById("temporaryUpdate").checked = locationData.temporary;
    document.getElementById("locationImage").src = locationData.image;

    const cancelButton = document.getElementById("button-cancel-update-screen");
    cancelButton.style.display = "inline-block"; // show cancel button for any user

    const deleteButton = document.getElementById("button-delete");
    const submitButton = document.getElementById("button-update");

    // Show delete and submit buttons only if user is admin
    let username = document.getElementById("usernameId").value;
    let password = document.getElementById("passwordId").value;
    for (const e of userArray) {
        if (username === e.username && password === e.password) {
            userLoggedIn = true;
            if (e.role === "admin") {
                isAdmin = true;
                header.textContent = "Edit/View Details"
                deleteButton.style.display = "inline-block";
                submitButton.style.display = "inline-block";
            } else {
                isAdmin = false;
                header.textContent = "View Details"
                deleteButton.style.display = "none";
                submitButton.style.display = "none";
            }
        }
    }
}

const addLocation = function () {
    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen3").style.display = "block";

    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("street").value = "";
    document.getElementById("zip").value = "";
    document.getElementById("city").value = "";
    document.getElementById("latitude").value = "";
    document.getElementById("longitude").value = "";
    document.getElementById("category").value = "";
    document.getElementById("temporary").checked = false;

    document.getElementById("formFileUpdate").value = "";
    document.getElementById("formFile").value = ""; // Clear File Input data
}

const saveLocation = async function (e) {
    e.preventDefault();

    const result = await logResponse(document.getElementById("street").value + "," + document.getElementById("city").value) // API Request with Query containing entered street and city name
    if (result.length === 0) {
        alert("No results found for given Location!");
    }
    document.getElementById("latitude").value = result[0].lat;
    document.getElementById("longitude").value = result[0].lon;
    const fileInput = document.getElementById("formFile");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const newLocation = {
                title: document.getElementById("name").value,
                description: document.getElementById("description").value,
                street: document.getElementById("street").value,
                zip: document.getElementById("zip").value,
                city: document.getElementById("city").value,
                category: document.getElementById("category").value,
                temporary: document.getElementById("temporary").checked,
                lat: document.getElementById("latitude").value,
                lon: document.getElementById("longitude").value,
                image: event.target.result // Data URL of the image
            };

            locArray.push(newLocation);
            document.getElementById("screen3").style.display = "none";
            document.getElementById("screen2").style.display = "block";
            showLocations();
        };
        reader.readAsDataURL(file);
    } else {
        // If no file is selected, save the location without an image
        const newLocation = {
            title: document.getElementById("name").value,
            description: document.getElementById("description").value,
            street: document.getElementById("street").value,
            zip: document.getElementById("zip").value,
            city: document.getElementById("city").value,
            category: document.getElementById("category").value,
            temporary: document.getElementById("temporary").checked,
            lat: document.getElementById("latitude").value,
            lon: document.getElementById("longitude").value,
            image: null // No image provided
        };

        locArray.push(newLocation);
        document.getElementById("screen3").style.display = "none";
        document.getElementById("screen2").style.display = "block";
        showLocations();
    }
    document.getElementById("formFileUpdate").value = "";
    document.getElementById("formFile").value = ""; // Clear File Input data
}


const updateLocation = async function (e) {
    e.preventDefault();

    if (currentIndex === -1) {
        return;
    }

    const result = await logResponse(document.getElementById("streetUpdate").value + "," + document.getElementById("cityUpdate").value) // API Request with Query containing entered street and city name
    if (result.length === 0) {
        alert("No results found for given Location!");
    }
    document.getElementById("latitudeUpdate").value = result[0].lat;
    document.getElementById("longitudeUpdate").value = result[0].lon;

    const location = locArray[currentIndex];
    location.title = document.getElementById("nameUpdate").value;
    location.description = document.getElementById("descriptionUpdate").value;
    location.street = document.getElementById("streetUpdate").value;
    location.zip = document.getElementById("zipUpdate").value;
    location.city = document.getElementById("cityUpdate").value;
    location.lat = document.getElementById("latitudeUpdate").value;
    location.lon = document.getElementById("longitudeUpdate").value;
    location.category = document.getElementById("categoryUpdate").value;
    location.temporary = document.getElementById("temporaryUpdate").checked;

    const fileInput = document.getElementById("formFileUpdate");
    const file = fileInput.files[0];

    if (file) { // only change image if file is selected
        const reader = new FileReader();
        reader.onload = function(event) {
            location.image = event.target.result // Data URL of the image
            document.getElementById("screen4").style.display = "none";
            document.getElementById("screen2").style.display = "block";
            showLocations();
        };
        reader.readAsDataURL(file);
    } else {
        // If no file is selected, don't change the image
        document.getElementById("screen4").style.display = "none";
        document.getElementById("screen2").style.display = "block";
        showLocations();
    }

    document.getElementById("formFileUpdate").value = "";
    document.getElementById("formFile").value = ""; // Clear File Input data
}

const deleteLocation = function (e) {
    e.preventDefault();

    if (currentIndex !== -1) {
        locArray.splice(currentIndex, 1);
        currentIndex = -1;
    }

    document.getElementById("screen4").style.display = "none";
    document.getElementById("screen2").style.display = "block";
    showLocations();

    document.getElementById("formFileUpdate").value = "";
    document.getElementById("formFile").value = ""; // Clear File Input data
}

const cancel = function () {
    document.getElementById("screen2").style.display = "block";
    document.getElementById("screen3").style.display = "none";
    document.getElementById("screen4").style.display = "none";

    document.getElementById("formFileUpdate").value = "";
    document.getElementById("formFile").value = ""; // Clear File Input data
}

async function logResponse(query) {
    try {
        const response = await fetch("https://nominatim.openstreetmap.org/search?q=" + query + "&format=json");
        if (response.ok) {
            const respObject = await response.json();
            console.log(respObject);
            return respObject;  // Return the fetched data
        } else {
            alert(" Failed to access server with query " + query);
        }
    } catch (err) {
        alert(" Error connecting to server: " + err.message);
    }
}

document.getElementById("screen1").onclick = loginUser;
document.getElementById("logoutButton").onclick = logoutUser;
document.getElementById("addButton").onclick = addLocation;
document.getElementById("button-submit").onclick = saveLocation;
document.getElementById("button-cancel").onclick = cancel;
document.getElementById("button-cancel-update-screen").onclick = cancel;
document.getElementById("button-delete").onclick = deleteLocation;
document.getElementById("button-update").onclick = updateLocation;




