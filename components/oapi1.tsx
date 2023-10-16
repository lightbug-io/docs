// Example from https://beta.reactjs.org/learn

import React, { useEffect } from 'react';
import 'openapi-explorer/dist/es/openapi-explorer.js';
import styles from './oapi.module.css'
import OApiOverview from './oapi1-overview.mdx'
import OApiFiltering from './oapi1-filtering.mdx'
import OApiAuthentication from './oapi1-authentication.mdx'

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
  const specUrl = "/swagger/v1.yaml";
  const serverUrl = "https://api.lightbug.cloud/api";
  var authToken = ""

  const handleAuthTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    authToken = event.target.value;
  }

  useEffect(() => {
    const explorer = document.querySelector('openapi-explorer') as any;

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
    <div slot="nav-section" className = {styles.customSectionBar}>Filtering</div>
    <div slot="custom-section" className = {styles.customSection}>
      <OApiFiltering/>
    </div>
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
    <div slot="post-/users/login">
      <div>Use this route to get a token for use in subsequent authenticated requests.</div>
      <div>The <code>id</code> in the response is the token.</div>
      <div>This needs to be passed in the <code>Authorization</code> header of subsequent requests.</div>
      <div>For example: <code>Authorization: h7d8j3921u091jfdwjd0j1</code></div>
    </div>
    </openapi-explorer>
}
