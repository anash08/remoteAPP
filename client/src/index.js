import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(<App />);
serviceWorker.unregister()