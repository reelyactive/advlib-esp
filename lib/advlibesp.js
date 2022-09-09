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
  if((buf === null) || (buf.length < MIN_PACKET_LENGTH_BYTES) ||
     (buf.readUInt8(0) !== SYNC_BYTE)) {
    return null;
  }
  // TODO: check CRC8H and CRC8D
  options = options || {};

  let headerProperties = header.process(buf.subarray(1, 5));
  let processedPacket = {};
  let dataBuf = buf.subarray(6, 6 + headerProperties.dataLength);
  let includeProtocolOverhead = (options.ignoreProtocolOverhead !== true);

  if(includeProtocolOverhead) {
    Object.assign(processedPacket, headerProperties);
  }

  // Process the packet based on its type
  switch(headerProperties.type) {
    case 'RADIO_ERP1':
      let telegramProperties = radioERP1.process(dataBuf, 0, libraries,
                                                 options);
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
