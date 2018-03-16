const assert = require('chai').assert;
const LinkedList = require('./index');

describe('LinkedList', () => {
  it('should initially be empty', () => {
    const list = new LinkedList();
    assert.equal(list.size(), 0);
  });
});