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
    
        if (hasFirstWorkout && !hasBronzeAchievement) {
          
          const achievement = achievementList.find((achievement) => achievement.achievement_id === 1);
          openModal(achievement);

          const achievementToSend = 1;
          axios.post(`${BASE_URL}/api/updateGoalAchievement`, { userInfo: userInfo, achievementToSend })

          axios.post(`${BASE_URL}/api/updateGoalAchievement`, { userInfo: userInfo, achievementToSend })

          const xpAmount = 25;
  
             await axios.post(`${BASE_URL}/api/earnXp?user_id=${userInfo.user_id}&xpAmount=${xpAmount}`, { xpAmount });
            console.log('Successfully sent 25 experience to the backend: ', xpAmount);

        } else {
          console.log('Workout_count = 1 is false or achievement_id !== 1 is false')
        }

        if (hasFifthWorkout && !hasSilverAchievement) {
          
          const achievement = achievementList.find((achievement) => achievement.achievement_id === 6);
          openSilverModal(achievement);

          const achievementToSend = 6;
          axios.post(`${BASE_URL}/api/updateGoalAchievement`, { userInfo: userInfo, achievementToSend })

          const xpAmount = 50;
  
          await axios.post(`${BASE_URL}/api/earnXp?user_id=${userInfo.user_id}&xpAmount=${xpAmount}`, { xpAmount });
         console.log('Successfully sent 50 experience to the backend: ', xpAmount);


        } else {
          console.log('Workout_count = 1 is false or achievement_id !== 1 is false')
        }

      } catch (error) {
        console.log(error.message);
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/workoutHistory?user_id=${userInfo.user_id}`);
        const workoutHistory = response.data;

        const expandedStates = new Array(workoutHistory.length).fill(false);
        setExpandedCards(expandedStates);
  
        setWorkoutHistory(workoutHistory);
        console.log('all attribute for workout history --> ', workoutHistory)
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
                    <Text style={{textAlign: 'center', fontWeight: '500', fontFamily: 'MontserratMedium'}}>New Workout</Text>
                    </TouchableOpacity>
                <TouchableOpacity  onPress={() => navigation.navigate('ExerciseList')}
                    style={styles.rightPanel}>
                    <Text style={{textAlign: 'center', fontWeight: '500', fontFamily: 'MontserratMedium'}}>View Exercises</Text>
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
              {workoutHistoryItem.workout_date.substring(0, 10)}
            </Text>
              <Text style={styles.duration}>
                {workoutHistoryItem.duration}
              </Text>
            </View>
            {expandedCards[index] && (
              <View style={styles.exercisesContainer}>
                {workoutHistoryItem.details.map((exerciseDetail, exerciseIndex) => (
                  <View key={exerciseIndex} style={styles.exerciseDetail}>
                    <Text style={styles.exerciseName}>{exerciseDetail.exercise_name}</Text>
                    {exerciseDetail.sets_and_reps && (
                      <View style={styles.setsContainer}>
                        {exerciseDetail.sets_and_reps.map((set, setIndex) => (
                          <View key={setIndex} style={styles.setRow}>
                            <Text style={styles.setText}>Set {set.setNumber}:</Text>
                            <Text style={styles.setText}>Reps: {set.reps}</Text>
                            <Text style={styles.setText}>Weight: {set.weight}</Text>
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
        fontFamily: 'MontserratSemiBold'
    },

    setsContainer: {
      marginTop: 8,
    },

    setRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },

    setText: {
      fontSize: 14,
      color: '#444444',
      fontFamily: 'MontserratMedium'
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
      backgroundColor: '#ffffff',
      marginVertical: 10,
      padding: 15,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    /*  expandedCard: {
        paddingBottom: 20,
        borderBottomWidth: 0,
      }, */
     cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
      date: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      workoutName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'MontserratSemiBold'
      },
      duration: {
        fontSize: 16,
        color: '#666666',
        fontFamily: 'MontserratMedium'
      },
      exercisesContainer: {
        marginTop: 15,
      },
      exerciseDetail: {
        marginBottom: 15,
      },
      exerciseName: {
        fontSize: 16,
        color: '#333333',
        fontFamily: 'MontserratSemiBold'
      },
      set: {
        fontSize: 14,
      },

})