// Example from https://beta.reactjs.org/learn

import React, { useEffect } from 'react';
import 'openapi-explorer/dist/es/openapi-explorer.js';
import styles from './oapi.module.css'
import OApiOverview from './oapi-overview.mdx'
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

export function OApiV1() {
  const specUrl = "/swagger/v1.json";
  const serverUrl = "https://api.lightbug.cloud/api";
  var authToken = ""

  const handleAuthTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    authToken = event.target.value;
  }

  useEffect(() => {
    const explorer = document.querySelector('openapi-explorer') as any;

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

    // Add CSS to the shadow DOM
    const apiExplorer = document.getElementsByTagName('openapi-explorer')[0];
    const style = document.createElement('style');
    style.innerHTML = `
    #operations-root {
      padding-top: 0px !important;
    }
    .section-gap--focused-mode {
      padding-top: 0px !important;
    }`
    apiExplorer.shadowRoot.appendChild(style);

    return () => {
      explorer?.removeEventListener('spec-loaded', onSpecLoaded);
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
    {/* <div slot="post-/users/login">
      <div>Special content for just one route</div>
    </div> */}
    </openapi-explorer>
}


export function OApiV2() {
  const specUrl = "/swagger/v2.json";
  const serverUrl = "https://api.lightbug.cloud/v2";
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

    // Add CSS to the shadow DOM
    const apiExplorer = document.getElementsByTagName('openapi-explorer')[0];
    const style = document.createElement('style');
    style.innerHTML = `
    #operations-root {
      padding-top: 0px !important;
    }
    .section-gap--focused-mode {
      padding-top: 0px !important;
    }`
    apiExplorer.shadowRoot.appendChild(style);

    return () => {
      explorer?.removeEventListener('spec-loaded', onSpecLoaded);
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
    {/* <div slot="post-/users/login">
      <div>Special content for just one route</div>
    </div> */}
    </openapi-explorer>
}
