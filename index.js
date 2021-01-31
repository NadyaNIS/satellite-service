const app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');
const satelliteController = require("./controllers/SatelliteController");
require("./config/db");

const { PORT = 8000 } = process.env;


app.get('/', function (req, res) {
  res.send('Satellite Service version 1.2')
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app
  .route("/satellite-service/satellites")
  .get(satelliteController.listAllSatellites)
  .post(satelliteController.createNewSatellite);

app.route("/satellite-service/health/:satelliteid").get(satelliteController.readHealth)
app.route("/satellite-service/decompose/:satelliteid").put(satelliteController.decomposeSatellite)
app.route("/satellite-service/maneuver/:satelliteid").put(satelliteController.maneuverSatellite)

app
  .route("/satellite-service/satellites/:satelliteid")
  .get(satelliteController.readSatellite)
  .put(satelliteController.updateSatellite)
  .delete(satelliteController.deleteSatellite);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
