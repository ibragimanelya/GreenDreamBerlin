let userLoggedIn = false;
let isAdmin = false;
let apiUrl = "https://nominatim.openstreetmap.org/search?q="
let responseFormat = "&format=json"

document.getElementById("screen1").style.display = "none";
document.getElementById("screen2").style.display = "none";
document.getElementById("screen3").style.display = "none";
document.getElementById("screen4").style.display = "none";

if (userLoggedIn === false) {
    document.getElementById("screen1").style.display = "block";
}

// Listener, um neu hochgeladenes Bild auch vor dem Save/Submit bzw. cancel anzuzeigen
document.getElementById('formFileUpdate').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('locationImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('formFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('locationImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

const loginUser = function (e) {
    e.preventDefault();

    let username = document.getElementById("usernameId").value;
    let password = document.getElementById("password").value;

    if (username === "" || password === "") {
        alert("Please enter both username and password!");
        return;
    }

    fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Invalid credentials');
            }
        })
        .then(user => {
            userLoggedIn = true;
            if (user.role === "admin") {
                isAdmin = true;
                document.getElementById("addButton").style.display = "inline-block";
            } else {
                isAdmin = false;
                document.getElementById("addButton").style.display = "none";
            }
            document.getElementById("greeting").textContent += ", " + user.name + "!"; // Personal Greeting
            document.getElementById("screen1").style.display = "none";
            document.getElementById("screen2").style.display = "block";
            document.getElementById("header").style.display = "block";
            showLocations();
        })
        .catch(error => {
            alert("Username or password is invalid");
        });
}


const logoutUser = function () {
    userLoggedIn = false;
    isAdmin = false;
    document.getElementById("greeting").textContent = "Willkommen zu GreenDreamBerlin"; // Personal Greeting
    document.getElementById("usernameId").value = "";
    document.getElementById("password").value = "";
    document.getElementById("screen1").style.display = "block";
    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen3").style.display = "none";
    document.getElementById("screen4").style.display = "none";
    document.getElementById("header").style.display = "block";
}

const showLocations = async function () {
    const locationsContainer = document.getElementById("locationsContainer");
    locationsContainer.innerHTML = "";

    try {
        const response = await fetch('/loc');
        console.log('Response from /loc:, response');
        if (response.status === 200) {
            const locArray = await response.json();
            console.log('Fetched locations:', locArray);
            locArray.forEach((location, index) => {
                const locationDiv = document.createElement("div");
                locationDiv.classList.add("gallery");
                locationDiv.onclick = function () {
                    viewLocation(location._id);
                };
                const locationImg = document.createElement("img");
                locationImg.src = location.image;
                locationImg.alt = location.name;

                const locationDesc = document.createElement("div");
                locationDesc.classList.add("desc");
                locationDesc.innerHTML = `${location.title}<br>PLZ: ${location.zip}<br>Stadt: ${location.city}<br>Straße: ${location.street}`;

                locationDiv.appendChild(locationImg);
                locationDiv.appendChild(locationDesc);
                locationsContainer.appendChild(locationDiv);
            });
        } else {
            alert("Failed to load locations.");
        }
    } catch (error) {
        console.error('Error fetching locations', error);
    }
};

let currentIndex = -1;

const viewLocation = async function (id) {
    try {
        const response = await fetch(`/loc/${id}`);
        if (response.status === 200) {
            const locationData = await response.json();

            currentIndex = id;

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

            if (!isAdmin) { // Wenn der Benutzer kein Admin ist
                document.getElementById("nameUpdate").readOnly = true;
                document.getElementById("descriptionUpdate").readOnly = true;
                document.getElementById("streetUpdate").readOnly = true;
                document.getElementById("zipUpdate").readOnly = true;
                document.getElementById("cityUpdate").readOnly = true;
                document.getElementById("latitudeUpdate").readOnly = true;
                document.getElementById("longitudeUpdate").readOnly = true;
                document.getElementById("categoryUpdate").disabled = true;
                document.getElementById("temporaryUpdate").disabled = true;
            } else {
                // Editable for admin users
                document.getElementById("nameUpdate").readOnly = false;
                document.getElementById("descriptionUpdate").readOnly = false;
                document.getElementById("streetUpdate").readOnly = false;
                document.getElementById("zipUpdate").readOnly = false;
                document.getElementById("cityUpdate").readOnly = false;
                document.getElementById("latitudeUpdate").readOnly = true;
                document.getElementById("longitudeUpdate").readOnly = true;
                document.getElementById("categoryUpdate").disabled = false;
                document.getElementById("temporaryUpdate").disabled = false;
                document.getElementById("formFileUpdate").disabled = false;
            }

            if (isAdmin) { // Using the global isAdmin flag
                document.getElementById("viewEditHeader").textContent = "Edit/View Details"; // Update h3 text
                deleteButton.style.display = "inline-block";
                submitButton.style.display = "inline-block";
            } else {
                document.getElementById("viewEditHeader").textContent = "View Details"; // Update h3 text
                deleteButton.style.display = "none";
                submitButton.style.display = "none";
            }
        } else {
            alert('Failed to load location details.');
        }
    } catch (error) {
        console.error('Error fetching location details', error);
        alert('failed to load location details.');
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

    const result = await logResponse(document.getElementById("street").value + "," + document.getElementById("city").value); // API Request with Query containing entered street and city name
    if (result.length === 0) {
        alert("No results found for given Location!");
        return;
    }

    document.getElementById("latitude").value = result[0].lat;
    document.getElementById("longitude").value = result[0].lon;
    const fileInput = document.getElementById("formFile");
    const file = fileInput.files[0];

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
        image: null
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = async function (event) {
            newLocation.image = event.target.result;
            await saveLocationToDatabase(newLocation);
        };
        reader.readAsDataURL(file);
    } else {
        await saveLocationToDatabase(newLocation);
    }

    document.getElementById("formFileUpdate").value = "";
    document.getElementById("formFile").value = ""; // Clear File Input data
}

