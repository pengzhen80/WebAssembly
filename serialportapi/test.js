const { SerialPort,ReadlineParser} = require('serialport')

// Create a port
// const port = new SerialPort({
//   path: '/dev/tty-usbserial1',
//   baudRate: 57600,
// })
let availableSerialPathList = [];


// interface OpenOptions {
//     /** The system path of the serial port you want to open. For example, `/dev/tty.XXX` on Mac/Linux, or `COM1` on Windows */
//     path: string
//     /**
//       * The baud rate of the port to be opened. This should match one of the commonly available baud rates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, or 115200. Custom rates are supported best effort per platform. The device connected to the serial port is not guaranteed to support the requested baud rate, even if the port itself supports that baud rate.
//       */
//     baudRate: number
//     /** Must be one of these: 5, 6, 7, or 8 defaults to 8 */
//     dataBits?: 5 | 6 | 7 | 8
//     /** Prevent other processes from opening the port. Windows does not currently support `false`. Defaults to true */
//     lock?: boolean
//     /** Must be 1, 1.5 or 2 defaults to 1 */
//     stopBits?: 1 | 1.5 | 2
//     parity?: string
//     /** Flow control Setting. Defaults to false */
//     rtscts?: boolean
//     /** Flow control Setting. Defaults to false */
//     xon?: boolean
//     /** Flow control Setting. Defaults to false */
//     xoff?: boolean
//     /** Flow control Setting defaults to false*/
//     xany?: boolean
//     /** drop DTR on close. Defaults to true */
//     hupcl?: boolean
// }


/**
 * [description]
 * @param  {[ArrayBuffer(asiccBuff)]} asiccBuff [description]
 * @return {string}  [description]
 */
function decodeSerialDateToStr(asiccBuff){
    // const byteArray = [72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33];
    const buffer = Buffer.from(asiccBuff);
    const str = buffer.toString('ascii');
    
    console.log("read : ",str);
    return str;
}

/**
 * [description]
 * @param  {[string]} serialPathList [description]
 * @return {[object(SerialPort)]}  [description]
 */
function connectSerialPort(serialPathList){
    var portList = [];
    for(var i=0;i<serialPathList.length;i++)
    {
        const port = new SerialPort({
            path: serialPathList[i],
            baudRate: 115200,
            // autoOpen: false
        })
        const parser = new ReadlineParser()
        port.pipe(parser)
        // parser.on('data', console.log)
        parser.on('data', decodeSerialDateToStr);
        var sendStr = '$TLSK000*30\r\n';
        const buffer = Buffer.from(sendStr, 'ascii');
        const byteArray = Array.from(buffer);
        port.write(byteArray);
        portList.push(port);
    }
    // console.log(portList);
    return portList;
}

// /**
//  * [description]
//  * @param  {[object(SerialPort)]} serialPortList [description]
//  * @return {[object(SerialPort)]}  [description]
//  */
// function openSerialPort(serialPortList)
// {
//     for(var i=0;i<serialPortList.length;i++)
//     {
//         serialPortList[i].open();
//     }
// }

SerialPort.list()
.then(res=>{
        for(var i=0;i<res.length;i++)
        {
            if(res[i]['manufacturer'])
            {
                availableSerialPathList.push(res[i]['path']);
            }
        }
        console.log(availableSerialPathList);
        let serialPortList = connectSerialPort(availableSerialPathList);
    })