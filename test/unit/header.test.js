/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const header = require('../../lib/header.js');
const assert = require ('assert');


// Input data for the scenario
const INPUT_DATA_RADIO_ERP1 = '000f0701';


// Expected outputs for the scenario
const EXPECTED_DATA_INVALID_INPUT = null;
const EXPECTED_DATA_RADIO_ERP1 = {
    type: "RADIO_ERP1",
    dataLength: 15,
    optionalLength: 7
};


// Describe the scenario
describe('header', function() {

  // Test the process function with no input data
  it('should handle no input data', function() {
    assert.deepEqual(header.process(), EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the process function with RADIO_ERP1
  it('should handle RADIO_ERP1 header', function() {
    assert.deepEqual(header.process(INPUT_DATA_RADIO_ERP1),
                     EXPECTED_DATA_RADIO_ERP1);
  });

});
