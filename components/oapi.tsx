// Example from https://beta.reactjs.org/learn

import React, { useEffect } from 'react';
import 'openapi-explorer';
import styles from './oapi.module.css'
import OApiFiltering from './oapi-filtering.mdx'
import OApiAuthentication from './oapi-authentication.mdx'

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
  const specUrl = "/swagger/v1.json";
  const serverUrl = "https://api.lightbug.cloud/api";
  var authToken = ""

  const handleAuthTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    authToken = event.target.value;
  }

  useEffect(() => {
    const explorer = document.querySelector('openapi-explorer');

    const onSpecLoaded = (event: CustomEvent) => {
      event.detail.info.title = "Lightbug API";
    };
    explorer?.addEventListener('spec-loaded', onSpecLoaded);

    const requestInterceptor = (event: CustomEvent) => {
      if (authToken !== "") {
        event.detail.request.options.headers.append('Authorization', authToken);
      }
    };
    explorer?.addEventListener('request', requestInterceptor);

    return () => {
      explorer?.removeEventListener('spec-loaded', onSpecLoaded);
      explorer?.removeEventListener('request', requestInterceptor);
    };
  }, []);

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
    <div slot="authentication">
      <OApiAuthentication foo="bar" handleAuthTokenChange={handleAuthTokenChange}/>
    </div>
    </openapi-explorer>
}
