import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { hmrServer } from 'webpack-hmr';

import webpackConfig from './webpack.config';

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  // hot: true,
  publicPath: webpackConfig.publicPath,
}));

const server = http.createServer(app);

const io = socketIo(server);
hmrServer(compiler, io);

app.set('port', port);
server.listen(port);
server.on('error', (error) => {
  throw error;
});

server.on('listening', () => {
  // const addr = this.address();
  console.info(`Listening on ${port}`);
})