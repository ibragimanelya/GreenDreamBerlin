const express = require('express');
const router = express.Router();
const mongoCRUDs = require('../db/mongoCRUDs');

router.post('/', async function (req, res) {
    try {
        let newLocation = req.body;
        console.log('Creating new location:', newLocation); // Logging

        let locationId = await mongoCRUDs.createLocation(newLocation);
        res.status(201).location(`/loc/${locationId}`).send();
    } catch (err) {
        console.error('error creating location:', err);
        res.status(400).send(`Error creating location`);
    }
});

router.get('/', async function (req, res) {
    try {
        let locations = await mongoCRUDs.findAllLocations();
        res.status(200).json(locations);
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error fetching locations`);
    }
});

router.get('/:id', async function (req, res) {
    try {
        let location = await mongoCRUDs.findLocationById(req.params.id);
        if (location) {
            res.status(200).json(location);
        } else {
            res.status(404).send(`Location not found!`);
        }
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error fetching location`);
    }
});

router.put('/:id', async function (req, res) {
    try {
        let updatedLocation = req.body;
        console.log('Updating location with ID:', req.params.id); // Add logging
        console.log('Updated data:', updatedLocation); // Add logging

        const result = await mongoCRUDs.updateLocation(req.params.id, updatedLocation);
        if (result.modifiedCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).send('Location not found');
        }
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error updating location`);
    }
});

router.delete('/:id', async function (req, res) {
    try {
        await mongoCRUDs.deleteLocation(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error deleting location`);
    }
});

module.exports = router;