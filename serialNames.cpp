#include <iostream>
#include <vector>
#include <dirent.h>
#include <string.h>

int main() {
    std::vector<std::string> serial_ports;
    struct dirent *entry;
    DIR *dir = opendir("/dev");

    if (dir == NULL) {
        std::cout << "Failed to open '/dev' directory." << std::endl;
        return 1;
    }

    while ((entry = readdir(dir)) != NULL) {
        if (strncmp(entry->d_name, "ttyS", 4) == 0 || strncmp(entry->d_name, "ttyUSB", 6) == 0) {
            serial_ports.push_back(std::string("/dev/") + std::string(entry->d_name));
        }
    }

    closedir(dir);

    for (const std::string &port_name : serial_ports) {
        std::cout << "Serial Port: " << port_name << std::endl;
    }

    return 0;
}
