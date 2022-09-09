/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const advlib = require('../../lib/advlibesp.js');
const assert = require ('assert');


// Input data for the scenario
const INPUT_DATA_INVALID_HEX_STRING = 'xyz';
const INPUT_DATA_TOO_SHORT_BUFFER = Buffer.from('5500', 'hex');
const INPUT_DATA_4BS = '55000a0701eba55602460905174f008001ffffffff4100a9';
const INPUT_DATA_1BS = '55000707017ad5090591ee008001ffffffff47003c';
const INPUT_DATA_VLD =
                   '55000f07012bd29fde40012be0f4d820041415008001ffffffff340087';
const INPUT_DATA_RPS = '55000707017af600002e001fa001ffffffff44008a';
const INPUT_DATA_OPTIONS_IGNORE_PROTOCOL_OVERHEAD = {
    ignoreProtocolOverhead: true
};


// Expected outputs for the scenario
const EXPECTED_DATA_INVALID_INPUT = null;
const EXPECTED_DATA_4BS = {
    type: "RADIO_ERP1",
    dataLength: 10,
    optionalLength: 7,
    telegramType: "4BS",
    deviceIds: [ "05174f00/7" ],
    uri: "https://sniffypedia.org/Organization/EnOcean_GmbH/"
};
const EXPECTED_DATA_1BS = {
    type: "RADIO_ERP1",
    dataLength: 7,
    optionalLength: 7,
    telegramType: "1BS",
    deviceIds: [ "0591ee00/7" ],
    uri: "https://sniffypedia.org/Organization/EnOcean_GmbH/"
};
const EXPECTED_DATA_VLD = {
    type: "RADIO_ERP1",
    dataLength: 15,
    optionalLength: 7,
    telegramType: "VLD",
    deviceIds: [ "04141500/7" ],
    uri: "https://sniffypedia.org/Organization/EnOcean_GmbH/"
};
const EXPECTED_DATA_RPS = {
    type: "RADIO_ERP1",
    dataLength: 7,
    optionalLength: 7,
    telegramType: "RPS",
    deviceIds: [ "00002e00/7" ],
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

  // Test the process function with a 4BS RADIO_ERP1 packet
  it('should handle a 4BS RADIO_ERP1 packet', function() {
    assert.deepEqual(advlib.process(INPUT_DATA_4BS), EXPECTED_DATA_4BS);
  });

  // Test the process function with a 1BS RADIO_ERP1 packet
  it('should handle a 1BS RADIO_ERP1 packet', function() {
    assert.deepEqual(advlib.process(INPUT_DATA_1BS), EXPECTED_DATA_1BS);
  });

  // Test the process function with a VLD RADIO_ERP1 packet
  it('should handle a VLD RADIO_ERP1 packet', function() {
    assert.deepEqual(advlib.process(INPUT_DATA_VLD), EXPECTED_DATA_VLD);
  });

  // Test the process function with a RPS RADIO_ERP1 packet
  it('should handle a RPS RADIO_ERP1 packet', function() {
    assert.deepEqual(advlib.process(INPUT_DATA_RPS), EXPECTED_DATA_RPS);
  });

  // Test the process function with no protocol overhead
  it('should handle the ignore protocol overhead option', function() {
    assert.deepEqual(advlib.process(INPUT_DATA_4BS, null,
                                  INPUT_DATA_OPTIONS_IGNORE_PROTOCOL_OVERHEAD),
                     EXPECTED_DATA_NO_PROTOCOL_OVERHEAD);
  });

});
