const http = require('http');

const corsOptions = {
  origin: 'http://localhost:5500',
  credentials: true,
};

const server = http.createServer((req, res) => {
  // Check the client's origin
  const clientOrigin = req.headers.origin;
  console.log('Client origin: ', clientOrigin);

  // Allow CORS for the specific client origin
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    // Preflight request automatically sent by the browser
    res.writeHead(204); // Success with no content to return to the client
    res.end();
    return;
  }
  /*\ /login */
  if (req.url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body); // Parse the JSON body
        if (username === 'admin' && password === '111') {

            res.writeHead(200, {
              'Set-Cookie': 'token=123456; HttpOnly;Max-Age=600 ',
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ message: 'Logged in successfully' }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Unauthorized' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
      }
    });
    /*\ /something */
  } else if (req.url === '/logout' && req.method === 'POST') {
    // Check if the user is logged in by checking the cookie
    const cookieBox = req.headers.cookie;
    console.log('Cookie: ', cookieBox);
    if (cookieBox && cookieBox.includes('token=123456')) {
      res.writeHead(200, {
        'Set-Cookie': 'token=123456; HttpOnly;Max-Age=0 ',
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ message: 'Logged out successfully' }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Unauthorized: You are not logged in.' }));
    }
  } else if (req.url === '/something' && req.method === 'GET') {
    // Check if the user is logged in by checking the cookie
    const cookieBox = req.headers.cookie;
    console.log('Cookie: ', cookieBox);
    if (cookieBox && cookieBox.includes('token=123456')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'You are logged in, here is something.' }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Unauthorized: You are not logged in.' }));
    }
  } else {
    // For any other route, return 404 not found
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404 Not Found');
  }
});
server.listen(3000, () => {
  console.log('Server running on port 3000');
});//**  Generated mostly by chatGPT ver. 4 **/
