// Example from https://beta.reactjs.org/learn

import React, { useEffect } from 'react';
import 'openapi-explorer/dist/es/openapi-explorer.js';
import styles from './oapi.module.css'
import OApiOverview from './oapi2-overview.mdx'
import OApiFiltering from './oapi2-filtering.mdx'
import OApiAuthentication from './oapi2-authentication.mdx'

interface OpenApiExplorerProps {
  collapse?: boolean;
  table?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'openapi-explorer': OpenApiExplorerProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export function OApi() {
  const specUrl = "/swagger/v2.json";
  const serverUrl = "https://api.lightbug.cloud/v2";
  var authToken = ""

  const handleAuthTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    authToken = event.target.value;
  }

  useEffect(() => {
    const explorer = document.querySelector('openapi-explorer');

    const requestInterceptor = (event: CustomEvent) => {
      if (authToken !== "") {
        event.detail.request.options.headers.append('Authorization', authToken);
      }
    };
    explorer?.addEventListener('request', requestInterceptor);

    // Add CSS to the shadow DOM
    const apiExplorer = document.getElementsByTagName('openapi-explorer')[0];
    const style = document.createElement('style');
    // This style partially fixes scrolling issues, ensuring:
    // - in most cases that the "filter" box is visible on top of the navbar at default scroll positions
    // - the API Key auth button is also visible in the top right
    style.innerHTML = `
    .nav-bar {
      margin-top: 65px !important;
    }
    .security-info-button {
      margin-top: 20px !important;
    }
    `
    apiExplorer.shadowRoot.appendChild(style);

    return () => {
      explorer?.removeEventListener('request', requestInterceptor);
    };
  }, [authToken]);

  return <openapi-explorer
      className = {styles.oapi}
      spec-url = {specUrl}
      server-url = {serverUrl}
      collapse = {true}
      hide-server-selection = {true}
      hide-schema-selection = {true}
      >
    <div slot="operations-header">
      <div className="nav-bar-section-title">Endpoints</div>
      <hr/>
    </div>
    <div slot="overview">
      <OApiOverview/>
    </div>
    <div slot="overview-api-description"></div>
    <div slot="authentication">
      <OApiAuthentication handleAuthTokenChange={handleAuthTokenChange}/>
    </div>
    </openapi-explorer>
}
