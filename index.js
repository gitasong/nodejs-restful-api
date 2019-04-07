/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {

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

    // Send response
    res.end('Hello, World!\n');
    // Log request
    console.log(`Request received on path: ${trimmedPath} with method: ${method}, query string parameters: ${queryStringObject}, headers: ${headers}, and payload: ${buffer}`);
  });
});
// Start the server, and have it listen on port 3000
server.listen(3008, () => {
  console.log('The server is now listening on port 3008');
});
