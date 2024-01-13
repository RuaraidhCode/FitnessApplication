import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import fitjourneyLogo from '../assets/images/fitjourney.png';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { BASE_URL } from '../config';



const RegisterScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    
  const minLength = 8;
  const regexNumber = /[0-9]/;
  const regexSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

  if (!username || username.length < 3 || username.length > 15) {
    Alert.alert(
      'Invalid Username',
      'Username must be between 3 and 15 characters.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
    return;
  }

  if (!validateEmail(email)) {
    Alert.alert('Invalid Email', 'Please enter a valid email address.', [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);
    return;
  }

  // Password strength checking
  if (
    password.length < minLength  ||
    (!regexNumber.test(password) && !regexSpecialChar.test(password))
  ) {
    // Password does not meet criteria, display an alert to the user
    Alert.alert(
      'Password Error',
      '\n- Must be at least 8 characters.\n' +
      '\n- Must contain at least one number or symbol.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
    return;
  }

    try {
      const response = await axios.post(`${BASE_URL}/api/register`, {
        username,
        email,
        password: password,
      });
     
      console.log(response.data); 
      login(username, password);
     // navigation.navigate('Login');
    } catch (error) {
      // Handle error response, e.g., show an error message to the user
      console.log('Error:', error.message);
    }
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
   // navigation.navigate('Login')
  };


  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
      <View style={styles.imageContainer}>
            <Image source={fitjourneyLogo} resizeMode='contain' style={{ height: 70, width: 300 }} />
        </View>
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText]}>Register</Text>
          </View>
        
        
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Username"
            style={styles.textInput}
            keyboardType="default"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email Address"
            style={styles.textInput}
            keyboardType="email-address"
            value={email}
            onChangeText={handleEmailChange}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            style={styles.textInput}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          
        </View>
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 30}}>
          <Text style={styles.loginText}>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonOtherText}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const window = Dimensions.get('window');
const windowHeight = window.height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Change justifyContent to 'flex-start'
    paddingTop: 40, // Add paddingTop to push the content down
    paddingHorizontal: 40 // Add paddingHorizontal for spacing on the sides
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  imageContainer: {
    marginBottom: 150
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 25,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },

  registerContainer: {
    position: 'absolute',
    top: windowHeight * 0.25 - 0,
    width: '100%',
    alignItems: 'left',
  },

  registerText: {
    fontSize: 20,
    fontFamily: 'MontserratSemiBold',
    marginBottom: 20,
    borderBottomColor: '#000',
  },

  icon: {
    marginRight: 5,
  },
  textInput: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: 'MontserratMedium',
  },
  forgotText: {
    color: '#3498db',
    fontWeight: '700',
    marginLeft: 'auto',
  },
  loginButton: {
    alignSelf: 'stretch',
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  loginButtonText: {
    textAlign: 'center',
    fontFamily: 'MontserratSemiBold',
    fontSize: 16,
    color: '#fff',
  },
  loginText: {
    fontFamily: 'MontserratMedium',
  },
  loginButtonOtherText: {
    fontFamily: 'MontserratSemiBold',
    color: '#3498db'
  }
});

export default RegisterScreen;
