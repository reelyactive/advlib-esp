/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const advlib = require('../../lib/advlibesp.js');
const assert = require ('assert');


// Input data for the scenario
const INPUT_DATA_INVALID_HEX_STRING = 'xyz';
const INPUT_DATA_TOO_SHORT_BUFFER = Buffer.from('5500', 'hex');
const INPUT_DATA_RADIO_ERP1 =
                            '55000a0701eba55602460905174f008001ffffffff4100a9';
const INPUT_DATA_OPTIONS_IGNORE_PROTOCOL_OVERHEAD = {
    ignoreProtocolOverhead: true
};


// Expected outputs for the scenario
const EXPECTED_DATA_INVALID_INPUT = null;
const EXPECTED_DATA_RADIO_ERP1 = {
    type: "RADIO_ERP1",
    dataLength: 10,
    optionalLength: 7,
    telegramType: "4BS",
    deviceIds: [ "05174f00/7" ],
    uri: "https://sniffypedia.org/Organization/EnOcean_GmbH/"
};
const EXPECTED_DATA_NO_PROTOCOL_OVERHEAD = {
    deviceIds: [ "05174f00/7" ],
    uri: "https://sniffypedia.org/Organization/EnOcean_GmbH/"
};


// Describe the scenario
describe('advlib-esp', function() {

  // Test the process function with no input data
  it('should handle no input data', function() {
    assert.deepEqual(advlib.process(), EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the process function with an invalid hex string
  it('should handle an invalid hex string as input', function() {
    assert.deepEqual(advlib.process(INPUT_DATA_INVALID_HEX_STRING),
                     EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the process function with a buffer that is too short
  it('should handle a too short buffer as input', function() {
    assert.deepEqual(advlib.process(INPUT_DATA_TOO_SHORT_BUFFER),
                     EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the process function with a RADIO_ERP1 packet
  it('should handle a RADIO_ERP1 packet', function() {
    assert.deepEqual(advlib.process(INPUT_DATA_RADIO_ERP1),
                     EXPECTED_DATA_RADIO_ERP1);
  });

  // Test the process function with no protocol overhead
  it('should handle the ignore protocol overhead option', function() {
    assert.deepEqual(advlib.process(INPUT_DATA_RADIO_ERP1, null,
                                  INPUT_DATA_OPTIONS_IGNORE_PROTOCOL_OVERHEAD),
                     EXPECTED_DATA_NO_PROTOCOL_OVERHEAD);
  });

});
