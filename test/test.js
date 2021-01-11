const supertest = require("supertest");
const should = require("should");
const chai = require('chai');
const expect = chai.expect;
const helper = require('../utils/helper')
const server = supertest.agent("http://35.184.34.239");

describe("Satellite Service", function () {
  let token = '';
  let decomp_token = '';

  it('makes a call to API2', async () => {
    // request is through Supertest, which makes the http request
    decomp_token = await helper.loginDecomposeEngineer();
    console.log('=============',decomp_token)
  });

  // ===================create new satellite========================
  it("create satellite failing for non permitted user", function (done) {
    // check failing for un authorized - user permissions
    server
      .post('/satellite-service/satellites')
      .set('auth', decomp_token)
      .send({
        "satellite_name": "unit-test",
        "country": "US",
        "released_location": {
          "lat": "1000.0",
          "long": "50"
        },
        "settled_location": {
          "lat": "200.3",
          "long": "200.3"
        },
        "orbit_path": "",
        "released_date": "2020-12-21T08:26:09.446Z",
        "expiration_date": "2120-12-21T08:26:09.446Z",
        "mass": 227
      })
      .expect(403)
      .end(function (err, res) {
        expect(res.status).to.equal(403); 
        done();
      });
  });

  it('makes a call to API', async () => {
    // request is through Supertest, which makes the http request
    token = await helper.loginSuperAdmin();
    
  });

  // check if failing for existing name
  it("create satellite failing for the same name", (done) => {
    // check failing for un authorized - user permissions
    console.log(token)
    server
      .post('/satellite-service/satellites')
      .set('auth', token)
      .send({
        "satellite_name": "Test starlink",
        "country": "US",
        "released_location": {
          "lat": "-50",
          "long": "50"
        },
        "settled_location": {
          "lat": "-50",
          "long": "-50"
        },
        "orbit_path": "",
        "released_date": "2020-12-21T08:26:09.446Z",
        "expiration_date": "2120-12-21T08:26:09.446Z",
        "mass": 227
      })
      .expect(400)
      .end(function (err, res) {
        expect(res.status).to.equal(400); 
        done();
      });
  });

  // =======================read health====================================
  it("read health works fine for existing satellite", (done) => {
    // check failing for un authorized - user permissions
    server
      .get('/satellite-service/health/5feb272b2008eb0edc60f674')
      .set('auth', token)
      .expect(200)
      .end(function (err, res) {
        expect(res.status).to.equal(200); 
        expect(res.body.data).to.have.property('health');
        
        done();
      });
  });

  // ========================decomposite satellite=========================
  // check for auth

  // decomposite a newly created
  it("cannot decompose a satellite which is not going to finish life span", (done) => {
    // check failing for un authorized - user permissions
    server
      .put('/satellite-service/decompose/5ffa7e5f80149bc367fdbdba')
      .set('auth', token)
      .expect(500)
      .end(function (err, res) {
        expect(res.status).to.equal(500);
        
        done();
      });
  });

  // ========================maneuver satellite============================
  // manuever for a existing location return 400
  it("maneuver to existing location", (done) => {
    // check failing for un authorized - user permissions
    server
      .put('/satellite-service/maneuver/5ffa7e5f80149bc367fdbdba')
      .set('auth', token)
      .send({
        "settled_location": { 
          "lat": "200.0",
          "long": "200.0" 
        }
      })
      .expect(400)
      .end(function (err, res) {
        // expect(res.status).to.equal(400);

        done();
      });
  });
});