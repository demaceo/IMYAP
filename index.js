import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import ErrorBoundary from './src/components/ErrorBoundary';
import {name as appName} from './app.json';

const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

AppRegistry.registerComponent(appName, () => AppWithErrorBoundary);
