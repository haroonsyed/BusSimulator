# Personal Rapid Transit Simulator
## Data Structures Final Group Project
*By: Haroon Syed, Zack Allen, & James Horn*

### **V1.0 Full Demo: https://haroonsyed.github.io/BusSimulator/**

### **Intro**
At peak hours of bus/ride share services, passengers may be unevenly distributed between vehicles. This may cause congestion of traffic and increased wait times. We want to create a model that chooses personal vehicles for passengers based on the amount of passengers already in the vehicle and the distance that the vehicle has to travel for the destination (correlated with time spent travelling). This can be especially evident on the RTS bus system. With this model, an app/software could choose vehicles for passengers and create less congested and safer roads on campus.

### **Installation**
There are two ways to run our project (both of them work but the file size differs)
1. Run source code on index.html (smaller file size)
   - Download the Source code by clicking the green "Code" button above this read me & download as zip
   - Unzip the file into a folder, open the folder, and then open index.html in Chrome
2. Run as desktop application (larger file size, compatible for win32 64-bit machines)
   - Click the "Executable Build with Electron" in the releases tab (on the right)
   - Download the "FinalProject3" zip file from the assets file
   - Unzip the file into a folder and open the "FinalProject3" application in the main folder
     - To view the source code go to resouces->app (this is the same as the other installation)

### **Features Implemented:**
Interactive Node/Edge Placement\
A* & Dijkstra Pathfinding Algorithm\
Manual Ride Request from Start Station to End Station\
Custom Animation Speed & Car Capacity Parameters\
Visible table data to display Car: Color, #, # Passengers, & Current/Next Station
1. Graphical Simulation
   - Random ride requests for given # of requests
   - Firing Interval to request rides every X seconds
   - Probability factor: chance that a given ride requests fires (used to vary simulation time)
  
2. Performance Simulation
   - Directly compare A* vs Dijkstra on a complete/random graph of size N nodes on X # of requests
   - Random Graph generator based on Erdos-Renyi Model
   - Load Previous Graph (Performance Sim only) to save time on regenerating graphs
   
3. For more features
   ### **V1.1 Beta Demo: https://haroonsyed.github.io/BusSimulator/beta/**
   - Download the beta version under releases or open beta demo link.
   - Contains all hidden features from main release including:
      - Random graph generation drawing
      - Simulation cancelling
      - Request counter
      - Speed independent of interval
      - Higher max speeds and lower intervals.
      - More detailed data in CSV file

Download Graphical/Performance Simulation results as a CSV

### **Video Explanation of Project**
YouTube Link: https://www.youtube.com/watch?v=TunntaLqkg8&t=

### **Min/Max Parameters**
| Parameter | Min-Value | Max-Value | Notes |
|---|---|---|---|
| Start/End Station | 1 | # of stations | Stations are 1-indexed |
| Animation Speed | 1 | N/A | Resets to min if not in range |
| Max # Passengers | 1 | 12 | Resets to min/max if not in range |
| # Requests | 1 | N/A | More Requests = longer sim time |
| Interval | .001 | N/A | Higher interval = longer sim time |
| Probability | .1 | 1 | Lower probability = longer sim time, Resets to min/max if not in range |
| # Nodes | 10 | N/A | More nodes = longer graph building time |

### :construction: **CURRENTLY KNOWN BUGS** :construction:
*All currently known bugs are graphical issues or JavaScript quirks, all Back-End implementations are fully functional*
- Adding a Car and then adding more Nodes/Edges will cause the car to appear underneath the Nodes/Edges 
  - This is due to SVG being based on the order in which you draw elements to the screen
- All information regarding the Performance Simulation is displayed in the Developer Tools Console (F12 for Chrome)
  - Not really a bug, but JavaScript is single threaded, & displaying the graph building to the screen would require major reworkings of our program
- The Download Results as CSV button does not reset to a white background after the first simulation
  - Again, a single thread issue that would require a lot of reworking for an extremely minor issue








