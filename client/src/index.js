import { Auth0Provider } from '@auth0/auth0-react'
import React from 'react'
import { createRoot } from 'react-dom/client';
import 'semantic-ui-css/semantic.min.css'
import App from './App'
import './index.css'
import { authConfig } from './config.ts';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Auth0Provider
    domain={authConfig.domain}
    clientId={authConfig.clientId}
    redirectUri={window.location.origin}
    audience={`https://${authConfig.domain}/api/v2/`}
    scope="read:todo write:todo delete:todo"
  >
    <App />
  </Auth0Provider>
)
