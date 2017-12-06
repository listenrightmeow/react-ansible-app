import React from 'react';
import ReactDOM from 'react-dom';
import 'stylesheets/index.css';
import App from 'components/app';
import registerServiceWorker from 'workers/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
