const request = require('request');

const fetchMyIP = function(callback) {
  const url = 'https://api.ipify.org?format=json'
  request(url, (error, response, body) => {
// error can be set if invalid domain, user is offline, etc.    
    if (error) {
      callback(error, null);
      return;
    }
// if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
// ip     
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};


// function takes in an IP address and returns the latitude and longitude for it.
const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => { 
    if (error) {
      callback(error, null);
      return;
    }
// parse the returned body so we can check its information    
    const parsedBody = JSON.parse(body);
// check if "success" is true or not    
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }
//make the request to the API, and have it pass back the relevant (lat/lng) data as an object via callback.
    const { latitude, longitude } = parsedBody;
    callback(null, {latitude, longitude});
  });
};

// Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};






module.exports = { fetchMyIP };
