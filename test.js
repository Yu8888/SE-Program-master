const assert = require('chai').assert;
const server = require('./server.js');

describe('server', function() {
    it('should return hello', function() {
        assert.equal(server(), 'hello');
    });
});