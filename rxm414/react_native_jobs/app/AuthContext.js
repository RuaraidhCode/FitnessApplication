import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { BASE_URL } from '../config';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => { 
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const login = async (username, password) => {
        setIsLoading(true);
      
        try {
          const res = await axios.post(`${BASE_URL}/login`, {
            username,
            password,
          });
      
          let userInfo = res.data;
          setUserInfo(userInfo);
          setUserToken(userInfo.accessToken);
          console.log("Here is the token: ", userInfo.accessToken);
          console.log("Here is the name: ", userInfo.username);
          console.log("Here is the res.data: ", res.data);
      
          AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          AsyncStorage.setItem('userToken', res.data.accessToken);
      
          setIsLoading(false);
      
          if (res.status === 200) {
            return 'LOGIN SUCCESS'; 
          } else {
            return 'INVALID_CREDENTIALS';
          }
        } catch (error) {
          console.log('Login error:', error);
          setIsLoading(false);
          throw  Alert.alert('Error', 'Invalid username or password.');
        }
      };
      

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        setIsLoading(false);
    }

    const isLoggedIn = async() => {
        try{
            setIsLoading(true);
            let userInfo = await AsyncStorage.getItem('userInfo');
            let userToken = await AsyncStorage.getItem('userToken');
            userInfo = JSON.parse(userInfo);

            if( userInfo ) {
                setUserInfo(userInfo);
                setUserToken(userToken);
            }

            setUserToken(userToken)
            setIsLoading(false);
        } catch(e) {
            console.log('Is logged in error')
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, [])

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken, userInfo }}>
        {children}
    </AuthContext.Provider>
  );
};
