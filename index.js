/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// Instantiating HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the HTTP server, and have it dynamically choose port based on environment config
httpServer.listen(config.httpPort, () => {
  console.log(`The HTTP server is now listening on port ${config.httpPort} in ${config.envName} mode`);
});

// Instantiating HTTPS server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// Start the HTTPS server, and have it dynamically choose port based on environment config
httpsServer.listen(config.httpsPort, () => {
  console.log(`The HTTPS server is now listening on port ${config.httpsPort} in ${config.envName} mode`);
});

// All the logic for both HTTP and HTTPS servers
const unifiedServer = (req, res) => {
  // Get request URL and parse it
  // Sets parsedURL.queryString to true as if we had sent it to the queryString module
  // (works w/url module)
  // The parsedURL object contains metadata on the user request URL
  const parsedURL = url.parse(req.url, true);
  // Get (untrimmed) path
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  // Get query string as an object; stringify
  const queryStringObject = JSON.stringify(parsedURL.query);
  // Get HTTP method
  const method = req.method.toLowerCase();
  // Get HTTP headers as an object; stringify
  const headers = JSON.stringify(req.headers);
  // Get payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () =>{
    buffer += decoder.end();

    // Choose the handler for each request path. If not found, use the Not Found handler.
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    // Construct data object to send to handler
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    }
    // Route request to handler specified in router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
      // Use the payload called back by the handler, or default to an empty object
      payload = typeof(payload) === 'object' ? payload : {};
      // Convert payload to a string
      const payloadString = JSON.stringify(payload);
      // Send response
      res.setHeader('Content-Type', 'application/json');  // set response type to JSON, for brower parsing
      res.writeHead(statusCode);
      res.end(payloadString);
      // Log response
      console.log('Returning response: ', statusCode, payloadString)
    });
    // Log request
    console.log(`Request received on path: ${trimmedPath} with method: ${method}, query string parameters: ${queryStringObject}, headers: ${headers}, and payload: ${buffer}`);
  });
};

// Define request handlers
const handlers = {};
// Ping handler
handlers.ping = (data, callback) => {
  // Callback with HTTP status code and payload object
  callback(200);
};
// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};
// Define the request router
const router = {
  'ping': handlers.ping
}
