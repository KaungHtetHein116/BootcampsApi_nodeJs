const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "YSnNtiGh9rc4G6YVmEeAI9KMeRUWSaAR",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
