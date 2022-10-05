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
  let profileProperties = {};
  let includeProtocolOverhead = (options.ignoreProtocolOverhead !== true);
  let telegramType = determineType(buf.readUInt8(0));
  let senderIdBuf;

  if(includeProtocolOverhead) {
    telegramProperties.telegramType = telegramType;
  }

  switch(telegramType) {
    case '4BS':
      senderIdBuf = buf.subarray(5, 9);
      profileProperties = process4BSTelegram(buf, libraries, options);
      break;
    case 'ADT':
      senderIdBuf = buf.subarray(buf.length - 5, buf.length - 1);
      break;
    case 'VLD':
      senderIdBuf = buf.subarray(buf.length - 5, buf.length - 1);
      profileProperties = processVLDTelegram(buf, libraries, options);
      break;
    case 'UTE':
      senderIdBuf = buf.subarray(buf.length - 5, buf.length - 1);
      profileProperties = processUTETelegram(buf, libraries, options);
      break;
    case '1BS':
      senderIdBuf = buf.subarray(2, 6);
      profileProperties = process1BSTelegram(buf, libraries, options);
      break;
    case 'RPS':
      senderIdBuf = buf.subarray(2, 6);
      profileProperties = processRPSTelegram(buf, libraries, options);
      break;
  }

  if(senderIdBuf) {
    let transmitterSignature = utils.parseDeviceSignature(senderIdBuf);
    telegramProperties.deviceIds = [ transmitterSignature ];
  }

  return Object.assign(telegramProperties, profileProperties);
}


/**
 * Process a 4-byte sensor (4BS) telegram.
 * @param {Buffer} data The raw telegram.
 * @param {Array} libraries Optional ordered list of processing libraries.
 * @param {Object} options Optional processing options.
 * @return {Object} The data type properties.
 */
function process4BSTelegram(data, libraries, options) {
  let hasLibraries = (Array.isArray(libraries) && (libraries.length > 0));

  if(hasLibraries) {
    for(let cLibrary = 0; cLibrary < libraries.length; cLibrary++) {
      let library = libraries[cLibrary];
      if(utils.hasFunction(library, 'process4BSTelegram')) {
        let profileProperties = library.process4BSTelegram(null, data);
        if(profileProperties !== null) {
          return profileProperties;
        }
      }
    }
  }

  let payload = data.subarray(1, 5).toString('hex');

  return { telegramPayload: payload };
}


/**
 * Process a variable-length data (VLD) telegram.
 * @param {Buffer} data The raw telegram.
 * @param {Array} libraries Optional ordered list of processing libraries.
 * @param {Object} options Optional processing options.
 * @return {Object} The data type properties.
 */
function processVLDTelegram(data, libraries, options) {
  let hasLibraries = (Array.isArray(libraries) && (libraries.length > 0));

  if(hasLibraries) {
    for(let cLibrary = 0; cLibrary < libraries.length; cLibrary++) {
      let library = libraries[cLibrary];
      if(utils.hasFunction(library, 'processVLDTelegram')) {
        let profileProperties = library.processVLDTelegram(null, data);
        if(profileProperties !== null) {
          return profileProperties;
        }
      }
    }
  }

  let payload = data.subarray(1, data.length - 5).toString('hex');

  return { telegramPayload: payload };
}


/**
 * Process a universal teach-in (UTE) telegram.
 * @param {Buffer} data The raw telegram.
 * @param {Array} libraries Optional ordered list of processing libraries.
 * @param {Object} options Optional processing options.
 * @return {Object} The data type properties.
 */
function processUTETelegram(data, libraries, options) {
  let eepType = (data.toString('hex', 7, 8) + '-' +
                 data.toString('hex', 6, 7) + '-' +
                 data.toString('hex', 5, 6)).toUpperCase();
  let payload = data.subarray(1, 8).toString('hex');

  return { eepType: eepType, telegramPayload: payload };
}


/**
 * Process a 1-byte sensor (1BS) telegram.
 * @param {Buffer} data The raw telegram.
 * @param {Array} libraries Optional ordered list of processing libraries.
 * @param {Object} options Optional processing options.
 * @return {Object} The data type properties.
 */
function process1BSTelegram(data, libraries, options) {
  let isContactDetected = [ (data.readUInt8(1) & 0x01) === 0x01 ];

  return { isContactDetected: isContactDetected };
}


/**
 * Process a rocker position switch (RPS) telegram.
 * @param {Buffer} data The raw telegram.
 * @param {Array} libraries Optional ordered list of processing libraries.
 * @param {Object} options Optional processing options.
 * @return {Object} The data type properties.
 */
function processRPSTelegram(data, libraries, options) {
  let hasLibraries = (Array.isArray(libraries) && (libraries.length > 0));

  if(hasLibraries) {
    for(let cLibrary = 0; cLibrary < libraries.length; cLibrary++) {
      let library = libraries[cLibrary];
      if(utils.hasFunction(library, 'processRPSTelegram')) {
        let profileProperties = library.processRPSTelegram(null, data);
        if(profileProperties !== null) {
          return profileProperties;
        }
      }
    }
  }

  let payload = data.subarray(1, 2).toString('hex');

  return { telegramPayload: payload };
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
