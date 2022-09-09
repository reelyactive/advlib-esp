/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const utils = require('./utils');


const MIN_LENGTH_BYTES = 6;


/**
 * Process a raw RADIO_ERP1 packet.
 * @param {Buffer} data The raw packet.
 * @param {Array} libraries Optional ordered list of processing libraries.
 * @param {Object} options Optional processing options.
 * @return {Object} The processed packet.
 */
function process(data, libraries, options) {
  let buf = utils.convertToBuffer(data);
  if((buf === null) || (buf.length < MIN_LENGTH_BYTES)) {
    return null;
  }
  options = options || {};

  let telegramProperties = {};
  let includeProtocolOverhead = (options.ignoreProtocolOverhead !== true);
  let telegramType = determineType(buf.readUInt8(0));
  let senderIdBuf;

  if(includeProtocolOverhead) {
    telegramProperties.telegramType = telegramType;
  }

  switch(telegramType) {
    case '4BS':
      senderIdBuf = buf.subarray(5, 9);
      break;
    case 'ADT':
      senderIdBuf = buf.subarray(buf.length - 5, buf.length - 1);
      break;
    case 'VLD':
      senderIdBuf = buf.subarray(buf.length - 5, buf.length - 1);
      break;
    case '1BS':
      senderIdBuf = buf.subarray(2, 6);
      telegramProperties.isContactDetected = [
        (buf.readUInt8(1) & 0x01) === 0x01
      ];
      break;
    case 'RPS':
      senderIdBuf = buf.subarray(1, 5); // TODO: confirm!
      break;
  }

  if(senderIdBuf) {
    let transmitterSignature = utils.parseDeviceSignature(senderIdBuf);
    telegramProperties.deviceIds = [ transmitterSignature ];
  }

  return telegramProperties;
}


/**
 * Determine the radio packet type from its R-ORG code.
 * @param {Number} type The type as an integer between 0-255.
 * @return {String} The packet type as a string.
 */
function determineType(type) {
  switch(type) {
    case 0x30:
      return 'SEC';
    case 0x31:
      return 'SEC_ENCAPS';
    case 0x34:
      return 'SEC_MAN';
    case 0xa5:
      return '4BS';
    case 0xa6:
      return 'ADT';
    case 0xa7:
      return 'SM_REQ';
    case 0xc5:
      return 'SYS_EX';
    case 0xc6:
      return 'SM_LRN_REQ';
    case 0xc7:
      return 'SM_LRN_ANS';
    case 0xd0:
      return 'SIGNAL';
    case 0xd1:
      return 'MSC';
    case 0xd2:
      return 'VLD';
    case 0xd4:
      return 'UTE';
    case 0xd5:
      return '1BS';
    case 0xf6:
      return 'RPS';
  }
}


module.exports.process = process;
