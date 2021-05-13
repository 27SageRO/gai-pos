import React from 'react';
import {MaterialIcons} from 'components';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  LoginScreen,
  ScanScreen,
  RegisterScreen,
  CartScreen,
  StoreScreen,
  AccountScreen,
  ReceiptScreen,
} from 'screens';
import {useSelector} from 'react-redux';

enableScreens();
const Stack = createNativeStackNavigator<AppNavigation>();
const Tab = createBottomTabNavigator<AppNavigation>();

const MainScreen = () => {
  return (
    <Tab.Navigator screenOptions={{tabBarStyle: {paddingBottom: 2}}}>
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="barcode-scan" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="store" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="account-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default () => {
  const profile = useSelector((state: ReduxState) => state.user.profile);

  return (
    <Stack.Navigator>
      {profile ? (
        <>
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Receipt" component={ReceiptScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
