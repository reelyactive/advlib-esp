/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const utils = require('./utils');


/**
 * Process a raw ESP3 packet header.
 * @param {Buffer} data The header.
 * @return {Object} The processed header.
 */
function process(data) {
  let buf = utils.convertToBuffer(data);
  if(buf === null) {
    return null;
  }

  let dataLength = buf.readUInt16BE();
  let optionalLength = buf.readUInt8(2);
  let type = determineType(buf.readUInt8(3));

  return { type: type, dataLength: dataLength, optionalLength: optionalLength };
}


/**
 * Determine the packet type from its type code.
 * @param {Number} type The type as an integer between 0-255.
 * @return {String} The packet type as a string.
 */
function determineType(type) {
  if(type >= 0x80) {
    return 'MANUFACTURER_SPECIFIC_COMMUNICATION';
  }
  switch(type) {
    case 0x01:
      return 'RADIO_ERP1';
    case 0x02:
      return 'RESPONSE';
    case 0x03:
      return 'RADIO_SUB_TEL';
    case 0x04:
      return 'EVENT';
    case 0x05:
      return 'COMMON_COMMAND';
    case 0x06:
      return 'SMART_ACK_COMMAND';
    case 0x07:
      return 'REMOTE_MAN_COMMAND';
    case 0x09:
      return 'RADIO_MESSAGE';
    case 0x0a:
      return 'RADIO_ERP2';
    case 0x0b:
      return 'CONFIG_COMMAND';
    case 0x0c:
      return 'COMMAND_ACCEPTED';
    case 0x10:
      return 'RADIO_802_15_4';
    case 0x11:
      return 'COMMAND_2_4';
    default:
      return 'RFU';
  }
}


module.exports.process = process;
