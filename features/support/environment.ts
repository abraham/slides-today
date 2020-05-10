const DEBUG = process.env.NODE_ENV === 'debug';
const PORT = process.env.PORT || 5000;
const origin = `http://localhost:${PORT}`;

export { DEBUG, origin, PORT };
