// Example from https://beta.reactjs.org/learn

import React from 'react';
import 'openapi-explorer';
import styles from './oapi.module.css'
import OApiFiltering from './oapi-filtering.mdx'

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
  return <openapi-explorer
      className = {styles.oapi}
      spec-url = {specUrl}
      server-url = {serverUrl}
      collapse = {true}
      hide-server-selection = {true}
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
      <div className = {styles.subheading}>AUTHENTICATION</div>
      <div>Replaces the authentication section</div>
    </div>
    </openapi-explorer>
}
