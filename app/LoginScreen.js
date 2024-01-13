import React, {useContext, useState, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import fitjourneyLogo from '../assets/images/fitjourney.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from './AuthContext';


const LoginScreen = () => {
    const navigation = useNavigation();
    const {login} = useContext(AuthContext);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    
    
   const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert('Error', 'Please enter both username and password.');
    return;
  }


  try {
    const loginResult = await login(username, password);

    if (loginResult === 'LOGIN_SUCCESS') {
      // Successfully logged in, navigate to the next screen or perform actions
      console.log('Logged in successfully');
      // Navigate to the next screen or perform actions here
    } else if (loginResult === 'INVALID_CREDENTIALS') {
      // Alert for incorrect username or password
      Alert.alert('Error', 'Incorrect username or password.');
    }
  } catch (error) {
    console.error('Login error:', error);
    // Handle other errors here if needed
  }
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image source={fitjourneyLogo} resizeMode='contain' style={{ height: 70, width: 300 }} />
        </View>
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Login</Text>
            </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          style={styles.textInput}
          keyboardType="default"
          value={username}
          onChangeText={text => setUsername(text)}
        />

      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          secureTextEntry={true}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotText}>Forgot?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {handleLogin()}}
        style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 30}}>
      <Text style={styles.registerText}>New to the app?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerButtonText}> Register</Text>
        </TouchableOpacity>
      </View>

    </View>
    </SafeAreaView>
  );
};

const window = Dimensions.get('window');
const windowHeight = window.height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 40,
    marginRight: 40,
  },

  imageContainer: {
      marginBottom: 150
  },

  loginContainer: {
    position: 'absolute',
    top: windowHeight * 0.25 + 40,
    width: '100%',
    alignItems: 'left',
  },
  loginText: {
    fontSize: 20,
    fontFamily: 'MontserratSemiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 25,
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
    fontFamily: 'MontserratSemiBold',
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
  registerText: {
    fontFamily: 'MontserratMedium',
  },
  registerButtonText: {
    fontFamily: 'MontserratSemiBold',
    color: '#3498db'
  }
});

export default LoginScreen;
