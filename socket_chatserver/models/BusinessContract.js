'use strict';

var Store = require('./protocol/Store');

class BusinessContract extends Store {

  constructor() {
    super();
  }

}

module.exports = new BusinessContract();
