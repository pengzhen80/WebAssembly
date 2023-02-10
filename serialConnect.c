#include <fcntl.h>
#include <unistd.h>
#include <termios.h>
#include <stdio.h>
#include <string.h>

int main() {
    int serial_port = open("/dev/ttyS0", O_RDWR | O_NOCTTY | O_NDELAY);
    if (serial_port == -1) {
        printf("Open Serial Port Error");
        return -1;
    }

    struct termios tty;
    memset(&tty, 0, sizeof tty);

    if (tcgetattr(serial_port, &tty) != 0) {
        printf("Get Attribute Error");
        return -1;
    }

    cfsetospeed(&tty, B9600);
    cfsetispeed(&tty, B9600);

    tty.c_cflag |= CLOCAL | CREAD;
    tty.c_cflag &= ~CSIZE;
    tty.c_cflag |= CS8;
    tty.c_cflag &= ~PARENB;
    tty.c_cflag &= ~CSTOPB;
    tty.c_cflag &= ~CRTSCTS;

    tty.c_lflag &= ~ICANON;
    tty.c_lflag &= ~ECHO;
    tty.c_lflag &= ~ECHOE;
    tty.c_lflag &= ~ISIG;

    tty.c_iflag &= ~(IXON | IXOFF | IXANY);
    tty.c_iflag &= ~(IGNBRK | BRKINT | PARMRK | ISTRIP | INLCR | IGNCR | ICRNL);

    tty.c_oflag &= ~OPOST;
    tty.c_oflag &= ~ONLCR;

    tcflush(serial_port, TCIFLUSH);

    if (tcsetattr(serial_port, TCSANOW, &tty) != 0) {
        printf("Set Attribute Error");
        return -1;
    }

    const char data[] = "TLSK000";
    int write_len = write(serial_port, data, sizeof data);
    if (write_len == -1) {
        printf("Write Data Error");
        return -1;
    }

    char read_buf[100];
    int read_len = read(serial_port, read_buf, sizeof read_buf);
    if (read_len == -1) {
        printf("Read Data Error");
        return -1;
    }

    close(serial_port);

    return 0;
}
