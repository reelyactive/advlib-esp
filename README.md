advlib-esp
==========

Wireless advertising packet decoding library for EnOcean Alliance devices via the EnOcean Serial Protocol (ESP).  __advlib-esp__ can be used standalone or, more commonly, as a processor module of the protocol-agnostic [advlib](https://github.com/reelyactive/advlib) library.

__advlib-esp__ is a lightweight [Node.js package](https://www.npmjs.com/package/advlib-esp) that implements the subset of ESP3 specific to sensor data and radio-identification.


Installation
------------

    npm install advlib-esp


Hello advlib-esp!
-----------------

```javascript
const advlib = require('advlib-esp');

let packet = '55000707017ad5090591ee008001ffffffff47003c';
let processedPacket = advlib.process(packet);

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

For example, to ignore the Enocean Serial Protocol (ESP) overhead:

```javascript
let packet = '55000707017ad5090591ee008001ffffffff47003c';
let options = { ignoreProtocolOverhead: true };
let processedPacket = advlib.process(packet, [], options);
```

Which should yield the following console output:

    { deviceIds: [ "0591ee00/7" ],
      isContactDetected: [ true ],
      uri: "https://sniffypedia.org/Organization/EnOcean_GmbH/" }


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

Copyright (c) 2022 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
