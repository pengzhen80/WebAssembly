'use strict';
const { Serial, SerialPort, registerGlobals } = require('webserial');

registerGlobals(globalThis);
console.log(globalThis.navigator.serial);
console.log(globalThis.navigator.serial instanceof Serial);