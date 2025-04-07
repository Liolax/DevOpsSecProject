const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Assuming server.js exports the Express app
const { expect } = chai;

chai.use(chaiHttp);

describe('GET /health', () => {
  it('should return API health status as OK', (done) => {
    chai.request(app)
      .get('/health')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status').that.equals('OK');
        done();
      });
  });
});
