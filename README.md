advlib-esp
==========

Wireless advertising packet decoding library for EnOcean Alliance devices via the EnOcean Serial Protocol (ESP).  __advlib-esp__ can be used standalone or, more commonly, as a processor module of the protocol-agnostic [advlib](https://github.com/reelyactive/advlib) library.

__advlib-esp__ is a lightweight [Node.js package](https://www.npmjs.com/package/advlib-esp) that implements the subset of ESP3 specific to sensor data and radio-identification, and can be extended with libraries to decode EnOcean Equipment Profiles (EEP).

| Library | Decodes |
|:--------|:--------|
| [advlib-eep-vld](https://github.com/reelyactive/advlib-eep-vld) | Variable-length data (VLD) telegrams |
| [advlib-eep-4bs](https://github.com/reelyactive/advlib-eep-4bs) | 4-byte sensor (4BS) telegrams |
| [advlib-eep-rps](https://github.com/reelyactive/advlib-eep-rps) | Rocker position switch (RPS) telegrams |


Installation
------------

    npm install advlib-esp


Hello advlib-esp!
-----------------

```javascript
const advlib = require('advlib-esp');

const LIBRARIES = [ require('advlib-eep-vld'),
                    require('advlib-eep-4bs'),
                    require('advlib-eep-rps') ];

let packet = '55000707017ad5090591ee008001ffffffff47003c';
let processedPacket = advlib.process(packet, LIBRARIES);

console.log(processedPacket);
```

Which should yield the following console output:

    { type: "RADIO_ERP1",
      dataLength: 7,
      optionalLength: 7,
      telegramType: "1BS",
      deviceIds: [ "0591ee00/7" ],
      isContactDetected: [ true ],
      uri: "https://sniffypedia.org/Organization/EnOcean_GmbH/" }


Options
-------

__advlib-esp__ supports the following options for its process function:

| Property               | Default | Description                         | 
|:-----------------------|:--------|:------------------------------------|
| ignoreProtocolOverhead | false   | Ignore non-sensor & non-identifier properties (type, dataLength, optionalLenth, telegramType, etc.) |
| isERP1PayloadOnly      | false   | Interpret data as an ERP1 payload only (i.e. only the data portion of the RADIO_ERP1 ESP packet) |
| deviceProfiles         | {}      | Map or Object of devices indexed by device signature and containing EEP types to facilitate decoding |

For example, to ignore the Enocean Serial Protocol (ESP) overhead, and to provide only an ERP1 payload, and to specify the profile for the given device (or simply for all devices):

```javascript
let payload = 'd29165c02963e4f5d8000414006980';
let deviceProfiles = { "04140069/7": { eepType: "D2-14-41" } };
let options = {
    ignoreProtocolOverhead: true,
    isERP1PayloadOnly: true,
    deviceProfiles: deviceProfiles
};
let processedPacket = advlib.process(payload, LIBRARIES, options);
```

Which should yield the following console output:

    { deviceIds: [ "04140069/7" ],
      acceleration: [ -0.01, -0.045, 1.02 ],
      illuminance: 331,
      isContactDetected: [ false ],
      isMotionDetected: [ false ],
      relativeHumidity: 75.5,
      temperature: 18.1
      uri: "https://sniffypedia.org/Organization/EnOcean_GmbH/" }

Note that each device signature in the deviceProfiles is a combination of the 32-bit EnOcean Unique Radio Identifier of the device and ["/7" which specifies the EURID-32 type](https://github.com/reelyactive/raddec#identifier-types).


Supported EnOcean Equipment Profiles
------------------------------------

1BS (1-Byte Sensor) EEPs, as listed in the table below, are currently supported directly by __advlib-esp__.  Other telegram types are supported by extension of the libraries described above. 

| EEP      | Profile Name         |
|:---------|:---------------------|
| D5-00-01 | Single Input Contact |


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.

[![Known Vulnerabilities](https://snyk.io/test/github/reelyactive/advlib-esp/badge.svg)](https://snyk.io/test/github/reelyactive/advlib-esp)


License
-------

MIT License

Copyright (c) 2022-2023 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
