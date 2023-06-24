const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

// Variable
const NASAURL = "https://api.nasa.gov/neo/rest/v1";
const api_key = "EsbeCAjMjHItwyEVIDAsT9YTb516PhLQFalFJ2mf"

let randomNumber=Math.floor(Math.random() * 10);
let id, name, idOther, nameOther, idOtherRandom, nameOtherRandom;


chai.use(chaiHttp);

describe('NASA NEO API Get all data', () => {
    it('Should successfully retrieve NEO data within 5000 ms', function(done) {
        this.timeout(5000);
        chai.request(NASAURL)
          .get('/neo/browse')
          .query({ api_key: api_key })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('near_earth_objects');

            id = res.body.near_earth_objects[0].id;
            name = res.body.near_earth_objects[0].name;

            idOther = res.body.near_earth_objects[1].id;
            nameOther = res.body.near_earth_objects[1].name;            
            
            idOtherRandom = res.body.near_earth_objects[randomNumber].id;
            nameOtherRandom = res.body.near_earth_objects[randomNumber].name;            
    
            done(); // Signal the completion of the test
        });
    });
    
    it('Using Null API key. Should NOT successfully retrieve data', function(done) {
        this.timeout(6000);
        chai.request(NASAURL)
          .get('/neo/browse?api_key=')
          .end((err, res) => {
            expect(res).to.have.status(403);

            done(); // Signal the completion of the test
        });
    });

    it('Using incorrect API key. Should NOT successfully retrieve data', function(done) {
        this.timeout(6000);
        chai.request(NASAURL)
          .get('/neo/browse?api_key=EsbeCAjMjHItwyEVIDAsT9YTb516PhLQFalFJ2m')
          .end((err, res) => {
            expect(res).to.have.status(403);

            done(); // Signal the completion of the test
        });
    });
});


describe('NASA NEO API Get specifict data by ID', () => {
    it('Should successfully retrieve specific NEO data', function(done) {
        this.timeout(5000);
        chai.request(NASAURL)
          .get('/neo/'+id)
          .query({ api_key: api_key })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;

            expect(res.body.name).to.equal(name);
            expect(res.body.id).to.equal(id);
            done(); // Signal the completion of the test
        });
    });

    it('Should successfully retrieve another specific NEO data', function(done) {
        this.timeout(5000);
        chai.request(NASAURL)
          .get('/neo/'+idOther)
          .query({ api_key: api_key })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;

            expect(res.body.name).to.equal(nameOther);
            expect(res.body.id).to.equal(idOther);
            done(); // Signal the completion of the test
        });
    });

    it('Should successfully retrieve random specific NEO data', function(done) {
        this.timeout(5000);
        chai.request(NASAURL)
          .get('/neo/'+idOtherRandom)
          .query({ api_key: api_key })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;

            expect(res.body.name).to.equal(nameOtherRandom);
            expect(res.body.id).to.equal(idOtherRandom);
            done(); // Signal the completion of the test
        });
    });

    it('Using incorrect ID format. Should NOT successfully retrieve data', function(done) {
        this.timeout(5000);
        chai.request(NASAURL)
          .get('/neo/ASDF')
          .query({ api_key: api_key })
          .end((err, res) => {
            expect(res).to.have.status(404);

            done(); // Signal the completion of the test
        });
    });

    it('Using not registered ID. Should NOT successfully retrieve data', function(done) {
        this.timeout(5000);
        chai.request(NASAURL)
          .get('/neo/ASDF')
          .query({ api_key: api_key })
          .end((err, res) => {
            expect(res).to.have.status(404);

            done(); // Signal the completion of the test
        });
    });

    it('Using NULL ID. Should NOT successfully retrieve data', function(done) {
        this.timeout(5000);
        chai.request(NASAURL)
          .get('/neo/NULL')
          .query({ api_key: api_key })
          .end((err, res) => {
            expect(res).to.have.status(404);

            done(); // Signal the completion of the test
        });
    });

    it('Not using ID. Should NOT successfully retrieve data', function(done) {
        this.timeout(5000);
        chai.request(NASAURL)
          .get('/neo')
          .query({ api_key: api_key })
          .end((err, res) => {
            expect(res).to.have.status(405);

            done(); // Signal the completion of the test
        });
    });
});

describe('NASA NEO API Get specifict data by date', () => {
    it('Should successfully retrieve specific NEO data', function(done) {
        this.timeout(15000);
        chai.request(NASAURL)
          .get('/feed')
          .query({ start_date: '2023-12-30', end_date: '2024-01-06', api_key: api_key })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property('near_earth_objects');
            done(); // Signal the completion of the test
        });
    });
    it('Without end date. Should successfully retrieve specific NEO data', function(done) {
        this.timeout(15000);
        chai.request(NASAURL)
          .get('/feed')
          .query({ start_date: '2023-12-30', end_date: null, api_key: api_key })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property('near_earth_objects');
            done(); // Signal the completion of the test
        });
    });
    
    it('Without start date and end date. Should successfully retrieve specific NEO data', function(done) {
        this.timeout(15000);
        chai.request(NASAURL)
          .get('/feed')
          .query({ start_date: null, end_date: null, api_key: api_key })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property('near_earth_objects');
            done(); // Signal the completion of the test
        });
    });

    it('Using invalid date format(DD-MM-YYYY) on start date. Should NOT successfully retrieve specific NEO data', function(done) {
        this.timeout(20000);
        chai.request(NASAURL)
          .get('/feed')
          .query({ start_date: '30-12-2023', end_date: '2024-01-06', api_key: api_key })
          .end((err, res) => {
            expect(res).to.have.status(400);

            done(); // Signal the completion of the test
        });
    });
    it('Using invalid date format(MM-DD-YYYY) on start date.Should NOT successfully retrieve specific NEO data', function(done) {
        this.timeout(12000);
        chai.request(NASAURL)
          .get('/feed')
          .query({ start_date: '12-30-2023', end_date: '2024-01-06', api_key: api_key })
          .end((err, res) => {
            expect(res).to.have.status(400);

            done(); // Signal the completion of the test
        });
    });

    it('Using invalid date format(DD-MM-YYYY) on end date.Should NOT successfully retrieve specific NEO data', function(done) {
        this.timeout(12000);
        chai.request(NASAURL)
          .get('/feed')
          .query({ start_date: '2023-12-01', end_date: '07-12-2024', api_key: api_key })
          .end((err, res) => {
            expect(res).to.have.status(400);

            done(); // Signal the completion of the test
        });
    });
    it('Using invalid date format(MM-DD-YYYY) on end date.Should NOT successfully retrieve specific NEO data', function(done) {
        this.timeout(12000);
        chai.request(NASAURL)
          .get('/feed')
          .query({ start_date: '2023-12-01', end_date: '12-07-2024', api_key: api_key })
          .end((err, res) => {
            expect(res).to.have.status(400);

            done(); // Signal the completion of the test
        });
    });

    
    it('Using invalid date format(YYYY-Bulan-DD) on end date.Should NOT successfully retrieve specific NEO data', function(done) {
        this.timeout(12000);
        chai.request(NASAURL)
          .get('/feed')
          .query({ start_date: '2023-12-30', end_date: '2024-January-06', api_key: api_key })
          .end((err, res) => {
            expect(res).to.have.status(400);

            done(); // Signal the completion of the test
        });
    });
});