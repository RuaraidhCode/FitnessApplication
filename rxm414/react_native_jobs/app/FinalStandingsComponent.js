import React, { useState, useEffect, useContext } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { BASE_URL } from '../config';

const FinalStandingsComponent = ({
 // leaderboardListData,
  userRank,
  startingWeight,
  mostRecentWeight,
  compId={compId},
  getRankBackgroundColor={getRankBackgroundColor},
  isCompetitionEnded={isCompetitionEnded}
}) => {

    const [leaderboardListData, setLeaderboardListData] = useState([]);
    const { userInfo } = useContext(AuthContext);
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
          fetchData();
        }, [])
      );

      useEffect(() => {
        if (isCompetitionEnded) {
          setIsModalVisible(true);
        }
      }, [isCompetitionEnded]);

    const fetchData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/receiveWeeklyProgess?user_id=${userInfo.user_id}`);
          const leaderboardList = response.data;
  
          if (leaderboardList[0].team_id === null) {
            try {
              console.log("Single Leaderboard Commencing")
              const response = await axios.get(`${BASE_URL}/api/finshedSoloLeaderboardList`);
              const leaderboardList = response.data;
        
              setLeaderboardListData(leaderboardList);
              
              const loggedInUserWeightChanges = leaderboardList.find(user => user.user_id === userInfo.user_id)?.weight_changes || [];
              setUserWeightChanges(loggedInUserWeightChanges);
        
              const userCompetitionEntry = leaderboardList.find(entry => entry.user_id === userInfo.user_id);
            if (userCompetitionEntry) {
              setCompId(userCompetitionEntry.comp_id); 
              console.log("compeition Id --> ", userCompetitionEntry.comp_id)
              console.log("leaderboard list --> ", leaderboardList)
            }
        
            } catch (error) {
              console.log(error.message);
            }
  
          } else {
            console.log("Team Leaderboard Commencing")
            const response = await axios.get(`${BASE_URL}/api/finshedTeamLeaderboardList`);
            const leaderboardList = response.data;
  
            setLeaderboardListData(leaderboardList);
        
            const loggedInUserWeightChanges = leaderboardList.find(user => user.user_id === userInfo.user_id)?.weight_changes || [];
            setUserWeightChanges(loggedInUserWeightChanges);
      
            const userCompetitionEntry = leaderboardList.find(entry => entry.user_id === userInfo.user_id);
          if (userCompetitionEntry) {
            setCompId(userCompetitionEntry.comp_id); 
            console.log("compeition Id --> ", userCompetitionEntry.comp_id)
            console.log("leaderboard list --> ", leaderboardList)
  
          }  
      
          }
        } catch (error) {
          console.log(error.message);
        }
      };

      const removeOldLeaderboard = () => {
        axios.post(`${BASE_URL}/api/removeOldLeaderboard`, { user_id: userInfo.user_id })
          .then((response) => {
            console.log('Successfully sent the remove old leaderboard POST request', userInfo.user_id );
          })
          .catch((error) => {
            console.error('Error sending the remove old leaderboard POST request:', error);
          });
        };
    


      
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Render the final standings leaderboard */}
        <View style={styles.leaderboardContainer}>
          {/* You can map through leaderboardListData and render each entry here */}
          {leaderboardListData
            .filter(entry => entry.comp_id === compId)
            .map((entry, index) => (
              <View
                key={index}
                style={[
                  styles.leaderboardEntry,
                  {
                    backgroundColor: getRankBackgroundColor(index + 1, entry.team_colour),
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  },
                ]}
              >
                <Text style={styles.rank}>{index + 1}</Text>
                <Text style={styles.username}>{entry.username} yaaah</Text>
                <Text style={styles.weight}>{entry.points} yaaah</Text>
              </View>
            ))}
        </View>
      </ScrollView>

      {/* Your existing congratulatory modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible} 
      >
        <View style={styles.congratulatoryModal}>
          <View style={styles.congratulatoryContent}>
            <Text style={styles.congratulatoryText}>Congratulations!</Text>
            <Text style={styles.rankText}>
              You finished <Text style={styles.bold}>rank {userRank}</Text> in the competition
            </Text>
            <Text style={styles.weightLossText}>
              You lost a total of <Text style={styles.bold}>{(startingWeight - mostRecentWeight).toFixed(1)}</Text> kilograms!
            </Text>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => {
                navigation.navigate('Compete');
                setIsModalVisible(false);
                removeOldLeaderboard();
              }}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    header: {
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      marginTop: 40,
    },
    leaderboardContainer: {
      backgroundColor: '#f5f5f5',
      padding: 10,
      borderRadius: 5,
    },
    
    leaderboardEntry: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      padding: 20,
      borderBottomWidth: 1,
      borderRadius: 10,
      borderBottomColor: '#ccc',
      backgroundColor: '#F1E0F5',
    },
    rank: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    username: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
    },
    weight: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  
    bottomButtonsContainer:{
     
    },
  
  
    updateWeightContainer: {
      backgroundColor: '#3498db',
       borderRadius: 10,
       paddingVertical: 12,
       paddingHorizontal: 20,
       marginHorizontal: 10,
       marginTop: 10,
     },
     updateWeightText: {
       color: 'white',
       fontWeight: 'bold',
       fontSize: 16,
       textAlign: 'center',
     },
  
     compMenuContainer: {
      backgroundColor: '#3498db',
       borderRadius: 10,
       paddingVertical: 12,
       paddingHorizontal: 20,
       marginHorizontal: 10,
       marginTop: 10,
     },
     compMenuText: {
       color: 'white',
       fontWeight: 'bold',
       fontSize: 16,
       textAlign: 'center',
     },
     startingStatsModalContainer:{
      flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    startingStatsModalContent: {
      width: '80%',
      height: '40%',
      backgroundColor: '#fff',
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
  },
  startingStatsTitle:{
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  enterStatsTitle:{
    marginTop: 30,
    textAlign: 'center',
    fontSize: 18,
  },
  
  previousWeightText:{
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    color: 'grey'
  },
  
  weightInput: {
    marginTop: 50,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    fontSize: 24,
    textAlign: 'center',
    height: 40,
    width: 60
  },
  doneButton: {
    marginTop: 50,
    height: 30,
    width: 60,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
      color: 'white',
      fontSize: 16,
    },
    joinCompetitionText:{
      fontSize: 18,
      textAlign: 'center',
      marginTop: '50%'
    },
  
    competitionTitle:{
      fontSize: 24,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 10,
    },
  
    competitionEndDate:{
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 30,
      color: 'grey'
    },
  
    teamPointsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 30, // You can adjust the margin as needed
    },
  
    teamBox: {
      backgroundColor: 'white', // Set your desired background color
      padding: 10,
      borderRadius: 8, // You can adjust the border radius for rounded corners
      borderWidth: 1,
      borderColor: 'gray', // You can set the border color
      alignItems: 'center',
    },
  
    teamName: {
      fontSize: 14,
      marginBottom: 5, // Adjust the margin as needed
    },
  
    teamPoints: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  
    trophyIcon: {
      alignSelf: 'center', // Center the trophy icon
      marginTop: 5, // Adjust the margin as needed
    },
  
    congratulatoryModal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    congratulatoryContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    congratulatoryText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
    },
    rankText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
    },
    weightLossText: {
      fontSize: 18,
      marginBottom: 40,
      textAlign: 'center',
    },
    bold: {
      fontWeight: 'bold',
    },
    closeModalButton: {
      backgroundColor: '#3498db',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 8,
      marginBottom: 5,
      alignItems: 'center',
      justifyContent: 'center',
      width: 100,
    },
    closeModalButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

export default FinalStandingsComponent;
