const fetch = require('axios');

function errorHandler(response) {
  console.error('error:', response.data);
}

function fetchData(url, method = 'GET', headers) {
  return new Promise((resolve, reject) => {
    fetch({
      url,
      method,
      headers,
      transformResponse: (req) => req,
      withCredentials: true,
      timeout: 29000,
    }).then((response) => {
      resolve(response);
    }).catch((response) => {
      errorHandler(response);
      reject(response);
    });
  });
}

function sendData(url, method = 'POST', data, headers) {
  return new Promise((resolve, reject) => {
    fetch({
      url,
      method,
      data,
      transformResponse: (req) => req,
      headers,
      withCredentials: true,
      timeout: 29000,
    }).then((response) => {
      resolve(response);
    }).catch((response) => {
      errorHandler(response);
      reject(response);
    });
  });
}

module.exports.sendData = sendData;
module.exports.fetchData = fetchData;
