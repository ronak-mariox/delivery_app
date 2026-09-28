/**
 * Verdant Rider - Delivery Partner App
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './src/navigation/RootNavigator';
import {navigationRef} from './src/navigation/navigationRef';
import {DriverAuthProvider} from './src/context/DriverAuthContext';
import {OrdersProvider} from './src/context/OrdersContext';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <DriverAuthProvider>
        <OrdersProvider>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </OrdersProvider>
      </DriverAuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
