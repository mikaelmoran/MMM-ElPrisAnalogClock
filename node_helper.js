var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({
  start() {
    console.log("MMM-ElPrisAnalogClock Node Helper startad");
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_ELPRIS") {
      this.getElPrisData(payload);
    }
  },

  getElPrisData(payload) {
    const today = new Date();
    const y = today.getFullYear();
    const m = ("0"+(today.getMonth()+1)).slice(-2);
    const d = ("0"+today.getDate()).slice(-2);
    const url = `${payload.apiEndpoint}${y}/${m}-${d}_${payload.region}.json`;
    request({ url: url, json: true }, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        this.sendSocketNotification("ELPRIS_RESULT", body);
      } else {
        console.error("Fel vid inläsning:", err);
      }
    });
  }
});
