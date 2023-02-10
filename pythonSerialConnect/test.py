import serial

ser = serial.Serial("/dev/ttyUSB0", 115200)

def _checksum(st):
    '''
    input: command
    output: checksum
    do:
        計算command checksum
    '''
    i = 0
    checksum = 0
    while i < len(st):
        checksum = checksum ^ ord(st[i])
        i += 1
    return '{:02x}'.format(checksum).upper()
cmd = 'TLSK000'
# command = '${}*{}\r\n'.format(cmd, _checksum(cmd))
command = '$TLSK000*30\r\n'

ser.write(bytearray(command,'ascii'))

while True:
    if ser.in_waiting > 0:
        # data = ser.readline().decode("utf-8").strip()
        data = ser.readline().decode("ascii").strip()
        print(data)
