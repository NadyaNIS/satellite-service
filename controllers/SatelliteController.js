const Satellite = require("../models/Satellite");
const request = require('request');
const path = require('path');

const locationService = 'http://34.68.190.190';
const defenseService = 'http://35.226.17.192';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const publicKey = fs.readFileSync(path.join(__dirname, '../public.key'));

// --- Add satellite to the constellation
exports.createNewSatellite = (req, res) => {
  const token = req.headers.auth;
  let newSatellite = new Satellite(req.body);

  /**
   * Call location and defense department services,
   *  to see if there is any satellite or anything settled in that location  
  */
  try {
    const decoded = jwt.verify(token, publicKey);
    
    if (decoded.privileges.indexOf('ASSIGN_HERO') >= 0) {
      request.get({
        headers: { 'content-type': 'application/json', 'auth': token },
        url: `${locationService}/location-service/${req.body.settled_location.lat}/${req.body.settled_location.long}`
      },
        (req2, res2) => {
          const starlink_data = JSON.parse(res2.body).data;

          if (starlink_data.length === 0) {
            request.get({
              headers: { 'content-type': 'application/json', 'auth': token },
              url: `${defenseService}/defense-service/${req.body.settled_location.lat}/${req.body.settled_location.long}`
            },
              (req3, res3) => {
                const defense_data = JSON.parse(res3.body).data;

                if (defense_data.length === 0) {
                  newSatellite.save((err, satellite) => {
                    if (err) {
                      res.status(500).send(err);
                    }

                    res.status(201).json({
                      statusCode: 200,
                      statusMessage: '',
                      data: {
                        satellite_name: satellite.satellite_name,
                        settled_location: satellite.settled_location,
                        health: satellite.health,
                        lifespan: (satellite.expiration_date - new Date()) / 1000
                      }
                    });
                  });

                } else {
                  res.status(400).json({
                    statusCode: 400,
                    statusMessage: 'Bad Request',
                    data: []
                  });
                }
              })
          } else {
            res.status(400).json({
              statusCode: 400,
              statusMessage: 'Bad Request',
              data: []
            });
          }
        })
    } else {
      res.status(401).send('Unauthorized.');
    }
  } catch (error) {
    res.status(401).send('Unauthorized.');
  }
};

// --- Get health, of the Satellite
exports.readHealth = (req, res) => {
  const token = req.headers.auth;

  try {
    const decoded = jwt.verify(token, publicKey);
    
    if (decoded.privileges.indexOf('ASSIGN_HERO') >= 0) {
      Satellite.findById(req.params.satelliteid, (err, satellite) => {
        if (err) {
          res.status(500).send(err);
        }

        res.status(200).json({
          statusCode: 200,
          statusMessage: '',
          data: { health: satellite.health, settled_location: satellite.settled_location }
        });
      });
    } else {
      res.status(401).send('Unauthorized.');
    }
  }
  catch (error) {
    res.status(401).send('Unauthorized.');
  }
};

// --- Decomposition from the constellation
exports.decomposeSatellite = (req, res) => {
  const token = req.headers.auth;
  const decoded = jwt.verify(token, publicKey);
  
  if (decoded.privileges.indexOf('ASSIGN_HERO') >= 0) {
    Satellite.findById(req.params.satelliteid)
      .then(satellite => {
        const remaininglifespan = (satellite.expiration_date - new Date()) / 1000;

        if (remaininglifespan <= 0) {
          Satellite.findOneAndUpdate(
            { _id: req.params.satelliteid },
            { deorbit: true, deorbit_date: new Date() },
            (err, updatedsatellite) => {
              if (err) {
                res.status(500).send(err);
              }

              res.status(200).json({
                statusCode: 200,
                statusMessage: '',
                data: {
                  satellite_name: updatedsatellite.satellite_name,
                  deorbit: true,
                  deorbit_date: new Date()
                }
              });
            }
          );
        } else {
          res.status(200).json(satellite);
        }
      })
      .catch(err => {
        res.status(500).send(err);
      })
  } else {
    res.status(401).send('Unauthorized.');
  }
};

// --- Maneuver Satellite
exports.maneuverSatellite = (req, res) => {
  const token = req.headers.auth;
  const decoded = jwt.verify(token, publicKey);
  
  if (decoded.privileges.indexOf('ASSIGN_HERO') >= 0) {
    request.get({
      headers: { 'content-type': 'application/json', 'auth': token },
      url: `${locationService}/${req.body.settled_location.lat}/${req.body.settled_location.long}`
    },
      (req2, res2) => {
        const starlink_data = JSON.parse(res2.body).data;

        if (starlink_data.length === 0) {
          request.get({
            headers: { 'content-type': 'application/json', 'auth': token },
            url: `${defenseService}/${req.body.settled_location.lat}/${req.body.settled_location.long}`
          },
            (req3, res3) => {
              const defense_data = JSON.parse(res3.body).data;

              if (defense_data.length === 0) {
                Satellite.findById(req.params.satelliteid)
                  .then(satellite => {

                    Satellite.update(
                      { _id: req.params.satelliteid },
                      { $set: req.body },
                      (err, updatedsatellite) => {
                        if (err) {
                          res.status(500).send(err);
                        }
                        res.status(200).json(updatedsatellite);
                      }
                    );
                  })
                  .catch(err => {
                    res.status(500).send(err);
                  })
              } else {
                res.status(400).json({
                  statusCode: 400,
                  statusMessage: 'Bad Request',
                  data: []
                });
              }
            });
        } else {
          res.status(400).json({
            statusCode: 400,
            statusMessage: 'Bad Request',
            data: []
          });
        }
      });
  } else {
    res.status(401).send('Unauthorized.');
  }
};

exports.readSatellite = (req, res) => {
  Satellite.findById(req.params.satelliteid, (err, satellite) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(satellite);
  });
};

//List all available tasks from database....
exports.listAllSatellites = (req, res) => {
  Satellite.find({}, (err, satellite) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(satellite);
  });
};

//Update a perticular task by _id ....
exports.updateSatellite = (req, res) => {
  Satellite.findOneAndUpdate(
    { _id: req.params.satelliteid },
    req.body,
    { new: true },
    (err, satellite) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(satellite);
    }
  );
};
// Delete a perticular task by _id .....
exports.deleteSatellite = (req, res) => {
  Satellite.remove({ _id: req.params.satelliteid }, (err, satellite) => {
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Satellite successfully deleted" });
  });
};
