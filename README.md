# MMM-ElPrisAnalogClock




MagicMirror module that displays a 24-hour analog clock ring colored by hourly electricity prices
from the ElprisetJustNu API. It shows a blinking marker for the current hour and centers the current
and average price in the clock face.

## Installation

1. Copy the entire `MMM-ElPrisAnalogClock` folder into your MagicMirror `modules` directory:
   ```
   cd ~/MagicMirror/modules
   unzip /path/to/MMM-ElPrisAnalogClock.zip
   ```
2. Add the module to your `config/config.js`:
   ```js
   {
     module: "MMM-ElPrisAnalogClock",
     position: "top_center",
     config: {
       updateInterval: 60000,
       apiEndpoint: "https://www.elprisetjustnu.se/api/v1/prices/",
       region: "SE4",
       clockSize: 300,
       ringThickness: 20
     }
   }
   ```

3. Restart MagicMirror.

## License

MIT
# MMM-ElPrisAnalogClock

**** If you want  ****
buymeacoffee.com/mikaelmoran 
