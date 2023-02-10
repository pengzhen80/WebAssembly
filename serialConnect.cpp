#include <iostream>
#include <string>
#include <vector>
// #include <stdio.h>
#include <string.h>

using namespace std;

// C++ function that returns a list of serial port names
vector<string> getSerialPorts() {
  vector<string> port_names;

  // Code to enumerate available serial ports goes here

  return port_names;
}

extern "C" {
  // Expose the C++ function to JavaScript
  void getSerialPorts(char** data, int* length) {
    auto port_names = getSerialPorts();
    *length = port_names.size();

    // Allocate memory for the list of serial port names
    *data = new char[*length * sizeof(string)];
    char* p = *data;
    for (int i = 0; i < *length; i++) {
      auto& port_name = port_names[i];
      memcpy(p, port_name.c_str(), port_name.size() + 1);
      p += port_name.size() + 1;
    }
  }
}
