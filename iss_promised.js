const request = require('request-promise-native');

//Requests user's ip address from https://www.ipify.org/
//Returns: Promise of request for ip data, returned as JSON string

const fetchMyIP = function() {
 return request('https://api.ipify.org?format=json');
};


const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};


const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  return request(url);
};


const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};


module.exports = { nextISSTimesForMyLocation };

//module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };
