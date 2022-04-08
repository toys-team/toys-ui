const react = require('@vitejs/plugin-react');
const { port } = require('./config.js');

module.exports = {
  port,
  mode: 'development',
  plugins: [react()],
};

// export default useTeyConfig({
//   port: 2333,
//   mode: 'development',
// });
