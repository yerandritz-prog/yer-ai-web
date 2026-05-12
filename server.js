const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
    if (!path.extname(urlPath)) urlPath += '.html';

    const filePath = path.join(__dirname, urlPath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // fallback to index.html
            fs.readFile(path.join(__dirname, 'index.html'), (err2, data2) => {
                if (err2) { res.writeHead(500); res.end('Error loading page'); return; }
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data2);
            });
            return;
        }
        const ext = path.extname(filePath);
        const contentType = mimeTypes[ext] || 'text/plain';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Yer.AI web running on port ${PORT}`);
});
