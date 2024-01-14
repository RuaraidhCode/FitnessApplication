import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FinalStandingsComponent from './FinalStandingsComponent';
import { BASE_URL } from '../config';

const Leaderboard = () => {
  const navigation = useNavigation();
  const { userInfo } = useContext(AuthContext);
  const [leaderboardListData, setLeaderboardListData] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [isUpdateWeightModalVisible, setIsUpdateWeightModalVisible] = useState(false);
  const [startingWeight , setStartingWeight] = useState(null);
  const [mostRecentWeight, setMostRecentWeight] = useState(null);
  const weekNumber = 1;
  const [compId, setCompId] = useState(null);
  const [userWeightChanges, setUserWeightChanges] = useState([]);
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth());
  const formattedCurrentDate = currentDate.toISOString().split('T')[0];
  const [showFinalStandings, setShowFinalStandings] = useState(false);
  const isCompetitionEnded = formattedCurrentDate >= new Date(leaderboardListData.find(entry => entry.comp_id === compId)?.comp_end_date);



  const calculateUserRank = () => {
    const sortedLeaderboard = [...leaderboardListData].sort((a, b) => b.points - a.points);
    const userIndex = sortedLeaderboard.findIndex((entry) => entry.user_id === userInfo.user_id);
    return userIndex === -1 ? null : userIndex + 7;
  };

  const userRank = calculateUserRank();

  useEffect(() => {
    const currentDate = new Date();
   //currentDate.setMonth(currentDate.getMonth() + 7);
   currentDate.setMonth(currentDate.getMonth());
    
    const formattedCurrentDate = currentDate.toISOString().split('T')[0];
    const competitionEndDate = leaderboardListData
      .find(entry => entry.comp_id === compId)?.comp_end_date
      .split('T')[0];
    

    if (formattedCurrentDate >= competitionEndDate) {
      // Set the state variable to true to show the final standings
      setShowFinalStandings(true);
      console.log("current date has reached comp end date")
    } else {

      console.log('current date has not yet reached comp end date', competitionEndDate)
    }
  }, [compId, leaderboardListData]);

  useEffect(() => {

    const currentDate = new Date();
     //currentDate.setMonth(currentDate.getMonth() + 7);
    currentDate.setMonth(currentDate.getMonth());
    
    const formattedCurrentDate = currentDate.toISOString().split('T')[0];
    const formattedCompetitionEndDate = leaderboardListData
      .find(entry => entry.comp_id === compId)?.comp_end_date
      .split('T')[0];
    
    
    const runCompetitions = async () => {
      if (leaderboardListData.length > 0 && compId) {
        const userCompetitionEntry = leaderboardListData.find(entry => entry.user_id === userInfo.user_id);
        const isTeamCompetition = userCompetitionEntry && userCompetitionEntry.team_id !== undefined;
  
        if (isTeamCompetition) {
          const competitionEndDate = new Date(userCompetitionEntry.comp_end_date);
          if (formattedCurrentDate >= formattedCompetitionEndDate) {
            console.log("team competition function running!!!!!!!!!")
            await completedTeamCompLeaderboard();
          }
        } else {
          const competitionEndDate = new Date(leaderboardListData.find(entry => entry.comp_id === compId)?.comp_end_date);
          if (formattedCurrentDate >= formattedCompetitionEndDate) {
            console.log("solo competition function running!!!!!!!!!")
            await completedCompLeaderboard();
          }
        }
      }
    };
  
    runCompetitions();
  }, [currentDate, compId, leaderboardListData, userInfo]);
  
  


  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (userWeightChanges.length > 0) {
      setStartingWeight(userWeightChanges[0]);
    }
  }, [userWeightChanges]);

  useEffect(() => {
    if (userWeightChanges.length > 0) {
        setMostRecentWeight(userWeightChanges[userWeightChanges.length-1]);
    }
  }, [userWeightChanges]);


    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/receiveWeeklyProgess?user_id=${userInfo.user_id}`);
        const leaderboardList = response.data;

        if (leaderboardList[0].team_id === null) {
          try {
            console.log("Single Leaderboard Commencing")
            const response = await axios.get(`${BASE_URL}/api/leaderboardList`);
            const leaderboardList = response.data;
      
            setLeaderboardListData(leaderboardList);
            
            const loggedInUserWeightChanges = leaderboardList.find(user => user.user_id === userInfo.user_id)?.weight_changes || [];
            setUserWeightChanges(loggedInUserWeightChanges);
      
            const userCompetitionEntry = leaderboardList.find(entry => entry.user_id === userInfo.user_id);
          if (userCompetitionEntry) {
            setCompId(userCompetitionEntry.comp_id);
          }
      
          } catch (error) {
            console.log(error.message);
          }

        } else {
          console.log("Team Leaderboard Commencing")
          const response = await axios.get(`${BASE_URL}/api/teamLeaderboardList`);
          const leaderboardList = response.data;

          setLeaderboardListData(leaderboardList);
      
          const loggedInUserWeightChanges = leaderboardList.find(user => user.user_id === userInfo.user_id)?.weight_changes || [];
          setUserWeightChanges(loggedInUserWeightChanges);
    
          const userCompetitionEntry = leaderboardList.find(entry => entry.user_id === userInfo.user_id);
        if (userCompetitionEntry) {
          setCompId(userCompetitionEntry.comp_id)
        }  
    
        }
      } catch (error) {
        console.log(error.message);
      }
    };

const completedCompLeaderboard = () => {
axios.post(`${BASE_URL}/api/setCompletedCompLeaderboard`, { user_id: userInfo.user_id })
  .then((response) => {
    console.log('Successfully sent the completed comp leaderboard POST request');
    // Handle the response if needed
  })
  .catch((error) => {
    console.error('Error sending the completed comp leaderboard POST request:', error);
    // Handle the error if needed
  });
};

const completedTeamCompLeaderboard = () => {
  axios.post(`${BASE_URL}/api/setCompletedTeamCompLeaderboard`, { user_id: userInfo.user_id })
    .then((response) => {
      console.log('Successfully sent the completed comp leaderboard POST request');
      // Handle the response if needed
    })
    .catch((error) => {
      console.error('Error sending the completed comp leaderboard POST request:', error);
      // Handle the error if needed
    });
  };

 

  const handleWeightOptionPress = (selectedWeight, leaderboardList) => {
    return new Promise((resolve, reject) => {
    setSelectedWeight(selectedWeight);


    const userLeaderboardData = leaderboardListData.filter(entry => entry.user_id === userInfo.user_id);
    const compCategories = userLeaderboardData.map(entry => entry.comp_category);

    let newUserPoints;

    compCategories.forEach(category => {
      if (category === 'Lose Weight') {
         newUserPoints = ((startingWeight - selectedWeight) * 100).toFixed(0);
         console.log('LOSING THE WEIGHT')
      } else if (category === 'Gain Weight') {
         newUserPoints = ((selectedWeight - startingWeight) * 100).toFixed(0);
         console.log('GAINING THE WEIGHT')
      } else if (category === 'Strength') {
        newUserPoints = ((selectedWeight - startingWeight) * 100).toFixed(0);
        console.log('GAINING THE STRENGTH')
     }
    });
    

    const createStatsPackage = {
      weight: selectedWeight,
      compId: compId,
      userInfo: userInfo,
      weekNumber: weekNumber,
      newUserPoints: newUserPoints
    };
    
    axios.post(`${BASE_URL}/api/updateCompetitorWeight`, { statsPackage: createStatsPackage, userInfo })
      .then((response) => {
        console.log('Successfully sent stats to the backend');

        const updatedWeightChanges = [...userWeightChanges, selectedWeight];
        setUserWeightChanges(updatedWeightChanges);

        resolve();
    
      })
      .catch((error) => {
        console.error('Error sending stats to the backend:', error);
        reject(error); // Reject the Promise if there's an error
      });
    });
  };



  const getRankBackgroundColor = (rank, teamColor = null) => {
    if (teamColor) {
      return teamColor; // Use the team's color for team competitions
    } else {
      if (rank === 1) {
        return "#FFD700"; // Gold
      } else if (rank === 2) {
        return "#C0C0C0"; // Silver
      } else if (rank === 3) {
        return "#CD7F32"; // Bronze
      } else {
        return "#F1E0F5"; // Default color
      }
    }
  };


  const calculateTotalPointsByTeam = () => {
    const teamPoints = {};
  
    leaderboardListData.forEach((entry) => {
      if (entry.team_id) {
        if (!teamPoints[entry.team_id]) {
          teamPoints[entry.team_id] = 0;
        }
        teamPoints[entry.team_id] += entry.points;
      }
    });
  
    return teamPoints;
  };
  
  const teamPoints = calculateTotalPointsByTeam();
  
  const calculateTeamNames = () => {
    const teamNames = {};
  
    leaderboardListData.forEach((entry) => {
      if (entry.team_id) {
        teamNames[entry.team_id] = entry.team_name;
      }
    });
  
    return teamNames;
  };
  
  const teamNames = calculateTeamNames();

  const isTopTeam = (teamId) => {
    const maxPoints = Math.max(...Object.values(teamPoints));
    return teamPoints[teamId] === maxPoints;
  };

  



  return (
    <View style={styles.container}>
      <ScrollView>
        {showFinalStandings ? (
          <FinalStandingsComponent
            leaderboardListData={leaderboardListData}
            userRank={userRank}
            startingWeight={startingWeight}
            mostRecentWeight={mostRecentWeight}
            compId={compId}
            getRankBackgroundColor={getRankBackgroundColor}
            isCompetitionEnded={isCompetitionEnded}
          />
        ) : (
          leaderboardListData.some(entry => entry.user_id === userInfo.user_id) ? (
    <View style={styles.leaderboardContainer}>
      <Text style={styles.competitionTitle}>
        {leaderboardListData.find(entry => entry.comp_id === compId)?.comp_name}
      </Text>
      <Text style={styles.competitionEndDate}>
        {leaderboardListData.find(entry => entry.comp_id === compId)?.comp_start_date}  -  {leaderboardListData.find(entry => entry.comp_id === compId)?.comp_end_date}
      </Text>

      <View style={styles.teamPointsContainer}>
  {Array.from(
    new Set(
      leaderboardListData
        .filter((entry) => entry.comp_id === compId && entry.hasOwnProperty('team_id'))
        .map((entry) => teamNames[entry.team_id])
    )
  ).map((teamName, index) => {
    const teamEntries = leaderboardListData
      .filter((entry) => entry.comp_id === compId && teamNames[entry.team_id] === teamName);

      const totalPoints = teamEntries.reduce((acc, entry) => acc + entry.points, 0);


    return (
      <View key={index} style={styles.teamBox}>
        <Text style={styles.teamName}>Team {teamName}</Text>
        <Text style={styles.teamPoints}>{totalPoints} Points</Text>
        {isTopTeam(teamEntries[0].team_id) && (
          <Ionicons name="trophy" size={24} color="gold" style={styles.trophyIcon} />
        )}
      </View>
    );
  })}
</View>

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
                <Text style={styles.username}>{entry.username}</Text>
                <Text style={styles.weight}>{entry.points}</Text>
              </View>
            ))}

         <Modal
        animationType='fade'
        transparent={true}
        visible={isUpdateWeightModalVisible}
        onRequestClose={() => {
          setIsUpdateWeightModalVisible(false);
        }}
      >
             <View style={styles.startingStatsModalContainer}>
               <View style={styles.startingStatsModalContent}>
                 <Text style={styles.enterStatsTitle}>Please enter current weight:</Text>
                 <Text style={styles.previousWeightText}>
                  Previous weight: {userWeightChanges.length > 0 ? userWeightChanges[userWeightChanges.length - 1] : 'No previous weight available'} kg
                </Text>
                 <TextInput
                    style={styles.weightInput}
                    keyboardType="numeric"
                    value={selectedWeight}
                    onChangeText={setSelectedWeight}
                  />
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => {
                      handleWeightOptionPress(selectedWeight)
                        .then(() => {
                          setIsUpdateWeightModalVisible(false);
                          fetchData();
                        })
                        .catch((error) => {
                          // Handle any errors here
                          console.error('Error in handleWeightOptionPress:', error);
                        });
                    }}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>

               </View>
             </View>
             </Modal>
    </View>
    
  ) : (
    <View>
      <Text style={styles.joinCompetitionText}>Please join a competition to see leaderboard</Text>
    </View>
  )
  )}
  
</ScrollView>

{!showFinalStandings && (

<View style={styles.bottomButtonsContainer}>
{leaderboardListData.some(entry => entry.user_id === userInfo.user_id) && (
<View style={styles.compMenuContainer}>
        <TouchableOpacity
          style={styles.updateWeight}
          onPress={() => setIsUpdateWeightModalVisible(true)}
        >
          <Text style={styles.updateWeightText}>Update Weight</Text>
        </TouchableOpacity>
      </View>
)}
  <View style={styles.compMenuContainer}>
      <TouchableOpacity
      style={styles.compMenu}
          onPress={() => navigation.navigate('Compete')}
        >
          <Text style={styles.compMenuText}>Competititon Menu</Text>
      </TouchableOpacity>
    </View>
    </View>
   )}

{showFinalStandings && (
      <View style={styles.bottomButtonsContainer}>
        <View style={styles.compMenuContainer}>
          <TouchableOpacity
            style={styles.compMenu}
            onPress={() => navigation.navigate('Compete')}
          >
            <Text style={styles.compMenuText}>Competition Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  

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
    fontFamily: 'MontserratSemiBold',
  },
  username: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'MontserratMedium',
  },
  weight: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
  },

  bottomButtonsContainer:{
   alignItems: 'center'
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
     fontFamily: 'MontserratSemiBold',
     fontSize: 16,
     textAlign: 'center',
   },

   compMenuContainer: {
    backgroundColor: '#3498db',
     borderRadius: 10,
     paddingVertical: 12,
     paddingHorizontal: 20,
     marginTop: 10,
     width: '70%'
   },
   compMenuText: {
     color: 'white',
     fontFamily: 'MontserratSemiBold',
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
    height: '35%',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
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
  fontSize: 16,
  fontFamily: 'MontserratSemiBold',
},

previousWeightText:{
  marginTop: 10,
  textAlign: 'center',
  fontSize: 16,
  color: 'grey',
  fontFamily: 'MontserratMedium',
},

weightInput: {
  marginTop: 50,
  borderWidth: 1,
  borderColor: 'lightgrey',
  borderRadius: 5,
  fontSize: 20,
  textAlign: 'center',
  height: 40,
  width: 60,
  fontFamily: 'MontserratMedium',
},
doneButton: {
  marginTop: 50,
  height: 30,
  width: 70,
  borderWidth: 1,
  borderRadius: 15,
  backgroundColor: '#3498db',
  justifyContent: 'center',
  alignItems: 'center',
},
doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
  },
  joinCompetitionText:{
    fontSize: 18,
    fontFamily: 'MontserratMedium',
    textAlign: 'center',
    marginTop: '50%'
  },

  competitionTitle:{
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'MontserratSemiBold',
    marginBottom: 10,
  },

  competitionEndDate:{
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: 'grey',
    fontFamily: 'MontserratMedium',
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
    fontFamily: 'MontserratMedium',
    marginBottom: 5, // Adjust the margin as needed
  },

  teamPoints: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
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

export default Leaderboard;
