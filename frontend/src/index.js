import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// This assumes there's a <div id="root"></div> in the index.html
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
