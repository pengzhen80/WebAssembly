// Get a list of available serial ports
navigator.serial.getPorts().then(ports => {
    // Open the first available serial port
    navigator.serial.requestPort().then(port => {
      // Configure the port's settings
      const options = { baudrate: 9600 };
      port.open({ baudrate: 9600 }).then(() => {
        // Write data to the serial port
        const encoder = new TextEncoder();
        port.write(encoder.encode("Hello, world!"));
      });
    });
  });
  