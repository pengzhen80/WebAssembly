var Skyleader = require('./skyleaderFormal');

function setRing(comPort){
    let sLeader = new Skyleader()
    let status = sLeader.openSerialPort(comPort)
    // ringID = sLeader.getRingID()
    status = sLeader.checkConnection()
    // ringID = sLeader.getRingID()
    // status = sLeader.closeSerialPort()
}

setRing('/dev/ttyUSB0');