const saveLocationToDatabase = async function (newLocation) {
    try {
        const response = await fetch('/loc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newLocation),
        });

        if (response.status === 201) {
            console.log('Location created successfully');
            document.getElementById("screen3").style.display = "none";
            document.getElementById("screen2").style.display = "block";
            await showLocations(); // Refresh locations after adding a new one
        } else {
            alert('Failed to create location.');
        }
    } catch (error) {
        console.error('Error saving location:', error);
        alert('Failed to create location. Image size too large!');
    }
}

const updateLocation = async function (e) {
    e.preventDefault();

    if (currentIndex === -1) {
        return;
    }

    const result = await logResponse(document.getElementById("streetUpdate").value + "," + document.getElementById("cityUpdate").value) // API Request with Query containing entered street and city name
    if (result.length === 0) {
        alert("No results found for given Location!");
        return;
    }
    document.getElementById("latitudeUpdate").value = result[0].lat;
    document.getElementById("longitudeUpdate").value = result[0].lon;

    const location = {
        title: document.getElementById("nameUpdate").value,
        description: document.getElementById("descriptionUpdate").value,
        street: document.getElementById("streetUpdate").value,
        zip: document.getElementById("zipUpdate").value,
        city: document.getElementById("cityUpdate").value,
        lat: document.getElementById("latitudeUpdate").value,
        lon: document.getElementById("longitudeUpdate").value,
        category: document.getElementById("categoryUpdate").value,
        temporary: document.getElementById("temporaryUpdate").checked,
        image: null,
    };

    const fileInput = document.getElementById("formFileUpdate");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = async function (event) {
            location.image = event.target.result;
            await updateLocationInDatabase(location);
        };
        reader.readAsDataURL(file);
    } else {
        await updateLocationInDatabase(location);
    }

    document.getElementById("formFileUpdate").value = "";
    document.getElementById("formFile").value = "";
}

const updateLocationInDatabase = async function (location) {
    try {
        console.log('Updating location with ID:', currentIndex); // Add logging
        console.log('Updated data:', location); // Add logging

        const response = await fetch(`/loc/${currentIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
        });

        if (response.status === 204) {
            document.getElementById("screen4").style.display = "none";
            document.getElementById("screen2").style.display = "block";
            await showLocations();
        } else if (response.status === 404) {
            alert('Location not found');
        } else {
            const errorText = await response.text();
            console.error('Failed to update location:', errorText);
            alert('Failed to update location. Image size too large!');
        }
    } catch (error) {
        console.error('Error updating location:', error);
    }
}

const deleteLocation = async function (e) {
    e.preventDefault();

    if (currentIndex !== -1) {
        try {
            const response = await fetch(`/loc/${currentIndex}`, {
                method: 'DELETE',
            });

            if (response.status === 204) {
                currentIndex = -1;
                document.getElementById("screen4").style.display = "none";
                document.getElementById("screen2").style.display = "block";
                showLocations();
            } else {
                alert('Failed to delete location.');
            }
        } catch (error) {
            console.error('Error deleting location:', error);
            alert('Failed to delete location.');
        }
    }
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
        const response = await fetch(apiUrl + query + responseFormat);
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

document.getElementById("button-login").onclick = loginUser;
document.getElementById("logoutButton").onclick = logoutUser;
document.getElementById("addButton").onclick = addLocation;
document.getElementById("button-submit").onclick = saveLocation;
document.getElementById("button-cancel").onclick = cancel;
document.getElementById("button-cancel-update-screen").onclick = cancel;
document.getElementById("button-delete").onclick = deleteLocation;
document.getElementById("button-update").onclick = updateLocation;