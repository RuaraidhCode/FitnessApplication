import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './AuthContext';
import AppNav from './AppNav';
import { useFonts, Montserrat_500Medium, Montserrat_700Bold, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { AppLoading } from 'expo';


const Stack = createStackNavigator();

const App = () => {
  let [fontsLoaded] = useFonts({
    MontserratMedium: Montserrat_500Medium,
    MontserratBold: Montserrat_700Bold,
    MontserratSemiBold: Montserrat_600SemiBold,
  });
  
  return (
    <NavigationContainer independent={true}>
      <AuthProvider>
         <AppNav />
        </AuthProvider>
    </NavigationContainer>
  );
};
export default App;