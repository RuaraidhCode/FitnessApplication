import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Axios from 'axios';
import { BASE_URL } from '../config';

const AddGoalScreen = ({ route }) => {
  const navigation = useNavigation();
  const [category, setCategory] = useState('');
  const [showPicker, setShowPicker] = useState(false); // State to manage the visibility of the picker
  const [name, setName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [categories, setCategories] = useState([]); // State to hold the available categories

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get(`${BASE_URL}/api/goals`);
      console.log('Response:', response.data);
      const categoriesData = response.data; // Ensure that response.data contains the correct data
      setCategories(categoriesData);
      console.log('categories:', categoriesData);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to handle saving the new goal
  const handleSaveGoal = () => {
    const newGoal = {
      id: new Date().getTime(),
      category,
      name,
      targetDate,
      isAchieved: false,
    };
    // Navigate back to the Goals screen and pass the new goal data as a parameter
    navigation.navigate('Goals', { newGoal });
  };

  const handleCancel = () => {
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Goal</Text>
      {/* Category Picker */}
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setShowPicker(true)} // Open the picker on press
      >
        <Text>{category ? category : 'Select a Category'}</Text>
      </TouchableOpacity>
      {showPicker && (
        <Picker
        selectedValue={category}
        onValueChange={(itemValue) => {
          setCategory(itemValue);
          setShowPicker(false); // Close the picker after selecting an option
        }}
      >
        <Picker.Item label="Select a Category" value="" />
        {categories.map((categoryItem) => (
          <Picker.Item key={categoryItem} label={categoryItem} value={categoryItem} />
        ))}
      </Picker>
      )}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Target Date (e.g., YYYY-MM-DD)"
        value={targetDate}
        onChangeText={setTargetDate}
      />
      <TouchableOpacity onPress={handleSaveGoal} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#AD40AF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddGoalScreen;
