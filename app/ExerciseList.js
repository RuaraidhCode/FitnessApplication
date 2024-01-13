import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { Ionicons } from 'react-native-vector-icons';
import { BASE_URL } from '../config';
import NewExerciseModal from './NewExerciseModal';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';


const ExerciseList = () => {
  const [exerciseDetails, setExerciseList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isNewExerciseModalVisible, setNewExerciseModalVisible] = useState(false);
  const navigation = useNavigation();



  const handleSaveExercise = (bodyPart, category, exerciseName) => {
    // Make an Axios POST request here
    const exerciseData = {
      bodyPart: bodyPart,
      category: category,
      exerciseName: exerciseName,
    };

    axios
      .post(`${BASE_URL}/api/newExercise`, exerciseData)
      .then((response) => {
        // Handle the response from the backend
        console.log('Exercise created successfully:', response.data);
        if (response.data.success) {
          // Call the function to fetch data again
          fetchData();
        }
      })
      .catch((error) => {
        // Handle errors
        console.error('Error creating exercise ---> ' + exerciseData.bodyPart + ' ' + exerciseData.category + ' ' + exerciseData.exerciseName, error);
      });
  };


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/exercise`);
      const exerciseListData = response.data;

      setExerciseList(exerciseListData);
    } catch (error) {
      console.log(error.message);
    }
  };


  const filterExercises = () => {
    if (searchQuery === '') {
      setFilteredExercises([]);
    } else {
      const filtered = exerciseDetails.filter((exercise) =>
        exercise.exercise_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  };

  const dataToRender = searchQuery ? filteredExercises : exerciseDetails;

  const exerciseGroups = dataToRender.reduce((groups, exercise) => {
    const startingLetter = exercise.exercise_name.charAt(0).toUpperCase();
    if (!groups[startingLetter]) {
      groups[startingLetter] = [];
    }
    groups[startingLetter].push(exercise);
    return groups;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.topRowBtns}>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => setNewExerciseModalVisible(true)}
          >
          <Text style={styles.newButtonText}>New</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('Test')}
          >
          <Text style={styles.newButtonText}>Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('Level Test')}
          >
          <Text style={styles.newButtonText}>Level Testing</Text>
          </TouchableOpacity>
        
        <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setSearchVisible(!isSearchVisible)} // Toggle the visibility state
          >
            <Ionicons name="search" size={20} color="#777" />
          </TouchableOpacity>
        </View>
        {isSearchVisible && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search for an exercise..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="always"
          />
        )}

            <NewExerciseModal
                isVisible={isNewExerciseModalVisible}
                onClose={() => setNewExerciseModalVisible(false)}
                onSave={handleSaveExercise} 
            />

      <FlatList
        data={Object.entries(exerciseGroups)}
        renderItem={({ item }) => (
          <View style={styles.groupContainer}>
            <Text style={styles.groupHeading}>{item[0]}</Text>
            {item[1].map((exercise, index) => (
              <View key={index} style={styles.exerciseListContainer}>
                <View style={styles.exerciseInfoContainer}>
                  <Text style={styles.exerciseName}>{exercise.exercise_name}</Text>
                  <Text style={styles.body_part}>{exercise.body_part}</Text>
                </View>
                <Text style={styles.equipment}>{exercise.equipment}</Text>
              </View>
            ))}
          </View>
        )}
        keyExtractor={(item) => item[0]} // Use the starting letter as the key
        ItemSeparatorComponent={() => <View style={styles.separator} />} // Add separator between groups
      />
    </View>
  );
};
  





  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 10,
    },

    topRowBtns: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    searchButton: {
      padding: 10,
    },

    newButton: {
      padding: 10,
    },

    newButtonText: {
     fontWeight: 'bold', 
    },
    
    searchInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    exerciseListContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: 10,
      borderRadius: 8,
      elevation: 3,
    },
    exerciseInfoContainer: {
      flex: 2,
      paddingRight: 10,
    },
    exerciseName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    body_part: {
      fontSize: 14,
      color: '#777',
    },
    equipment: {
      flex: 1,
      fontSize: 14,
      color: '#777',
      textAlign: 'right',
    },
    separator: {
      height: 1,
      marginVertical: 10,
    },

    groupContainer: {
      marginBottom: 20
    },

    groupHeading:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      paddingLeft: 10,
    },

  });
  
export default ExerciseList;