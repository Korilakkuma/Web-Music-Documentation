const connect = require('connect');
const serve   = require('serve-static');
const path    = require('path');

const port = 8080;

const dirname = path.resolve('.');

connect().use(serve(`${dirname}/`)).listen(port, () => {
  console.log(`Listen ... (${port})`);
  console.log('Type `open http://localhost:8080/docs/`');
});
