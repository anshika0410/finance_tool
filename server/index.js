const app = require('./app');
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

// Keep-alive loop to prevent process exit in some environments
setInterval(() => { }, 1000 * 60 * 60);
