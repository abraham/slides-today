const DEBUG = process.env.NODE_ENV === 'debug';
const BROWSER = process.env.BROWSER === 'firefox' ? 'firefox' : 'chrome';
const PORT = process.env.PORT || 5000;
const origin = `http://localhost:${PORT}`;

export { BROWSER, DEBUG, origin, PORT };
