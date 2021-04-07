const child_process = require ('child_process');
const path          = require ('path');
const AsyncLock     = require ('async-lock');


class ThermoBeaconWS08 {
  constructor (ble_mac, ble_ctl_path = '/usr/local/lib/node_modules/thermo_beacon_ws08/', callback) {
    const lock = new AsyncLock ();
    lock.acquire ('ble_key', function () {
      const ble_ctl = child_process.fork (path.join (ble_ctl_path, 'ble_ctl.js'));

      ble_ctl.send (ble_mac);

      ble_ctl.on ('message', function (json) {
        let buf = Buffer.from (json.message.ManufacturerData['17']);
        if (buf.byteLength == 18) {
          ble_ctl.kill ('SIGINT');
          ble_ctl.send (ble_mac);
          callback (null, {
            te: Math.round (((buf[11] << 8 | buf[10]) / 16) * 10) / 10,
            hu: Math.round ((buf[13] << 8 | buf[12]) / 16),
            bt: Math.round (((buf[9] << 8 | buf[8]) / 3400) * 100)
          });
          return;
        }
        else {
          ble_ctl.kill ('SIGINT');
          callback (null, null);
          return;
        }
      })

      ble_ctl.on ('error', function (error) {
        callback (error, null);
        return;
      })
    }
  )}
}

if (require.main === module) {
  new ThermoBeaconWS08 (process.argv[2], process.argv[3], function (error, value) {
    console.log (value);
    console.log (error);
  });
}
else {
  module.exports = ThermoBeaconWS08;
}
