import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddGoalModal from './AddGoalModal';
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
    const [latestGoalId, setLatestGoalId] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [achievementData, setAchievementData] = useState([]);




    const handleSaveGoal = async (newGoal) => {
      const formattedStartDate = moment(newGoal.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const formattedTargetDate = moment(newGoal.targetDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    
      const newId = latestGoalId + 1;
      setLatestGoalId(newId); // Update the state first
    
      const updatedGoals = [...goals, { ...newGoal, id: newId }];
      setGoals(updatedGoals);
    
      await storeGoals(updatedGoals); // Store the updated goals in AsyncStorage
      await AsyncStorage.setItem(`@LatestGoalId_${userInfo.user_id}`, newId.toString()); // Store the latestGoalId
      setAddGoalModalVisible(false);
    
      fetchGoalAchievementData();
    
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
          console.log('Successfully sent selected goal to the backend:', response.data);
        })
        .catch((error) => {
          console.error('Error sending selected goal to the backend:', error);
        });
    };
    

        

    const storeGoals = async (goals) => {
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
    }, []);
        

    // Function to delete a goal
    const deleteGoal = async (goalId) => {
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
  }, [route.params?.newGoal]);

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
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
                        <Text style={styles.goalCategory}>{goal.category}</Text>
                        <Text style={styles.goalName}>{goal.goalDescription}</Text>
                        <Text style={styles.goalStartDate}>Target Date: {goal.targetDate}</Text>
                        <View style={styles.trashContainer}>
                            <Text style={styles.goalTargetDate}>Start Date: {goal.startDate}</Text>
                            {/* Option to delete a goal */}
                            <TouchableOpacity onPress={() => deleteGoal(goal.id)} style={styles.deleteButton}>
                                <Ionicons name="trash-outline" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            ) : null}
        </View>

        {/* Add New Goal */}
        <TouchableOpacity onPress={() => setAddGoalModalVisible(true)} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add New Goal</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => setShowTipsModal(true)}
            style={styles.tipsButton}
          >
            <Text style={styles.tipsButtonText}>How to Set Goals</Text>
          </TouchableOpacity>
        {achievementData.map((achievement) =>
        achievement.rank === 'Bronze' && (
            <BronzeModalHidden modalVisible={modalVisible} closeModal={closeModal} selectedAchievement={selectedAchievement} />
        )
      )}
    

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
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'white'
    },
    goalCategory: {
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 20,
    },
    goalName: {
        fontSize: 22,
        marginTop: 5,
        marginBottom: 20,
    },
    goalDescription: {
        marginTop: 5,
    },
    goalStartDate: {
        marginTop: 5,
        color: '#888',
        fontSize: 18,
        marginBottom: 20,
    },

    trashContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    goalTargetDate: {
        color: '#888',
        fontSize: 18,
        alignSelf: 'flex-start'
    },

    deleteButton: {
        alignSelf: 'flex-end',
    },
    addButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
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

      tipsButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    tipsButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Goals;
