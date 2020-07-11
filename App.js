import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import {YellowBox} from 'react-native';

import Router from './src/routes';

const App = () => {
  YellowBox.ignoreWarnings(['Setting a timer']);
  YellowBox.ignoreWarnings(['Failed prop type: Invalid']);
  return (
    <>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
      <FlashMessage position="top" />
    </>
  );
};

export default App;
