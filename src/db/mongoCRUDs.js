const {MongoClient, ObjectId} = require("mongodb");

const db_user = "jadelyadb_admina";
const db_pass = "pqkM1ZLTC";
const db_name = "jadelyadb";
const db_collection_users = "users";
const db_collection_locations = "loc";
const dbHostname = "mongodb1.f4.htw-berlin.de";
const dbPort = 27017;
const uri = `mongodb://${db_user}:${db_pass}@${dbHostname}:${dbPort}/${db_name}`;

function MongoCRUDs(db_name, uri) {
    this.db_name = db_name;
    this.uri = uri;
}

MongoCRUDs.prototype.findOneUser = async function (uNameIn, passwdIn) {
    const client = new MongoClient(uri);
    try {
        const database = client.db(db_name);
        const users = database.collection(db_collection_users);
        const query = {username: uNameIn, password: passwdIn};
        const doc = await users.findOne(query);
        if (doc) {
            delete doc.password;
        }
        return doc;
    } finally {
        // Ensures that the client will close when finished and on error
        await client.close();
    }
};

MongoCRUDs.prototype.findAllUsers = async function () {
    const client = new MongoClient(uri);
    try {
        const database = client.db(db_name);
        const users = database.collection(db_collection_users);
        const query = {};
        const cursor = users.find(query);
        // Print a message if no documents were found
        if ((await users.countDocuments(query)) === 0) {
            console.log("No documents found!");
            return null;
        }
        let docs = [];
        for await (const doc of cursor) {
            delete doc.password;
            docs.push(doc);
        }
        return docs;
    } finally {
        // Ensures that the client will close when finished and on error
        await client.close();
    }
};

MongoCRUDs.prototype.createLocation = async function (location) {
    const client = new MongoClient(uri);
    try {
        const database = client.db(db_name);
        const locations = database.collection(db_collection_locations);
        const result = await locations.insertOne(location);
        console.log('Inserted location with ID:', result.insertedId); // Logging
        return result.insertedId;
    } finally {
        await client.close();
    }
};

MongoCRUDs.prototype.findAllLocations = async function () {
    const client = new MongoClient(uri);
    try {
        const database = client.db(db_name);
        const locations = database.collection(db_collection_locations);
        const cursor = locations.find({});
        let docs = [];
        for await (const doc of cursor) {
            docs.push(doc);
        }
        return docs;
    } finally {
        await client.close();
    }
};

MongoCRUDs.prototype.findLocationById = async function (id) {
    const client = new MongoClient(uri);
    try {
        const database = client.db(db_name);
        const locations = database.collection(db_collection_locations);
        const query = {_id: new ObjectId(id)};
        const doc = await locations.findOne(query);
        return doc;
    } finally {
        await client.close();
    }
};

MongoCRUDs.prototype.updateLocation = async function (id, updatedLocation) {
    const client = new MongoClient(uri);
    try {
        const database = client.db(db_name);
        const locations = database.collection(db_collection_locations);
        const query = {_id: new ObjectId(id)};
        const update = {$set: updatedLocation};

        const result = await locations.updateOne(query, update);
        console.log('Updated result:', result);
        return result;
    } finally {
        await client.close();
    }
};

MongoCRUDs.prototype.deleteLocation = async function (id) {
    const client = new MongoClient(uri);
    try {
        const database = client.db(db_name);
        const locations = database.collection(db_collection_locations);
        const query = {_id: new ObjectId(id)};
        await locations.deleteOne(query);
    } finally {
        await client.close();
    }
};

const mongoCRUDs = new MongoCRUDs(db_name, uri);
module.exports = mongoCRUDs;