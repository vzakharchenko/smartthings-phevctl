const fetch = require('axios');

const REACT_BACKEND_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

function errorHandler(response) {
    console.error('error:', response.data);
}

export function fetchData(url, method = 'GET', headers) {
    return new Promise((resolve, reject) => {
        fetch({
            url,
            method,
            headers,
            transformResponse: req => req,
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

export async function fetchBackend(url, method = 'GET', headers) {
    return await fetchData(`${REACT_BACKEND_URL}${url}`, method, headers);
}

export function sendData(url, method = 'POST', data, headers) {
    return new Promise((resolve, reject) => {
        fetch({
            url,
            method,
            data,
            transformResponse: req => req,
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

export async function sendToBackend(url, method = 'POST', data, headers) {
    const headerMap= headers||{}
    headerMap['Content-Type']='application/json';
    return await sendData(`${REACT_BACKEND_URL}${url}`, method, JSON.stringify(data), headerMap);
}
