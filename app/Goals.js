import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddGoalModal from './AddGoalModal';
import DeleteModal from './DeleteConfirmationModal';
import CompleteGoalModal from './CompleteGoalModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import BronzeModalHidden from './BronzeModalHidden';
import GoalSettingTipsModal from './GoalSettingTipsModal';
import { BASE_URL } from '../config';
import moment from 'moment';

const Goals = () => {

    const [showTipsModal, setShowTipsModal] = useState(false);
    const [goals, setGoals] = useState([]);
    const { userInfo } = useContext(AuthContext);
    const route = useRoute();
    const [isAddGoalModalVisible, setAddGoalModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isCompleteGoalModalVisible, setCompleteGoalModalVisible] = useState(false);
    const [latestGoalId, setLatestGoalId] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [achievementData, setAchievementData] = useState([]);
    const [selectedGoalIdForDelete, setSelectedGoalIdForDelete] = useState(null);
    const [selectedGoalIdForComplete, setSelectedGoalIdForComplete] = useState(null);




    const handleSaveGoal = async (newGoal) => {
      const formattedStartDate = moment(newGoal.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const formattedTargetDate = moment(newGoal.targetDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    
     /* const newId = latestGoalId + 1;
      setLatestGoalId(newId); // Update the state first
    
      const updatedGoals = [...goals, { ...newGoal, id: newId }];
      setGoals(updatedGoals);
    
      await storeGoals(updatedGoals); // Store the updated goals in AsyncStorage
      await AsyncStorage.setItem(`@LatestGoalId_${userInfo.user_id}`, newId.toString()); // Store the latestGoalId
     */
    
      fetchGoalAchievementData();

      setAddGoalModalVisible(false);
    
      axios
        .post(`${BASE_URL}/api/addNewGoal`, {
          goal: {
            ...newGoal,
            startDate: formattedStartDate,
            targetDate: formattedTargetDate,
          },
          userInfo,
        })
        .then((response) => {
          fetchData();
          console.log('Successfully sent selected goal to the backend:', response.data);
        })
        .catch((error) => {
          console.error('Error sending selected goal to the backend:', error);
        });
    };


    const handleCompleteGoal = async (databaseGoalId) => {
      try {
        await axios.post(`${BASE_URL}/api/completeGoal`, { goalId: databaseGoalId });
        console.log('Successfully sent completed goal to the backend');
        console.log('Goal ID ---> ', databaseGoalId);

        fetchData();
        // Update the local state to reflect the completed status
      //  const updatedGoals = goals.map(goal => 
     //    goal.id === goalId ? { ...goal, status: 'Completed' } : goal
      //  );
     //   setGoals(updatedGoals);
    //    await storeGoals(updatedGoals); // Store the updated goals in AsyncStorage
  } catch (error) {
    console.error('Error:', error);
  }
};
    
const handleDeleteGoal = async (databaseGoalId) => {
  try {
    await axios.post(`${BASE_URL}/api/deleteGoal`, { goalId: databaseGoalId });
    console.log('Successfully sent deleted goal to the backend');
    console.log('Goal ID ---> ', databaseGoalId);
    fetchData();
} catch (error) {
console.error('Error:', error);
}};

        

   /*  const storeGoals = async (goals) => {
        try {
            const userId = userInfo.user_id;
            await AsyncStorage.setItem(`@StoredGoals_${userId}`, JSON.stringify(goals));
        } catch (error) {
            console.error('Error storing goals:', error);
        }
    };
    

   useEffect(() => {
        const loadStoredGoals = async () => {
            try {
                const userId = userInfo.user_id;
                const storedGoals = await AsyncStorage.getItem(`@StoredGoals_${userId}`);
                const storedLatestGoalId = await AsyncStorage.getItem(`@LatestGoalId_${userId}`);
                if (storedGoals) {
                    const parsedGoals = JSON.parse(storedGoals);
                    const updatedGoals = Array.isArray(parsedGoals) ? parsedGoals : [parsedGoals]; // Ensure parsedGoals is an array
                    console.log(updatedGoals);
                    setGoals(updatedGoals);
        
                    if (storedLatestGoalId) {
                        setLatestGoalId(Number(storedLatestGoalId));
                    }
                }
            } catch (error) {
                console.error('Error loading stored goals:', error);
            }
        };
        
    
        loadStoredGoals();
    }, []); */
        

    // Function to delete a goal
 /*   const deleteGoal = async (goalId) => {
        const updatedGoals = goals.filter((goal) => goal.id !== goalId);
        setGoals(updatedGoals);
        await storeGoals(updatedGoals); // Store the updated goals in AsyncStorage
    };

    const completeGoal = async (goalId) => {
      const updatedGoals = goals.filter((goal) => goal.id !== goalId);
      setGoals(updatedGoals);
      await storeGoals(updatedGoals); // Store the updated goals in AsyncStorage
  };
    

    // Function to add a new goal
  const addNewGoal = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  // Check if there's a new goal passed from AddGoalScreen and add it to goals list
  useEffect(() => {
    const newGoal = route.params?.newGoal;
    if (newGoal) {
      addNewGoal(newGoal);
    }
  }, [route.params?.newGoal]); */

  useEffect(() => {
    fetchData();
  }, []);

// onPress={() => handleDeleteGoal(goal.goal_id)}
// onPress={() => handleCompleteGoal(goal.goal_id)}
  const fetchData = async () => {

    const goalResponse = await axios.get(`${BASE_URL}/api/userGoals?user_id=${userInfo.user_id}`);
    const goalList = goalResponse.data;
    setGoals(goalList);

    try {
      const response = await axios.get(`${BASE_URL}/api/receiveAllAchievements`);
      const achievementList = response.data;
      setAchievementData(achievementList);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchGoalAchievementData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/checkUserGoalAchievement?user_id=${userInfo.user_id}`);
      const goalsList = response.data;
     
      if (goalsList.length === 0) {
       
        const achievement = achievementData.find((achievement) => achievement.achievement_id === 2);
        openModal(achievement);

        const achievementToSend = 2;

        axios.post(`${BASE_URL}/api/updateGoalAchievement`, { userInfo: userInfo, achievementToSend })

        const xpAmount = 25;

           await axios.post(`${BASE_URL}/api/earnXp?user_id=${userInfo.user_id}&xpAmount=${xpAmount}`, { xpAmount });
          console.log('Successfully sent 25 experience to the backend: ', xpAmount);

      } else {
        console.log('user goals ------> ', goalsList.length)
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const openModal = (achievement) => {
   
    setSelectedAchievement(achievement);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

    return (
        <View style={styles.container}>
            <ScrollView>
        <View style={styles.goalsList}>
        {goals.length > 0 ? (
    goals.map((goal) => (
        <View key={goal.id} style={styles.goalItem}>
                        {console.log('Current goal:', goal)}
                        <View style={styles.trashContainer}>
                        <Text style={styles.goalCategory}>{goal.goal_category}</Text>
                        <View style={styles.trash}>
                        <TouchableOpacity onPress={() => { setDeleteModalVisible(true); setSelectedGoalIdForDelete(goal.goal_id); }} style={styles.deleteButton}>
                                <Ionicons name="trash-outline" size={24} color="red" />
                            </TouchableOpacity>
                            <DeleteModal
                              isVisible={isDeleteModalVisible}
                              onClose={() => { setDeleteModalVisible(false); setSelectedGoalIdForDelete(null); }}
                              onDelete={() => handleDeleteGoal(selectedGoalIdForDelete)}
                          />
                            </View>
                        </View>
                        <Text style={styles.goalName}>{goal.goal_description}</Text>
                        <Text style={styles.goalStartDate}>Target Date: {goal.goals_target_date.slice(0, 10)}</Text>
                        <View style={styles.tickContainer}>
                            <Text style={styles.goalTargetDate}>Start Date: {goal.goals_start_date.slice(0,10)}</Text>
                            <TouchableOpacity onPress={() => { setCompleteGoalModalVisible(true); setSelectedGoalIdForComplete(goal.goal_id); }} style={styles.deleteButton}>

                                <Ionicons name="checkbox" size={24} color="#4CAF50" />
                            </TouchableOpacity>
                            <CompleteGoalModal
                              isVisible={isCompleteGoalModalVisible}
                              onClose={() => { setCompleteGoalModalVisible(false); setSelectedGoalIdForComplete(null); }}
                              onComplete={() => handleCompleteGoal(selectedGoalIdForComplete)}
                          />

                        </View>
                    </View>
                ))
            ) : null}
        </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setAddGoalModalVisible(true)} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add New Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => setShowTipsModal(true)}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>How to Set Goals</Text>
          </TouchableOpacity>
        {achievementData.map((achievement) =>
        achievement.rank === 'Bronze' && (
            <BronzeModalHidden modalVisible={modalVisible} closeModal={closeModal} selectedAchievement={selectedAchievement} />
        )
      )}
      </View>
    

        {isAddGoalModalVisible && (
            <AddGoalModal
                isVisible={isAddGoalModalVisible}
                onClose={() => setAddGoalModalVisible(false)}
                onSave={handleSaveGoal}
            />
        )}
         </ScrollView>
         <GoalSettingTipsModal
        isVisible={showTipsModal}
        onClose={() => setShowTipsModal(false)}
      />
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    goalsList: {
        marginBottom: 20,
    },
    goalItem: {
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: 'white'
    },
    goalCategory: {
      fontFamily: 'MontserratBold',
        fontSize: 25,
        marginBottom: 20,
    },
    goalName: {
      fontFamily: 'MontserratMedium',
        fontSize: 22,
        marginTop: 5,
        marginBottom: 20,
    },
    goalStartDate: {
        marginTop: 5,
        color: '#888',
        fontSize: 18,
        marginBottom: 20,
        fontFamily: 'MontserratMedium',
    },

    tickContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    trashContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
  },

    goalTargetDate: {
        color: '#888',
        fontSize: 18,
        alignSelf: 'flex-start',
        fontFamily: 'MontserratMedium',
    },

    deleteButton: {
        alignSelf: 'flex-end',
    },

    buttonContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between'
    },

    addButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: '45%'
    },
    
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: 'MontserratSemiBold',
    },



    modalContainerBronze:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CD7F32',
      },
      modalContainerSilver:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C0C0C0',
      },
      modalContainerGold:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFD700',
      },
    
      modalContent: {
        width: '80%',
        height: '55%',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50,
      },
      badgeTitle: {
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        marginBottom: 20,
      },
      imageContainer:{
          alignItems: 'center',
          marginBottom: 20,
      },
      badgePic:{
        height: 100,
        width: 100,
      },
      modalDescription: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 50,
      },
      achievementDateText:{
        textAlign: 'center',
        fontSize: 16,
        color: 'grey',
      },
      closeButtonContainer:{
          marginTop: 'auto',
          alignItems: 'center',
      },
      closeButton: {
        backgroundColor: '#3498db',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
      },
      closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
      },

    tipsButtonText: {
        color: '#fff',
        fontFamily: 'MontserratBold',
        fontSize: 16,
    },
});

export default Goals;
