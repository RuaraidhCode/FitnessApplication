import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import { Image } from 'react-native';
import defaultProfilePic from '../assets/images/defaultProfilePic.png';
import trophy from '../assets/images/trophy.png';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import ProgressBar from 'react-native-progress/Bar';
import BarChart from './LevelingTest';

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { logout, userInfo } = useContext(AuthContext);
  const badgeInfo = route.params?.badgeInfo;
  const [selectedImage, setSelectedImage] = useState(null);
  const [userDate, setUserData] = useState(null);
  const [leftAchievement, setLeftAchievement] = useState('');
  const [middleAchievement, setMiddleAchievement] = useState('');
  const [rightAchievement, setRightAchievement] = useState('');
  const Buffer = require("buffer").Buffer;
  const [userExperienceList, setUserExperienceList] = useState([]);
  const [experience, setExperience] = useState(0);
  const [maxExperience, setMaxExperience] = useState(100);
  const [totalExperience, setTotalExperience] = useState(100);
  const [level, setLevel] = useState(1);

  const progress = maxExperience !== 0 ? experience / maxExperience : 0;


  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        // Your axios GET request to fetch updated experience
        const response = await axios.get(`${BASE_URL}/api/recieveExperience?user_id=${userInfo.user_id}`);
        // Update state with new data
        setUserExperienceList(response.data[0]);
        setExperience(response.data[0].experience);
        setMaxExperience(response.data[0].max_experience);
        setTotalExperience(response.data[0].total_experience);
        setLevel(response.data[0].level);
      } catch (error) {
        console.log(error.message);
      }
    };
  
    // Fetch data initially
    fetchExperienceData();
  
    // Poll for updates every 5 seconds (adjust the interval as needed)
    const interval = setInterval(fetchExperienceData, 5000);
  
    // Clear interval on component unmount to avoid memory leaks
    return () => clearInterval(interval);
  }, []);
  
  const [fontsLoaded] = useFonts({
    'DMSans-Bold': require('../assets/fonts/DMSans-Bold.ttf'),
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result);
  
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log('sdkmvsldmsmkmdlclksdmcsmc --> ', result.assets[0].uri);
  
      // Create a unique key for storing the image based on user ID
      const storageKey = `selectedImage_${userInfo.user_id}`;
  
      // Save the picked image URI with the unique key in AsyncStorage
      await AsyncStorage.setItem(storageKey, result.assets[0].uri);
    }
  };

  const fetchPicData = async () => {
    try {
      // Construct the storage key based on user ID
      const storageKey = `selectedImage_${userInfo.user_id}`;
  
      // Retrieve the image URI from AsyncStorage using the constructed key
      const storedImageUri = await AsyncStorage.getItem(storageKey);
  
      if (storedImageUri) {
        setSelectedImage(storedImageUri);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchPicData();
  }, []); 

  //<Image source={randomGuy} resizeMode='contain' style={styles.profilePic} />

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/receiveAllAchievements`);
        const userList = response.data;
        setUserData(userList);

      } catch (error) {
        console.log(error.message);
      }
    };

    if (fontsLoaded) {
      fetchData();
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  
    return (
      <ScrollView>
      <View style={styles.container}>
         <View style={styles.header}>
               
            </View>
        <View style={styles.contentContainer}>
          <View style={styles.profilePanel}>
            <View style={styles.profilePicContainer}>
              <View style={styles.profilePicContainer}>
                <TouchableOpacity onPress={pickImage}>
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.profilePic}
                  />
                ) : (
                  <Image
                    source={defaultProfilePic}
                    style={styles.profilePic}
                  />
                )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.profileUsernameContainer}>
            <Text style={styles.usernameText}>{userInfo.username}</Text>
          </View>
          </View>

        <View style={styles.experienceWrapper}>
          <View style={styles.experienceContainer}>
           <View style={styles.topText}>
            <Text style={styles.levelText}>Level: {level}</Text>
            <Text style={styles.totalExperienceText}>Total Experience: {totalExperience}</Text>
           </View>
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={progress}
                width={250}
                height={30}
                borderRadius={10}
                color={'#FFD700'}
                unfilledColor={'#A9A9A9'}
                borderWidth={0}
              /> 
            </View>
            <Text style={styles.experienceText}>Level Up: {experience} / {maxExperience}</Text>
          </View>
        </View> 

          <View>
          </View>

          

          <View style={styles.acheivementPanel}>

          <Text style={styles.barChartTitle}>Workout Frequency</Text>
            <View style={styles.barChartContainer}>
              <BarChart/>
            </View>

          <Text style={styles.acheivementTitle}>Achievements</Text>
            <View style={styles.acheivementContainer}>
              <View style={styles.acheivementPicsContainer}>
              <Ionicons style={styles.trophyIconLeft} name="trophy-outline" size={60} color='grey'></Ionicons>
              <Ionicons style={styles.trophyIconMiddle} name="trophy-outline" size={60} color='grey'></Ionicons>
              <Ionicons style={styles.trophyIconRight} name="trophy-outline" size={60} color='grey'></Ionicons>
              </View>
             
              <View>
              <TouchableOpacity
                style={styles.viewAcheivements}
                onPress={() => {navigation.navigate('Achievement');
                                console.log("badge info ---> ", badgeInfo?.side)
                                console.log('Current selected Image ---> ', selectedImage)}}>
                  <Text style={styles.viewAcheivementsText}>View all achievements</Text>
                  </TouchableOpacity>
              </View>
            </View>
            </View>

            <TouchableOpacity
             onPress={() => {logout()}}
             style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
       
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

      container: {
        flex: 1,
        marginBottom: 0,
      },

      header: {
        position: 'absolute',
        top: 10,
        left: 10,
    },

    contentContainer: {
        flex: 1,
        marginLeft: 40,
        marginRight: 40,
      },

      profilePanel: {
        margin: 20,
      },

      profilePicContainer: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },

      profilePic: {
        height: 130,
        width: 130,
        borderRadius: 65,
      },

      profileUsernameContainer: {
        marginTop: 10,
      },

      usernameText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '700',
        fontFamily: 'MontserratSemiBold',
      },

      followsContainer: {
        marginTop: 10,
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      leftFollowers: {
        flex: 1,
        alignItems: 'center',
      },
      rightFollowing: {
        flex: 1,
        alignItems: 'center',
      },
      followersText: {
        fontWeight: '400',
        fontSize: 16,
        marginBottom: 5,
      },
      followingText: {
        fontWeight: '400',
        fontSize: 16,
        marginBottom: 5,
      },
      followersNumber: {
        fontWeight: '400',
        fontSize: 16,
      },
      followingNumber: {
        fontWeight: '400',
        fontSize: 16,
      },


      acheivementTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'MontserratSemiBold'
      },

      barChartTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'MontserratSemiBold',
        marginBottom: 10,
      },

      acheivementPanel: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
      },

      acheivementContainer: {
        height: 160,
        width: 350,
        borderColor: '#CCCCCC',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 40,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },

      barChartContainer: {
        height: 260,
        width: 350,
        alignItems: 'center',
        paddingRight: 20,
        borderColor: '#CCCCCC',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 40,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },

      acheivementPicsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        marginBottom: 30,
      },

      acheivementPic1: {
        height: 75,
        width: 75,
      },

      viewAcheivements: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 5,
        width: '53%',
        alignSelf: 'center',
        backgroundColor: '#3498db'
      },

      viewAcheivementsText: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'MontserratMedium'
      },


    logoutButton: {
        marginTop: 'auto',
        marginBottom: 40,
        alignSelf: 'stretch',
        backgroundColor: '#3498db',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC'
      },

      logoutButtonText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
        fontFamily: 'MontserratSemiBold'
      },

      trophyIconLeft:{
        marginLeft: 20,
      },
      trophyIconMiddle:{
      },
      trophyIconRight:{
        marginRight: 20,
      },


      experienceWrapper:{
        alignItems: 'center',
        justifyContent: 'center'
      },

      experienceContainer:{
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      
        topText: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '80%',
        },
        levelText: {
          fontSize: 18,
          fontWeight: 'bold',
          marginTop: 5,
          marginBottom: 5,
          alignSelf: 'flex-end',
          fontFamily: 'MontserratSemiBold'
        },
        totalExperienceText: {
          fontSize: 14,
          marginTop: 15,
          marginBottom: 5,
          alignSelf: 'flex-start',
          fontFamily: 'MontserratMedium'
        },
        experienceText: {
          fontSize: 16,
          marginBottom: 5,
          marginTop: 10,
          fontFamily: 'MontserratMedium'
        },
      
        progressBarContainer: {
          position: 'relative',
        },
})

export default ProfileScreen;
