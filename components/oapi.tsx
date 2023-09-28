// Example from https://beta.reactjs.org/learn

import React, { Component } from 'react';
import 'openapi-explorer';
import styles from './oapi.module.css'

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
    <div slot="operations-header">
      <div className="nav-bar-section-title">Endpoints</div>
      <hr/>
    </div>
    <div slot="authentication">
    <h1>Authentication</h1>
      <div>Replaces the authentication section</div>
    </div>
    </openapi-explorer>
}
