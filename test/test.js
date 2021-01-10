const supertest = require("supertest");
const should = require("should");
const chai = require('chai');
const expect = chai.expect;
const server = supertest.agent("http://35.184.34.239/");

describe("Satellite Service", function () {
  // ===================create new satellite========================
  it("create satellite failing for non permitted user", function (done) {
    // check failing for un authorized - user permissions
    server
      .post('/satellite-service/satellites')
      .set('auth', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAyNjU0ODksInByaXZpbGVnZXMiOlsiQUNDRVNTX0RFRkVOU0UiLCJBQ0NFU1NfU1RBUkxJTktBX0xPQ0FUSU9OIiwiTUFORVVWRVJfU0FURUxMSVRFIl0sImlhdCI6MTYxMDI2MTg4OX0.rbWmsT4pH4w-DZdx1JLAjVrmiJgriuQExIuatGWPxshKDG8C3e8_26ICJUWJou5dYXsMgqXnjfifcuBNcp-sBVVRE_-B2swJpEvodBCGZAmO1-pqCQMQzT2bMJvdYgQrCNkVSDy00g8Lp-myBuQUWUpTqZq4eocPCbloJ2vs2tqKmj3qagL99uJPzVBpUqNhFqia04Zf4HLdhItQRYu8JxwJsMO6oGSJcvQHVyG6KwWUG5xDFPOTgUhd5aT6oLbJ7djKqGac7CZquIBxCaN2yhvZmTBiMlBl2MwDl-u3vk5Wps-n0CA4WAFzue1zCmT7QuXs19vqBVe-KKk1YsvSkg')
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

  // check if failing for existing name
  it("create satellite failing for the same name", function (done) {
    // check failing for un authorized - user permissions
    server
      .post('/satellite-service/satellites')
      .set('auth', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAyNjU2NzEsInByaXZpbGVnZXMiOlsiQUNDRVNTX0RFRkVOU0UiLCJSRUFEX0FOWSIsIkFDQ0VTU19TVEFSTElOS0FfTE9DQVRJT04iLCJBRERfVE9fQ09OU1RFTExBVElPTiIsIkRFQ09NUE9TRV9TQVRFTExJVEUiLCJNQU5FVVZFUl9TQVRFTExJVEUiXSwiaWF0IjoxNjEwMjYyMDcxfQ.aGyMrs2g31HcK06-poY3PuePw_bGXqaUyRvgyzgu0Iiyvp4J65nqePBwUqPBni8qL1hpxiplv8xLzQC-4GpBQIJj1U0sBL_TT59xvj-YbCqYlfCWB5XOVqlWN-0M6coB1N7AyY3naSsOvbN_D2Ia21YFJ7oPw2c_VUfUPaM-Lxg_JoLRyT_SEXpH1T1SBWpjRJU8Q0silqrBCh_0PI3GdpcX_DaZpuzI-5dK7o1k2I-NQzGvWYmySfhW6SCznCtohsNZNiAHKVWLV5v_je4iqWOYSzxMsTM2OkIT_rc7CCtaNmG6XLXr5v9dViD00gy-2Hf6geu9HH4U6tNAmloK2w')
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
  it("read health works fine for existing satellite", function (done) {
    // check failing for un authorized - user permissions
    server
      .get('/satellite-service/health/5feb272b2008eb0edc60f674')
      .set('auth', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAyNjU2NzEsInByaXZpbGVnZXMiOlsiQUNDRVNTX0RFRkVOU0UiLCJSRUFEX0FOWSIsIkFDQ0VTU19TVEFSTElOS0FfTE9DQVRJT04iLCJBRERfVE9fQ09OU1RFTExBVElPTiIsIkRFQ09NUE9TRV9TQVRFTExJVEUiLCJNQU5FVVZFUl9TQVRFTExJVEUiXSwiaWF0IjoxNjEwMjYyMDcxfQ.aGyMrs2g31HcK06-poY3PuePw_bGXqaUyRvgyzgu0Iiyvp4J65nqePBwUqPBni8qL1hpxiplv8xLzQC-4GpBQIJj1U0sBL_TT59xvj-YbCqYlfCWB5XOVqlWN-0M6coB1N7AyY3naSsOvbN_D2Ia21YFJ7oPw2c_VUfUPaM-Lxg_JoLRyT_SEXpH1T1SBWpjRJU8Q0silqrBCh_0PI3GdpcX_DaZpuzI-5dK7o1k2I-NQzGvWYmySfhW6SCznCtohsNZNiAHKVWLV5v_je4iqWOYSzxMsTM2OkIT_rc7CCtaNmG6XLXr5v9dViD00gy-2Hf6geu9HH4U6tNAmloK2w')
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
  it("cannot decompose a satellite which is not going to finish life span", function (done) {
    // check failing for un authorized - user permissions
    server
      .put('/satellite-service/decompose/5ffa7e5f80149bc367fdbdba')
      .set('auth', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAyNjU2NzEsInByaXZpbGVnZXMiOlsiQUNDRVNTX0RFRkVOU0UiLCJSRUFEX0FOWSIsIkFDQ0VTU19TVEFSTElOS0FfTE9DQVRJT04iLCJBRERfVE9fQ09OU1RFTExBVElPTiIsIkRFQ09NUE9TRV9TQVRFTExJVEUiLCJNQU5FVVZFUl9TQVRFTExJVEUiXSwiaWF0IjoxNjEwMjYyMDcxfQ.aGyMrs2g31HcK06-poY3PuePw_bGXqaUyRvgyzgu0Iiyvp4J65nqePBwUqPBni8qL1hpxiplv8xLzQC-4GpBQIJj1U0sBL_TT59xvj-YbCqYlfCWB5XOVqlWN-0M6coB1N7AyY3naSsOvbN_D2Ia21YFJ7oPw2c_VUfUPaM-Lxg_JoLRyT_SEXpH1T1SBWpjRJU8Q0silqrBCh_0PI3GdpcX_DaZpuzI-5dK7o1k2I-NQzGvWYmySfhW6SCznCtohsNZNiAHKVWLV5v_je4iqWOYSzxMsTM2OkIT_rc7CCtaNmG6XLXr5v9dViD00gy-2Hf6geu9HH4U6tNAmloK2w')
      .expect(500)
      .end(function (err, res) {
        expect(res.status).to.equal(500);
        
        done();
      });
  });

  // ========================maneuver satellite============================
  // manuever for a existing location return 400
  it("maneuver to existing location", function (done) {
    // check failing for un authorized - user permissions
    server
      .put('/satellite-service/maneuver/5ffa7e5f80149bc367fdbdba')
      .set('auth', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAyNjU2NzEsInByaXZpbGVnZXMiOlsiQUNDRVNTX0RFRkVOU0UiLCJSRUFEX0FOWSIsIkFDQ0VTU19TVEFSTElOS0FfTE9DQVRJT04iLCJBRERfVE9fQ09OU1RFTExBVElPTiIsIkRFQ09NUE9TRV9TQVRFTExJVEUiLCJNQU5FVVZFUl9TQVRFTExJVEUiXSwiaWF0IjoxNjEwMjYyMDcxfQ.aGyMrs2g31HcK06-poY3PuePw_bGXqaUyRvgyzgu0Iiyvp4J65nqePBwUqPBni8qL1hpxiplv8xLzQC-4GpBQIJj1U0sBL_TT59xvj-YbCqYlfCWB5XOVqlWN-0M6coB1N7AyY3naSsOvbN_D2Ia21YFJ7oPw2c_VUfUPaM-Lxg_JoLRyT_SEXpH1T1SBWpjRJU8Q0silqrBCh_0PI3GdpcX_DaZpuzI-5dK7o1k2I-NQzGvWYmySfhW6SCznCtohsNZNiAHKVWLV5v_je4iqWOYSzxMsTM2OkIT_rc7CCtaNmG6XLXr5v9dViD00gy-2Hf6geu9HH4U6tNAmloK2w')
      .send({
        "settled_location": { 
          "lat": "200.0",
          "long": "200.0" 
        }
      })
      .expect(400)
      .end(function (err, res) {
        expect(res.status).to.equal(400);

        done();
      });
  });
});