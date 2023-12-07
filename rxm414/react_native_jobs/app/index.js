import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { AuthProvider } from './AuthContext';
import AppNav from './AppNav';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <AuthProvider>
         <AppNav />
        </AuthProvider>
    </NavigationContainer>
  );
};
export default App;
