import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {PersistGate} from 'redux-persist/integration/react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {persistor, store} from 'rdx/store';

import Navigator from './navigator';
import R from 'res/R';

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor('transparent');
StatusBar.setBarStyle('dark-content');

export default function RootApp() {
  const theme = DefaultTheme;
  theme.colors.background = R.colors.aquaHaze;
  theme.colors.text = R.colors.riverBed;
  theme.colors.primary = R.colors.riverBed;

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer theme={theme}>
          <Navigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
