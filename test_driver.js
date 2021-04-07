const ZeonetakWS08  = require('thermo_beacon_ws08');
let  blu_mac        = "XX:XX:XX:XX:XX:XX";
let  noble_ctl_path = "/home/pi/homebridge-sensor/node_modules/thermo_beacon_ws08/";

let wosendor = new ZeonetakWS08 (blu_mac, noble_ctl_path, function (error, value) {
    console.log (value);
    console.log (error);
});
