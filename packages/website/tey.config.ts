import { port } from './config.js';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// const { port } = require('./config');
// const react = require('@vitejs/plugin-react');
// module.exports = {
//   port,
//   mode: 'development',
//   plugins: [react()],
// };
export default {
  port,
  mode: 'development',
  plugins: [react()],
};
