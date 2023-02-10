#include <fcntl.h>   // File control definitions
#include <termios.h> // POSIX terminal control definitions
#include <unistd.h>  // UNIX standard function definitions
#include <cstring>
#include <stdio.h>

int main() {
  int fd;                              // File descriptor for the serial port
  const char *port = "/dev/ttyUSB0";    // Name of the serial port
  struct termios tty;                 // Terminal control structure

  // Open the serial port
  fd = open(port, O_RDWR | O_NOCTTY | O_NDELAY);
  if (fd == -1) {
    // Handle the error
    printf("open err %d\n",fd);
    return 0;
  }

  // Configure the serial port's settings
  tcgetattr(fd, &tty);
  cfsetispeed(&tty, B115200);
  cfsetospeed(&tty, B115200);
  tty.c_cflag = (tty.c_cflag & ~CSIZE) | CS8;     // 8-bit characters
  tty.c_iflag &= ~IGNBRK;                          // Disable break control
  tty.c_lflag = 0;                                 // No signaling chars, no echo, no canonical processing
  tty.c_oflag = 0;                                 // No remapping, no delays
  tty.c_cc[VMIN]  = 0;                             // Read block (0 chars)
  tty.c_cc[VTIME] = 5;                             // 0.5 seconds read timeout
  tty.c_iflag &= ~(IXON | IXOFF | IXANY);         // Disable software flow control
  tty.c_cflag |= (CLOCAL | CREAD);                 // Enable the receiver and set local mode
  tty.c_cflag &= ~(PARENB | PARODD);               // No parity
  tty.c_cflag &= ~CSTOPB;                          // 1 stop bit
  tty.c_cflag &= ~CRTSCTS;                         // Disable hardware flow control
  tcsetattr(fd, TCSANOW, &tty);

  // Write data to the serial port
  const char *data = "TLSK000";
  int len = strlen(data);
  write(fd, data, len);

  // Read data from the serial port
  char buffer[1024];
  int n = read(fd, buffer, sizeof(buffer) - 1);
  buffer[n] = '\0';
  printf("Received: %ld\n", sizeof(buffer));
  printf("Received: %s\n", buffer);

  // Close the serial port
  close(fd);

  return 0;
}
