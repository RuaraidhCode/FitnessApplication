import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import TimerComponent from './TimerComponent';
import CompletedWorkoutModal from './CompletedWorkoutModal';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL } from '../config';
import BronzeModalHidden from './BronzeModalHidden';

const NewWorkout = () => {
    const mainNavigation = useNavigation();
    const [exercises, setExercises] = useState([]);
    const { userInfo } = useContext(AuthContext);
    const [selectedExerciseName, setSelectedExerciseName] = useState('');
    const [isExerciseListModalVisible, setIsExerciseListModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [exerciseDetails, setExerciseList] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [isSearchVisible, setSearchVisible] = useState(true);
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(-1);
    const [selectedExerciseId, setSelectedExerciseId] = useState(null);
    const [isAddButtonPressed, setIsAddButtonPressed] = useState(false);
    const [isTimerStopped, setIsTimerStopped] = useState(false);
    const [savedTimerValue, setSavedTimerValue] = useState('');
    const [isCompletedWorkoutModalVisible, setIsCompletedWorkoutModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [achievementData, setAchievementData] = useState([]);
    const [userWorkoutHistory, setUserWorkoutHistory] = useState([]);
    
    const handleShowCompletedWorkoutModal = () => {
        setIsCompletedWorkoutModalVisible(true);
      };
    
      const handleButtonPress = () => {
        setIsAddButtonPressed(!isAddButtonPressed);
        setIsExerciseListModalVisible(false);
      };
    
      const handleExerciseSelection = (exerciseId, exerciseName) => {
        setSelectedExerciseId(exerciseId === selectedExerciseId ? null : exerciseId);
        setSelectedExerciseName(exerciseId === selectedExerciseId ? '' : exerciseName);
      };

      const handleStopTimer = (timerValue) => {
        setIsTimerStopped(true);
        setSavedTimerValue(timerValue);
      };
      
      const handleFinishButton = async () => {
        console.log('savedTimerValue:', savedTimerValue);
      
        const currentDate = new Date();
        console.log('current date -----> ', currentDate);

        const newWorkout = {
          workout: exercises,
          userInfo: userInfo,
          timerValue: savedTimerValue,
          currentDate: currentDate,
        };

        if (userWorkoutHistory.length > 0) {
          console.log('Would not initialise week_start_date')

          try {
            // Saving workout data to the backend
             await axios.post(`${BASE_URL}/api/saveWorkout`, { workout: newWorkout, userInfo });
            console.log('Successfully sent workout to the backend:');
        
          } catch (error) {
            console.error('Error saving workout:', error.message);
          }

        } else {
          console.log('Would initialise week_start_date')

          try {
            // Saving workout data to the backend
         
            await axios.post(`${BASE_URL}/api/initialiseWeekStartDate`, { workout: newWorkout, userInfo });
            console.log('Successfully initialized week_start_date');
        
          } catch (error) {
            console.error('Error saving workout:', error.message);
          }
        }
      
       


        const xpAmount = 10;


        try {
          // Saving workout data to the backend
           await axios.post(`${BASE_URL}/api/earnXp?user_id=${userInfo.user_id}&xpAmount=${xpAmount}`, { xpAmount });
          console.log('Successfully sent experience to the backend: ', xpAmount);
      
        } catch (error) {
          console.error('Error saving experience:', error.message);
        }

      };
      
      

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    filterExercises();
  }, [searchQuery]);

  useEffect(() => {
    if (isExerciseListModalVisible) {
      setSelectedExerciseId(null);
    }
  }, [isExerciseListModalVisible]);

  const fetchData = async () => {
    try {
        
      const response = await axios.get(`${BASE_URL}/api/exercise`);
      const exerciseListDataWithIds = response.data.map((exercise, index) => ({
        ...exercise,
        id: index.toString(),
      }));
      setExerciseList(exerciseListDataWithIds);

      const workoutHistoryResponse = await axios.get(`${BASE_URL}/api/workoutHistory?user_id=${userInfo.user_id}`);
      const userWorkoutHistoryData = workoutHistoryResponse.data
      setUserWorkoutHistory(userWorkoutHistoryData);

    } catch (error) {
      console.log(error.message);
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/receiveAllAchievements`);
      const achievementList = response.data;
      setAchievementData(achievementList);
    } catch (error) {
      console.log(error.message);
    }
  };


  const addExercise = () => {
    setExercises([...exercises, {
      exerciseName: selectedExerciseName,
      sets: [{ setNumber: 1, reps: 0, weight: 0 }]
    }]);
  };

  const removeExercise = (exerciseIndex) => {
    const updatedExercises = exercises.filter((_, index) => index !== exerciseIndex);
    setExercises(updatedExercises);
  };

  const addSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[exerciseIndex];
    const setNumber = exercise.sets.length + 1;
    exercise.sets.push({ setNumber, reps: 0, weight: 0, pressed: false });
    setExercises(updatedExercises);
  };

  const updateExerciseName = (exerciseIndex, exerciseName) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].exerciseName = exerciseName;
    setExercises(updatedExercises);
  };

  const updateReps = (exerciseIndex, setIndex, reps) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex].reps = reps;
    setExercises(updatedExercises);
  };

  const updateWeight = (exerciseIndex, setIndex, weight) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex].weight = weight;
    setExercises(updatedExercises);
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


  const openModal = (achievement) => {
   
    setSelectedAchievement(achievement);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
      
    <View style={styles.container}>
      <View style={styles.headerContentContainer}>
        <View style={styles.workoutTitle}>
          <Text style={styles.workoutTitleText}>Log Your Workout</Text>
        </View>
        <View style={styles.timerContainer}>
            <TimerComponent stopTimer={isTimerStopped}  onTimerStop={handleStopTimer} />
        </View>
        <View style={styles.finishButton}>
          <TouchableOpacity style={styles.finishButtonTouchable} onPress={() => {handleStopTimer(); handleShowCompletedWorkoutModal()}}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
          <CompletedWorkoutModal
                    isCompletedWorkoutModalVisible={isCompletedWorkoutModalVisible}
                    onClose={() => {
                        setIsCompletedWorkoutModalVisible(false);
                        mainNavigation.navigate('Main Exercise');}}
                    workoutData={exercises}
                    timerValue={savedTimerValue}
                    onFinish={handleFinishButton}
                    />

        </View>
      </View>

      {achievementData.map((achievement) =>
        achievement.rank === 'Bronze' && (
            <BronzeModalHidden modalVisible={modalVisible} closeModal={closeModal} selectedAchievement={selectedAchievement} />
        )
      )}


      <ScrollView>
      <View style={styles.exercisesContainer}>
        {exercises.map((exercise, exerciseIndex) => (
          <View key={exerciseIndex} style={styles.exerciseContainer}>
              <View style={styles.topExerciseCard}>
                    <View style={styles.exerciseNameContainer}>
                        <Text style={styles.exerciseNameTitle}>{exercise.exerciseName}</Text>
                    </View>
                    <View style={styles.repWeightHeader}>
                        <Text style={styles.repHeaderText}>Reps</Text>
                        <Text style={styles.weightHeaderText}>Weight</Text>
                        <TouchableOpacity style={styles.removeExerciseButton}
                                    onPress={() => removeExercise(exerciseIndex)}>
                        <Ionicons name="close-outline" size={18}></Ionicons>
                        </TouchableOpacity>
                    </View>
              </View>
            
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setContainer}>
                <Text style={styles.setNumberText}>Set {set.setNumber}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.repsInput}
                    placeholder="Reps"
                    keyboardType="numeric"
                    value={set.reps === 0 ? '' : set.reps.toString()}
                    onChangeText={(text) => updateReps(exerciseIndex, setIndex, parseInt(text) || 0)}
                  />
                  <TextInput
                    style={styles.weightInput}
                    placeholder="+kg"
                    keyboardType="numeric"
                    value={set.weight === 0 ? '' : set.weight.toString()}
                    onChangeText={(text) => updateWeight(exerciseIndex, setIndex, parseInt(text) || 0)}
                  />
                 <TouchableOpacity
                    style={[
                        styles.tickButton,
                        { backgroundColor: set.pressed ? '#4CAF50' : 'lightgrey' },
                    ]}
                    onPress={() => {
                        const updatedExercises = [...exercises];
                        updatedExercises[exerciseIndex].sets[setIndex].pressed = !set.pressed; // Toggle pressed property
                        setExercises(updatedExercises);
                    }}
                    >
                    <Ionicons name="checkmark-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exerciseIndex)}>
              <Ionicons name="add-circle-outline" size={24} color="#555" />
              <Text style={styles.addSetText}>Add Set</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Modal
        animationType='fade'
        transparent={true}
        visible={isExerciseListModalVisible}
        onRequestClose={() => {
            setIsExerciseListModalVisible(false);
          }}>
        <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setSearchVisible(!isSearchVisible)} 
        >
         
        </TouchableOpacity>

        <View style={styles.modalContent}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => setIsExerciseListModalVisible(false)}
                style={styles.backButton}
                >
                    <Ionicons name="close-outline" style={styles.backIcon}></Ionicons>
                </TouchableOpacity>
                <TouchableOpacity style={selectedExerciseId ? styles.addButtonPressed : styles.addButton}
                onPress={() => {
                    handleButtonPress();
                    addExercise(selectedExerciseName)
                }}
                >
                <Text style={ selectedExerciseId ? styles.addButtonTextPressed : styles.addButtonText
                    }
                >
                    Add
                </Text>
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
            <FlatList
            data={Object.entries(exerciseGroups)}
            renderItem={({ item }) => (
                <View style={styles.groupContainer}>
                <Text style={styles.groupHeading}>{item[0]}</Text>
                {item[1].map((exercise) => (
                    <TouchableOpacity
                        key={exercise.id}
                        style={[
                        styles.exerciseListContainer,
                        selectedExerciseId === exercise.id && { backgroundColor: 'lightgreen' },
                        ]}
                        onPress={() => 
                            handleExerciseSelection(exercise.id, exercise.exercise_name)}
                    >
                        <View style={styles.exerciseInfoContainer}>
                        <Text style={styles.exerciseName}>{exercise.exercise_name}</Text>
                        <Text style={styles.body_part}>{exercise.body_part}</Text>
                        </View>
                        <Text style={styles.equipment}>{exercise.equipment}</Text>
                    </TouchableOpacity>
                    ))}
                </View>
            )}
            keyExtractor={(item) => item[0]}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            </View>
            </View>
        </Modal>
        
        <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={() => {
                setIsExerciseListModalVisible(true);
            }} 
        >
            <Ionicons name="add-circle" size={30} color="#3498db" />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  headerContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  workoutTitle: {
  
  },
  workoutTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  finishButton: {

  },
  finishButtonTouchable: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exercisesContainer: {
    flex: 1,
  },
  exerciseContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F3F3F3',
  },
  topExerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
   removeExerciseButton: {
    height: 20,
    width: 40,
    borderRadius: 10,
    backgroundColor: '#FF7276',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseNameInput: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#555',
    marginBottom: 10,
  },
  exerciseNameContainer: {
    flex: 1,
    marginRight: 15,
},
  exerciseNameTitle: {
      fontSize: 18,
      fontWeight: 'bold'
  },
  setContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgrey'
  },
  setNumberText: {
    fontWeight: 'bold',
  },

  repWeightHeader: {
      flexDirection: 'row'
  },

  repHeaderText: {
      marginRight: 20,
  },

  weightHeaderText: {
      marginRight: 23,
},

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  repsInput: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: 'white',
    textAlign: 'center'
  },
  weightInput: {
    width: 50,
    height: 30,
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: 'white',
    textAlign: 'center'
  },
  tickButton: {
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 40,
    borderRadius: 10,
    backgroundColor: 'grey',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  addSetText: {
    marginLeft: 5,
    color: '#555',
    fontWeight: 'bold',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addExerciseText: {
    marginLeft: 5,
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 100,
    marginBottom: 200,
    padding: 20,
    borderRadius: 10,
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
    borderWidth: 1,
    borderColor: 'lightgrey'
  },


  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },


  topBar: {
      flexDirection: 'row',
      marginBottom: 10,
      justifyContent: 'space-between'
  },

  backButton: {
    height: 30,
    width: 30,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    height: 30,
    width: 50,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  addButtonPressed: {
    height: 30,
    width: 50,
    borderRadius: 10,
    backgroundColor: 'lightgreen',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  addButtonTextPressed: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },

  backIcon: {
    fontSize: 24,
  }


});

export default NewWorkout;

