const supertest = require("supertest");
const should = require("should");
const chai = require('chai');
const expect = chai.expect;
const server = supertest.agent("http://35.184.34.239");

describe("Satellite Service", function () {
  // ===================create new satellite========================
  // it("create satellite failing for non permitted user", function (done) {
  //   // check failing for un authorized - user permissions
  //   server
  //     .post('/satellite-service/satellites')
  //     .set('auth', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAyNTI0NzYsInByaXZpbGVnZXMiOlsiQVNTSUdOX0hFUk8iXSwiaWF0IjoxNjEwMjQ4ODc2fQ.UcmnhXw33OJo9YJMeQx9jPVlw3KfajZHJfeWPFKTci5PXFzCMyRG4dBNJND59YHKzBoSsYaPm3r5YkXKINfHpd8twJQwHMVuPWlGRhGRRpQnwRFtV8xbg7kwjDLX0hcr6ROUw2m5Wg9WUpgVsKlKg1CQ8mVNrroa_1c6hoXvmWn0oDBQkTJMiWFAxaOu_weX7xgS9ovpS_WB6fW-lHdYPWMOam-r3Fq5kYop7rjEJesC_rS78u1YgWmXKZOY4usqK2nZLUd84UJ5jyoiXJY1QSMgpsSNY620jVWoyc8mXxrtAsbHrVsp0ET5eilpEpU0aaV5voVXyS1Xrypgp7ReVA')
  //     .send({
  //       "satellite_name": "unit-test",
  //       "country": "US",
  //       "released_location": {
  //         "lat": "1000.0",
  //         "long": "50"
  //       },
  //       "settled_location": {
  //         "lat": "200.3",
  //         "long": "200.3"
  //       },
  //       "orbit_path": "",
  //       "released_date": "2020-12-21T08:26:09.446Z",
  //       "expiration_date": "2120-12-21T08:26:09.446Z",
  //       "mass": 227
  //     })
  //     .expect(403)
  //     .end(function (err, res) {
  //       expect(res.status).to.equal(403); 
  //       done();
  //     });
  // });

  // check if failing for existing name
  it("create satellite failing for the same name", function (done) {
    // check failing for un authorized - user permissions
    server
      .post('/satellite-service/satellites')
      .set('auth', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAyNjIzOTQsInByaXZpbGVnZXMiOlsiQVNTSUdOX0hFUk8iXSwiaWF0IjoxNjEwMjU4Nzk0fQ.fgpGy1YR6MUc82r9zVFb2qNf8bFZ1o0XL5Ms5kJxOXSvanbvTRdTUp0JlBs9mf9G6CwMmvivb8rUWFpp4GISVnkjbSeb-rBGVAdlWoNA-y1BKg0c7CynCyUJLJgokjFi54fzYXROJLw6bje0nUi0nLJZXgZtsJ2ypiVinixbnB2ASjpksEXKB2iPjaqaBMHc1NJ9oPJYyiGUjJ85ZGb1dJ98hyhIg60sApOke4iVkB6kDCPWs0RyMnfYX8R2etZIh7NyO52nLigl8Lz-jbQWTIxjT_lKUO_TfNpWpjuqWd4Dt-_fQTNoYIYVvO3aYD2BrEmxVyndVDHOqQf_jz74Dg')
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
      .set('auth', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAyNjIzOTQsInByaXZpbGVnZXMiOlsiQVNTSUdOX0hFUk8iXSwiaWF0IjoxNjEwMjU4Nzk0fQ.fgpGy1YR6MUc82r9zVFb2qNf8bFZ1o0XL5Ms5kJxOXSvanbvTRdTUp0JlBs9mf9G6CwMmvivb8rUWFpp4GISVnkjbSeb-rBGVAdlWoNA-y1BKg0c7CynCyUJLJgokjFi54fzYXROJLw6bje0nUi0nLJZXgZtsJ2ypiVinixbnB2ASjpksEXKB2iPjaqaBMHc1NJ9oPJYyiGUjJ85ZGb1dJ98hyhIg60sApOke4iVkB6kDCPWs0RyMnfYX8R2etZIh7NyO52nLigl8Lz-jbQWTIxjT_lKUO_TfNpWpjuqWd4Dt-_fQTNoYIYVvO3aYD2BrEmxVyndVDHOqQf_jz74Dg')
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
  // it("cannot decompose a satellite which is not going to finish life span", function (done) {
  //   // check failing for un authorized - user permissions
  //   server
  //     .put('/satellite-service/decompose/5ffa7e5f80149bc367fdbdba')
  //     .set('auth', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAyNTI0NzYsInByaXZpbGVnZXMiOlsiQVNTSUdOX0hFUk8iXSwiaWF0IjoxNjEwMjQ4ODc2fQ.UcmnhXw33OJo9YJMeQx9jPVlw3KfajZHJfeWPFKTci5PXFzCMyRG4dBNJND59YHKzBoSsYaPm3r5YkXKINfHpd8twJQwHMVuPWlGRhGRRpQnwRFtV8xbg7kwjDLX0hcr6ROUw2m5Wg9WUpgVsKlKg1CQ8mVNrroa_1c6hoXvmWn0oDBQkTJMiWFAxaOu_weX7xgS9ovpS_WB6fW-lHdYPWMOam-r3Fq5kYop7rjEJesC_rS78u1YgWmXKZOY4usqK2nZLUd84UJ5jyoiXJY1QSMgpsSNY620jVWoyc8mXxrtAsbHrVsp0ET5eilpEpU0aaV5voVXyS1Xrypgp7ReVA')
  //     .expect(200)
  //     .end(function (err, res) {
  //       res.status.should.equal(200);
  //       done();
  //     });
  // });

  // ========================maneuver satellite============================
  // manuever for a existing location return 400
  // it("maneuver to existing location", function (done) {
  //   // check failing for un authorized - user permissions
  //   server
  //     .put('/satellite-service/maneuver/5ffa7e5f80149bc367fdbdba')
  //     .set('auth', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTAyNTI0NzYsInByaXZpbGVnZXMiOlsiQVNTSUdOX0hFUk8iXSwiaWF0IjoxNjEwMjQ4ODc2fQ.UcmnhXw33OJo9YJMeQx9jPVlw3KfajZHJfeWPFKTci5PXFzCMyRG4dBNJND59YHKzBoSsYaPm3r5YkXKINfHpd8twJQwHMVuPWlGRhGRRpQnwRFtV8xbg7kwjDLX0hcr6ROUw2m5Wg9WUpgVsKlKg1CQ8mVNrroa_1c6hoXvmWn0oDBQkTJMiWFAxaOu_weX7xgS9ovpS_WB6fW-lHdYPWMOam-r3Fq5kYop7rjEJesC_rS78u1YgWmXKZOY4usqK2nZLUd84UJ5jyoiXJY1QSMgpsSNY620jVWoyc8mXxrtAsbHrVsp0ET5eilpEpU0aaV5voVXyS1Xrypgp7ReVA')
  //     .send({
  //       "settled_location": { 
  //         "lat": "150.98",
  //         "long": "-150.65" 
  //       }
  //     })
  //     .expect(400)
  //     .end(function (err, res) {
  //       res.status.should.equal(400);
  //       done();
  //     });
  // });
});