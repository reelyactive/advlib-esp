/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const header = require('./header');
const radioERP1 = require('./radioerp1');
const utils = require('./utils');


const MIN_PACKET_LENGTH_BYTES = 6;
const SYNC_BYTE = 0x55;


/**
 * Process a raw EnOcean Serial Protocol packet into semantically meaningful
 * information.
 * @param {Object} data The raw ESP packet as a hexadecimal-string or Buffer.
 * @param {Array} libraries Optional ordered list of processing libraries.
 * @param {Object} options Optional processing options.
 * @return {Object} The processed packet as JSON.
 */
function process(data, libraries, options) {
  let buf = utils.convertToBuffer(data);
  if((buf === null) || (buf.length < MIN_PACKET_LENGTH_BYTES)) {
    return null;
  }
  options = options || {};

  let processedPacket = {};
  let isERP1PayloadOnly = (options.isERP1PayloadOnly === true);

  if(isERP1PayloadOnly) {
    let processedPacket = radioERP1.process(data, libraries, options);

    if(!processedPacket.hasOwnProperty('uri')) {
      processedPacket.uri = 'https://sniffypedia.org/Organization/EnOcean_GmbH/';
    }

    return processedPacket;
  }

  // TODO: check CRC8H and CRC8D
  if(buf.readUInt8(0) !== SYNC_BYTE) {
    return null;
  }

  let headerProperties = header.process(buf.subarray(1, 5));
  let dataBuf = buf.subarray(6, 6 + headerProperties.dataLength);
  let includeProtocolOverhead = (options.ignoreProtocolOverhead !== true);

  if(includeProtocolOverhead) {
    Object.assign(processedPacket, headerProperties);
  }

  // Process the packet based on its type
  switch(headerProperties.type) {
    case 'RADIO_ERP1':
      let telegramProperties = radioERP1.process(dataBuf, libraries, options);
      Object.assign(processedPacket, telegramProperties);
      break;
  }

  if(!processedPacket.hasOwnProperty('uri')) {
    processedPacket.uri = 'https://sniffypedia.org/Organization/EnOcean_GmbH/';
  }

  return processedPacket;
}


module.exports.process = process;
module.exports.header = header;
