import React, {useState, useEffect, useContext} from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { BASE_URL } from '../config';
import BronzeModalHidden from './BronzeModalHidden';
import SilverModalHidden from './SilverModalHidden';


const Exercise = () => {
  const { userInfo } = useContext(AuthContext);
    const navigation = useNavigation();
    const [workoutHistoryCards, setWorkoutHistory] = useState([]);
    const [expandedCards, setExpandedCards] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [silverModalVisible, setSilverModalVisible] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [achievementData, setAchievementData] = useState([]);
    const [achievementTrigger, setAchievementTrigger] = useState(false);


    useEffect(() => {
      fetchData();
    }, []);

    useFocusEffect(
      React.useCallback(() => {
        fetchData();
      }, [])
    );


    const fetchData = async () => {

      try {
        const response = await axios.get(`${BASE_URL}/api/receiveAllAchievements`);
        const achievementList = response.data;
        setAchievementData(achievementList);

        const Otherresponse = await axios.get(`${BASE_URL}/api/workoutHistoryMaxCount?user_id=${userInfo.user_id}`);
        const userWorkoutHistory = Otherresponse.data;

        const lastResponse = await axios.get(`${BASE_URL}/api/receiveAchievement?user_id=${userInfo.user_id}`);
        const userAchievementList = lastResponse.data;
       

        const hasFirstWorkout = userWorkoutHistory.some(item => item.workout_count === 1);
        const hasBronzeAchievement = userAchievementList.some(item => item.achievement_id === 1);

        const hasFifthWorkout = userWorkoutHistory.some(item => item.workout_count === 5);
        const hasSilverAchievement = userAchievementList.some(item => item.achievement_id === 6);

        console.log('USER ACHIEVEMENT LIST -------> ', userAchievementList)

        console.log('workout count should be equal to 1 so should be true -------> ', hasFirstWorkout)
        console.log('achievement_id = 1 should be true so achievement_id !== 1 should be false -------> ', hasBronzeAchievement)
    
        if (hasFirstWorkout && !hasBronzeAchievement) {
          
          const achievement = achievementList.find((achievement) => achievement.achievement_id === 1);
          openModal(achievement);

          const achievementToSend = 1;
          axios.post(`${BASE_URL}/api/updateGoalAchievement`, { userInfo: userInfo, achievementToSend })

        } else {
          console.log('Workout_count = 1 is false or achievement_id !== 1 is false')
        }

        if (hasFifthWorkout && !hasSilverAchievement) {
          
          const achievement = achievementList.find((achievement) => achievement.achievement_id === 6);
          openSilverModal(achievement);

          const achievementToSend = 6;
          axios.post(`${BASE_URL}/api/updateGoalAchievement`, { userInfo: userInfo, achievementToSend })

        } else {
          console.log('Workout_count = 1 is false or achievement_id !== 1 is false')
        }

      } catch (error) {
        console.log(error.message);
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/workoutHistory?user_id=${userInfo.user_id}`);
        const workoutHistory = response.data;

        console.log('workout history ---->', workoutHistory)

        const expandedStates = new Array(workoutHistory.length).fill(false);
        setExpandedCards(expandedStates);
  
        setWorkoutHistory(workoutHistory);
        console.log('database data: ', workoutHistory)
      } catch (error) {
        console.log(error.message);
      }

    }; 

    const toggleCardExpansion = (index) => {
      const updatedExpandedCards = [...expandedCards];
      updatedExpandedCards[index] = !updatedExpandedCards[index];
      setExpandedCards(updatedExpandedCards);
    };

    const openModal = (achievement) => {
   
      setSelectedAchievement(achievement);
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
    };

    const openSilverModal = (achievement) => {
   
      setSelectedAchievement(achievement);
      setSilverModalVisible(true);
    };
  
    const closeSilverModal = () => {
      setSilverModalVisible(false);
    };


    return (
      <ScrollView>
        <View style={styles.container}>
            <View style={styles.topPanelsContainer}>
                <TouchableOpacity   onPress={() => navigation.navigate('NewWorkout')}
                    style={styles.leftPanel}>
                    <Text style={{textAlign: 'center', fontWeight: '500'}}>New Workout</Text>
                    </TouchableOpacity>
                <TouchableOpacity  onPress={() => navigation.navigate('ExerciseList')}
                    style={styles.rightPanel}>
                    <Text style={{textAlign: 'center', fontWeight: '500'}}>View Exercises</Text>
                    </TouchableOpacity>
            </View>
            
            {achievementData.map((achievement) =>
        achievement.rank === 'Bronze' && (
            <BronzeModalHidden modalVisible={modalVisible} closeModal={closeModal} selectedAchievement={selectedAchievement} />
        )
            )}

            {achievementData.map((achievement) =>
              achievement.rank === 'Silver' && (
                  <SilverModalHidden modalVisible={silverModalVisible} closeModal={closeSilverModal} selectedAchievement={selectedAchievement} />
        )
      )}



            <View>
                <Text style={styles.workoutHistoryTitle}>Workout History</Text>
            </View>
            <View style={styles.workoutHistoryContainer}>
        {workoutHistoryCards.map((workoutHistoryItem, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, expandedCards[index] && styles.expandedCard]}
            onPress={() => toggleCardExpansion(index)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.workoutName}>
                Workout ID: {workoutHistoryItem.workout_history_id}
              </Text>
              <Text style={styles.duration}>
                {workoutHistoryItem.duration}
              </Text>
            </View>
            {expandedCards[index] && (
              <View style={styles.exercisesContainer}>
                {workoutHistoryItem.details.map((exerciseDetail, exerciseIndex) => (
                  <View key={exerciseIndex}>
                    <Text style={styles.exerciseNameTitle}>{exerciseDetail.exercise_name}</Text>
                    {exerciseDetail.sets_and_reps && (
                      <View style={styles.setsContainer}>
                        {exerciseDetail.sets_and_reps.map((set, setIndex) => (
                          <View key={setIndex} style={styles.setRow}>
                            <Text style={styles.setIndexText}>Set {set.setNumber}:</Text>
                            <Text style={styles.setRepsText}>Reps: {set.reps}</Text>
                            <Text style={styles.setWeightText}>Weight: {set.weight}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
    </ScrollView>
  );
};



export default Exercise;


const styles = StyleSheet.create({

    container: {
        margin: 20,
    },

    topPanelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },

    leftPanel: {
        height: 100,
        width: 150,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
    },

    rightPanel: {
        height: 100,
        width: 150,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
    },

    
    workoutHistoryTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
    },

    setsContainer:{
    },

    setRow:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },

    setIndexText:{
      fontSize: 16,
    },

    setRepsText:{
      fontSize: 16,
    },

    setWeightText:{
      fontSize: 16,
    },



    workoutHistoryContainer: {
        marginTop: 20,
    },

    card: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: 'white',
      },
      expandedCard: {
        paddingBottom: 20,
        borderBottomWidth: 0,
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
      },
      date: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      workoutName: {
        fontSize: 16,
      },
      duration: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      exercisesContainer: {
        marginTop: 10,
      },
      exercise: {
        marginBottom: 10,
      },
      exerciseNameTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
      },
      set: {
        fontSize: 14,
      },

})