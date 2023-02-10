const { SerialPort,ReadlineParser} = require('serialport');

///
// [模組命令]
// #有參數的命令需要計算 Checksum

// TEST_CONNECTION             測試模組通訊
// READ_RING_ID_8              讀取模組 ID_8 商品ID
///
const TEST_CONNECTION = "TLSK000";
const READ_RING_ID_8 = "TLSK606,8";
let SerialPortReaderPosition = 3;
let WriteLogFileBOOL = true;

class Skyleader {
/**
[初始化宣告各項變數]
self.ringID         模組 ID
self.serialport     系統 serial port 位置
self.s              serial port 通道
 */
  constructor() {
    this.ringID = '';
    this.serialport = '';
    this.sp = null;
    // this.writeLogFileBOOL = true;
    // this.postion = 0;
  }

  /**
 * 計算command checksum
 * @param  {string} st command
 * @return {string}  checksum
 */
 _checksum(st) {
    let i = 0;
    let checksum = 0;
    while (i < st.length) {
      checksum = checksum ^ st.charCodeAt(i);
      i += 1;
    }
    return checksum.toString(16).toUpperCase().padStart(2, '0');
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
    const parser = new ReadlineParser();
    this.sp.pipe(parser);
    // parser.on('data', console.log)
    parser.on('data', this.decodeSerialDataToStr);
    return 1;
  }

/**
 * 關閉 serial port 通道
 */
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
    console.log('start check connect');
    const status = await this._checkConnection();
    console.log('end check connect');
    if (!status) {
      return -1;
    }
    return true;
  }

  async getRingID() {
    console.log('start getRingID');
    await this._getRingID();
    console.log('end getRingID');
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
    /**
     *  要求模組ID並設定至self.ringID
     * ModeA 韌體工程師建議: 每次解鎖前都要下查詢 ID 指令後續解鎖指令才會正常運作。
     * 所以把 ringID 已經查詢到就不查詢的流程註解掉
     * 若與模組溝通 1 秒內無任何回傳訊息, 自動 time out
     */
    SerialPortReaderPosition = 3;
    const response = await this._sendCommand(READ_RING_ID_8);
    if (!response) {
      return;
    }
    const id = response.split(',')[2];
    this.ringID = id;
  }

  _sendCommand(cmd) {
    /**
     * desc: 與模組溝通, 回傳完整的模組response或模組response中的特定位置資料
     * @param {string} cmd command
     * @param {int} postion 所需要的資訊位於模組response用, 切開的哪個位置, 若position為 0, 就回傳完整的模組response
     * @return {Promise(any)} ringID/challange/full response
     */
    // command = '${}*{}\r\n'.format(cmd, this._checksum(cmd));
    var command ='$'+cmd+'*'+this._checksum(cmd)+'\r\n';
    var ringID = null;
    if(this.ringID == ''){
        ringID = '-'*16;
    }
    else{
        ringID = this.ringID;
    }
    var count = 0;
    console.log('cmd is :', cmd);
    console.log('command is : ',command);

    var command = '$TLSK000*30\r\n';
    const buffer = Buffer.from(command, 'ascii');
    const byteArray = Array.from(buffer);
    this.sp.write(byteArray);
  }

  /**
 * 回傳完整的模組response或模組response中的特定位置資料
 * @param  {[ArrayBuffer(asiccBuff)]} asiccBuff [description]
 * @param  {int} position [description]
 * @return {string}  ringID/challange/full response
 */
  decodeSerialDataToStr(asiccBuff){
    var position = SerialPortReaderPosition;
    // const byteArray = [72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33];
    const buffer = Buffer.from(asiccBuff);
    let str = buffer.toString('ascii');
    var line = [];
    
    // console.log("read : ",str);
    // console.log(str.includes('$PMTK'));
    if(str.length>0 &&(str.includes('$PMTK'))){
        console.log("origin : ",str);
        str = str.slice(str.indexOf('$PMTK'));
        console.log("slice : ",str);
        console.log(position);
        console.log(WriteLogFileBOOL);
        line.push(str);
        if(WriteLogFileBOOL){
            console.log('<-',line.length,line);
        }
        str = str.split(',');
        if((position>0)&&(str.length>position)){
            console.log(str[position])
        }
    }
}
}

module.exports = Skyleader;
