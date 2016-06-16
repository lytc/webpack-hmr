import React from 'react';
import {render } from 'react-dom';
import io from 'socket.io-client';
import { hmrClient } from 'webpack-hmr';

import App from './App';

require('./style.css');

render(<App />, document.getElementById('app'));

const socket = io.connect('//', { transports: ['websocket', 'polling'] });
hmrClient(socket);
