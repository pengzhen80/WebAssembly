const { SerialPort,ReadlineParser} = require('serialport');

const TEST_CONNECTION = "TLSK000";
const READ_RING_ID_8 = "TLSK606,8";

function checksum(st) {
  let i = 0;
  let checksum = 0;
  while (i < st.length) {
    checksum = checksum ^ st.charCodeAt(i);
    i += 1;
  }
  return checksum.toString(16).toUpperCase().padStart(2, '0');
}

class Skyleader {
  constructor() {
    this.ringID = '';
    this.serialport = '';
    this.sp = null;
    this.writeLogFileBOOL = true;
  }

  openSerialPort(sp) {
    this.serialport = sp;
    // this.sp = new SerialPort(this.serialport, {
    //   baudRate: 115200
    // });
    this.sp = new SerialPort({
        path: this.serialport,
        baudRate: 115200,
        // autoOpen: false
    });
    return 1;
  }

  closeSerialPort() {
    if (this.ringID === '') {
      this.ringID = '-'.repeat(16);
    } else {
      this.ringID = this.ringID;
    }
    this.sp.close();
    return 1;
  }

  async checkConnection() {
    const status = await this._checkConnection();
    if (!status) {
      return -1;
    }
    return true;
  }

  async getRingID() {
    await this._getRingID();
    return this.ringID;
  }

  async _checkConnection() {
    const msg = await this._sendCommand(TEST_CONNECTION, 0);
    if (msg === '$PMTK001,0,3*30' || msg === '$PMTK001,000,3*30') {
      return true;
    }
    return false;
  }

  async _getRingID() {
    const response = await this._sendCommand(READ_RING_ID_8, 3);
    if (!response) {
      return;
    }
    const id = response.split(',')[2];
    this.ringID = id;
  }

  _sendCommand(command, responseLength) {
    return new Promise((resolve, reject) => {
      this.sp.write(command, (err) => {
        if (err) {
          reject(err);
        }
        this.sp.drain((err) => {
          if (err) {
            reject(err);
          }
          this.sp.once('data', (data) => {
            resolve(data.toString().trim());
          });
        });
      });
    });
  }
}

module.exports = Skyleader;
