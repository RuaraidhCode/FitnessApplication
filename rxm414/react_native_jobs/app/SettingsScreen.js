import React, { useState, useEffect, useContext, createContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Button, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from '../config';
import NewPicker from './NewPicker';


const SettingsScreen = ({ route }) => {
  
  
  const { userInfo } = useContext(AuthContext);
  const [selectedSex, setSelectedSex] = useState('');
  const [selectedHeight, setSelectedHeight] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [isBMIModalVisible, setIsBMIModalVisible] = useState(false);
  const [heightInMeters, setHeightInMeters] = useState();
  const [BMIUser ,setBMIUser] = useState();
  const [userBMIRange, setUserBMIRange] = useState('');
  const [isProfilePictureModalVisible, setIsProfilePictureModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    // When the component mounts, load the previously stored values
    console.log('loading stored valuessss')
    loadStoredValues();
  }, []);

  const storeValues = async () => {
    try {
      // Save the personal metrics values to AsyncStorage
      const userId = userInfo.user_id;
      const metrics = {
        age: selectedAge,
        weight: selectedWeight,
        height: selectedHeight,
        sex: selectedSex,
      };
      await AsyncStorage.setItem(`@PersonalMetrics_${userId}`, JSON.stringify(metrics));
    } catch (error) {
      console.error('Error storing personal metrics:', error);
    }
  };

  const loadStoredValues = async () => {
    try {
      const userId = userInfo.user_id;
      const storedMetrics = await AsyncStorage.getItem(`@PersonalMetrics_${userId}`);
      console.log('Stored metrics:', storedMetrics);
      console.log('User ID:', userId);
  
      if (storedMetrics) {
        const parsedMetrics = JSON.parse(storedMetrics);
        setSelectedAge(parsedMetrics.age);
        setSelectedWeight(parsedMetrics.weight);
        setSelectedHeight(parsedMetrics.height);
        setSelectedSex(parsedMetrics.sex);
      }
    } catch (error) {
      console.error('Error loading stored personal metrics:', error);
    }
  };

  useEffect(() => {
    // When any of the selected metrics change, save the updated values to AsyncStorage
    
    storeValues();
  }, [selectedAge, selectedWeight, selectedHeight, selectedSex]);



  function handleUserBMI() {
    if (selectedHeight !== '' && selectedWeight !== '') {
      const [feet, inches] = selectedHeight.split(',').map((part) => parseInt(part.trim()));
  
      if (!isNaN(feet) && !isNaN(inches)) {
        const totalInches = feet * 12 + inches;
        const heightInMeters = totalInches * 0.0254;
  
        const BMIUser = calculateBMI(selectedWeight, heightInMeters);
        setBMIUser(calculateBMI(selectedWeight, heightInMeters));
  
        if (BMIUser < 18.5) {
          setUserBMIRange("You are in the 'underweight' range");
        } else if (BMIUser > 18.5 && BMIUser < 24.9) {
          setUserBMIRange("You are in the 'healthy' range");
        } else if (BMIUser > 24.9 && BMIUser < 29.9) {
          setUserBMIRange("You are in the 'overweight' range");
        } else if (BMIUser > 29.9 && BMIUser < 34.9) {
          setUserBMIRange("You are in the 'obesity' range");
        } else if (BMIUser > 40) {
          setUserBMIRange("You are in the 'morbid obesity' range");
        }
      } else {
        setUserBMIRange("Invalid height format");
      }
    } else {
      setUserBMIRange("Please input your 'height' and 'weight'");
    }
  }
  
  function calculateBMI(weightKg, heightM) {
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  }



    const [isSexModalVisible, setIsSexModalVisible] = useState(false);

    const handleSexOptionPress = (selectedSex) => {
        setSelectedSex(selectedSex);
        setIsSexModalVisible(false);
      
        // Make an API call to your backend server to send the selected sex
        axios.post(`${BASE_URL}/api/updateSex`, { sex: selectedSex, userInfo })
          .then((response) => {
            console.log('Successfully sent selected sex to the backend:');
        
            
          })
          .catch((error) => {
            console.error('Error sending selected sex to the backend:', error);
          });
      };


      
      const createHeightOptions = () => {
        const options = [];
        for (let feet = 8; feet >= 4; feet--) {
          for (let inch = 11; inch >= 0; inch--) {
            options.push(`${feet} ft, ${inch} in`);
          }
        }
        return options;
      };

      const handleHeightOptionPress = (selectedHeight) => {
        setSelectedHeight(selectedHeight);
        setDefaultSelectedHeight(selectedHeight);
        setIsHeightModalVisible(false);

        axios.post(`${BASE_URL}/api/updateHeight`, { height: selectedHeight, userInfo })
          .then((response) => {
            console.log('Successfully sent selected height to the backend:');
        
            
          })
          .catch((error) => {
            console.error('Error sending selected height to the backend:', error);
          });
      };

    const [isHeightModalVisible, setIsHeightModalVisible] = useState(false);
    const [defaultSelectedHeight, setDefaultSelectedHeight] = useState('6 ft, 0 in');
    const heightOptions = createHeightOptions();



    const [weight, setWeight] = useState('');
    const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);


      const handleWeightOptionPress = (selectedWeight) => {
        setSelectedWeight(selectedWeight);
        setIsWeightModalVisible(false);

        axios.post(`${BASE_URL}/api/updateWeight`, { weight: selectedWeight, userInfo })
          .then((response) => {
            console.log('Successfully sent selected weight to the backend:');
        
            
          })
          .catch((error) => {
            console.error('Error sending selected weight to the backend:', error);
          });
      };



    const [age, setAge] = useState('');
    const [isAgeModalVisible, setIsAgeModalVisible] = useState(false);


      const handleAgeOptionPress = (selectedAge) => {
        setSelectedAge(selectedAge);
        setIsAgeModalVisible(false);

        axios.post(`${BASE_URL}/api/updateAge`, { age: selectedAge, userInfo })
          .then((response) => {
            console.log('Successfully sent selected age to the backend:');
            
          })
          .catch((error) => {
            console.error('Error sending selected age to the backend:', error);
          });
      };
      




  return (
    <ScrollView>
    <View style={styles.container}>  
      <Text style={styles.headingText}>Personal Metrics</Text>

      <TouchableOpacity
        style={styles.settingButton}
        onPress={() => {setIsBMIModalVisible(true)
                        handleUserBMI();
                      }}
      >
        <Text style={styles.settingButtonText}>Check BMI</Text>
        <Ionicons style={styles.arrowIcon} name="arrow-forward-outline" size={25} color='white'></Ionicons>
      </TouchableOpacity>



      <TouchableOpacity
        style={styles.settingButton}
        onPress={() => setIsAgeModalVisible(true)} // Show the modal when the button is pressed
      >
        <Text style={styles.settingButtonText}>Age</Text>
        <Text style={styles.rightSideButtonText}>{selectedAge}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.settingButton}
        onPress={() => setIsHeightModalVisible(true)}
      >
        <Text style={styles.settingButtonText}>Height</Text>
        <Text style={styles.rightSideButtonText}>{selectedHeight}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingButton}
        onPress={() => setIsWeightModalVisible(true)} // Show the modal when the button is pressed
      >
        <Text style={styles.settingButtonText}>Weight</Text>
        <Text style={styles.rightSideButtonText}>{selectedWeight ? selectedWeight + ' kg' : ''}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingButton}
        onPress={() => setIsSexModalVisible(true)}
      >
        <Text style={styles.settingButtonText}>Sex</Text>
        <Text style={styles.rightSideButtonText}>{selectedSex}</Text>
      </TouchableOpacity>


        <Modal
        animationType="fade"
        transparent={true}
        visible={isBMIModalVisible}
        onRequestClose={() => setIsBMIModalVisible(false)}
        >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeaderText}>Your BMI is:</Text>
              <Text style={styles.BMIText}>{BMIUser}</Text>
              <Text style={styles.BMIRangeText}>{userBMIRange}</Text>
              <View style={styles.BMIInfoContainer}>
              <Text>Underweight: BMI less than 18.5</Text>
              <Text>Normal Weight: BMI 18.5 to 24.9</Text>
              <Text>Overweight: BMI 25 to 29.9</Text>
              <Text>Obesity Class I: BMI 30 to 34.9</Text>
              <Text>Obesity Class II: BMI 35 to 39.9</Text>
              <Text>Obesity Class III (Morbid Obesity): BMI 40 or greater</Text>
              </View>
              <TouchableOpacity
               style={styles.modalButton}
               onPress={() => setIsBMIModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>


        <Modal
        animationType="fade"
        transparent={true}
        visible={isSexModalVisible}
        onRequestClose={() => setIsSexModalVisible(false)}
        >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSexOptionPress('Male')}
            >
                <Text style={styles.modalOptionText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSexOptionPress('Female')}
            >
                <Text style={styles.modalOptionText}>Female</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>



         <NewPicker
        isVisible={isHeightModalVisible}
        pickerItems={heightOptions}
        selectedPickerValue={selectedHeight}
        onSelect={(value) => {
          handleHeightOptionPress(value);
          handleUserBMI();
        }}
        onClose={() => setIsHeightModalVisible(false)}
        pickerLabel="Select Height"
        pickerHeight={250}
        pickerBackgroundColor={'rgba(0, 0, 0, 0.5)'}
      />


      <Modal
        animationType="fade"
        transparent={true}
        visible={isWeightModalVisible}
        onRequestClose={() => setIsWeightModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Enter Weight (kg)</Text>
            <TextInput
              style={styles.ageAndWeightInput}
              keyboardType="numeric"
              value={selectedWeight}
              onChangeText={setSelectedWeight}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {handleWeightOptionPress(selectedWeight); handleUserBMI();}}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Modal
        animationType="fade"
        transparent={true}
        visible={isAgeModalVisible}
        onRequestClose={() => setIsAgeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Enter Age</Text>
            <TextInput
              style={styles.ageAndWeightInput}
              keyboardType="numeric"
              value={selectedAge}
              onChangeText={setSelectedAge}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleAgeOptionPress(selectedAge)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  settingButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    borderRadius: 5,
    borderStartWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center', // Align button content vertically
    justifyContent: 'space-between', // Space between text and icon
  },
  settingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
  },

  rightSideButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },

  arrowIcon: {
    alignSelf: 'flex-end'
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalHeaderText: {
    marginBottom: 20,
    fontSize: 18,
  },
  BMIText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  BMIRangeText:{
    fontSize: 18,
    marginBottom: 40,
  },
  ageAndWeightInput: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    fontSize: 24,
    textAlign: 'center',
    height: 40,
    width: 60
  },
  modalContentHeight: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },

  modalOption: {
    backgroundColor: '#F5F5F5',
    borderWidth: 0.5,
    height: 40,
    width: 80,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  modalOptionText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  
  profilePictureModalContent: {
    backgroundColor: '#fff',
    margin: 40,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  cameraModalOption:{
    backgroundColor: '#3498db',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    height: 45,
    width: 150,
    borderRadius: 10,
    marginVertical: 10
  },
  cameraModalOptionText:{
    fontSize: 18,
    color: 'white',
  },

  modalButton: {
    marginTop: 20,
    height: 30,
    width: 60,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  BMIInfoContainer: {
    justitfyContent: 'left'
  },


  profilePicButtonContainer:{
    alignItems: 'center',
    borderRadius: 50
  },

  profilePic:{
    height: 130,
    width: 130,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 65,
  }
});

export default SettingsScreen;