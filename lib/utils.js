/**
 * Copyright reelyActive 2015-2022
 * We believe in an open Internet of Things
 */


const IDENTIFIER_TYPE_EURID_32 = 7;
const SIGNATURE_SEPARATOR = '/';


/**
 * Convert the given hexadecimal string or Buffer to a Buffer.
 * @param {Object} data A hexadecimal-string or Buffer.
 * @return {Object} The data as a Buffer, or null if invalid data format.
 */
function convertToBuffer(data) {
  if(Buffer.isBuffer(data)) {
    return data;
  }

  if(typeof data === 'string') {
    data = data.toLowerCase();
    let isHex = /[0-9a-f]+/.test(data);
    if(isHex) {
      return Buffer.from(data, 'hex');
    }
  }

  return null;
}


/**
 * Parse a raw device identifier and return its signature.
 * @param {Buffer} data The raw identifier.
 * @return {String} The parsed signature as a hexadecimal string.
 */
function parseDeviceSignature(data) {
  let buf = convertToBuffer(data);
  if(buf === null) {
    return null;
  }

  return convertToHexString(buf.readUInt32BE(0, 4), 4) + SIGNATURE_SEPARATOR +
         IDENTIFIER_TYPE_EURID_32;
}


/**
 * Convert the given data to a hexadecimal string of the given number of bytes.
 * @param {Object} data The data to convert (Number, String or Buffer).
 * @param {Number} length The target length of the string in bytes.
 * @param {boolean} reverseEndianness Optionally reverse the endianness.
 * @return {String} The data as a hexadecimal string.
 */
function convertToHexString(data, length, reverseEndianness) {
  let hexString = null;

  if(Number.isInteger(data) && (data >= 0)) {
    hexString = data.toString(16).padStart(length * 2, '0');
  }
  if(Buffer.isBuffer(data)) {
    hexString = data.toString('hex').padStart(length * 2, '0');
  }
  if(typeof data === 'string') {
    hexString = data.padStart(length * 2, '0');
  }

  if(hexString && (reverseEndianness === true)) {
    return hexString.match(/.{2}/g).reverse().join('');
  }

  return hexString;
}


/**
 * Determine if the given object has a function of the given name.
 * @param {Object} object The given object.
 * @param {String} functionName The function name for which to check.
 * @return {boolean} True if the function exists, false otherwise.
 */
function hasFunction(object, functionName) {
  if(object && object.hasOwnProperty(functionName) &&
     (typeof object[functionName] === 'function')) {
    return true;
  }

  return false;
}


/**
 * Look up a URI associated with the given id from the given indices.
 * @param {String} id The identifier as a hexadecimal string.
 * @param {Array} indices The array of indices.
 * @param {Object} options The lookup options, if any.
 * @return {String} URI if found, null otherwise.
 */
function lookupIndices(id, indices, options) {
  let hasIndices = (Array.isArray(indices) && (indices.length > 0));

  if(hasIndices) {
    for(let cIndex = 0; cIndex < indices.length; cIndex++) {
      let index = indices[cIndex];

      if(hasFunction(index, 'lookup')) {
        let uri = index.lookup(id, options);

        if(uri) {
          return uri;
        }
      }
    }
  }

  return null;
}


module.exports.convertToBuffer = convertToBuffer;
module.exports.parseDeviceSignature = parseDeviceSignature;
module.exports.convertToHexString = convertToHexString;
module.exports.hasFunction = hasFunction;
module.exports.lookupIndices = lookupIndices;
