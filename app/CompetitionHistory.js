import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { AuthContext } from './AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../config';

const CompetitionHistory = () => {
    const [competitions, setCompetitions] = useState([]);
    const [leaderboardListData, setLeaderboardListData] = useState([]);
    const { userInfo } = useContext(AuthContext);
    const [showFinalStandings, setShowFinalStandings] = useState(false);
    const navigation = useNavigation();

    const toggleExpanded = (compId, isTeam) => {
        const updatedCompetitions = [...competitions];
        const index = updatedCompetitions.findIndex(comp => comp.comp_id === compId);
        if (index !== -1) {
            updatedCompetitions[index].expanded = !updatedCompetitions[index].expanded;
            setCompetitions(updatedCompetitions);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
          fetchData();
        }, [])
      );
    
    const fetchData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/allCompetitionHistory?user_id=${userInfo.user_id}`);
          const leaderboardList = response.data;

          console.log('user leaderboard details ----> ', leaderboardList)

          setCompetitions(leaderboardList)
        } catch (error) {
          console.log(error.message);
        }
      };

    const renderCompetitionCards = () => {

        const soloCompetitions = competitions.filter(competition => competition.team_id === null);

        return soloCompetitions.map((competition, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => toggleExpanded(competition.comp_id, false)}
                style={styles.cardContainer}
            >
                <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{competition.comp_name}</Text>
                    <View style={styles.dateContainer}>
                        <Text style={styles.compStartDateText}>{competition.comp_start_date}</Text>
                    </View>
                </View>
                {competition.expanded && (
                    <View style={styles.cardDetails}>
                        {/* Display additional details here */}
                        <Text style={styles.pointText}>Points: {competition.points}</Text>
                        <Text style={styles.IdText}>Competition ID: {competition.comp_id}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.leaderboardButton}
                                onPress={() => navigation.navigate('Leaderboard History', { compId: competition.comp_id })}
                            >
                                <Text style={styles.leaderboardButtonText}>View Leaderboard</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Add other competition details */}
                    </View>
                )}
            </TouchableOpacity>
        ));
    };

    const renderTeamCompetitionCards = () => {

        const teamCompetitions = competitions.filter(competition => competition.team_id !== null);

        return teamCompetitions.map((competition, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => toggleExpanded(competition.comp_id, true)}
                style={styles.cardContainer}
            >
                <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{competition.comp_name}</Text>
                    <View style={styles.dateContainer}>
                        <Text style={styles.compStartDateText}>{competition.comp_start_date}</Text>
                    </View>
                </View>
                {competition.expanded && (
                    <View style={styles.cardDetails}>
                        {/* Display additional details here */}
                        <Text style={styles.pointText}>Points: {competition.points}</Text>
                        <Text style={styles.teamText}>Team: {competition.team_name}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.leaderboardButton}
                                onPress={() => navigation.navigate('Leaderboard History', { compId: competition.comp_id })}
                            >
                                <Text style={styles.leaderboardButtonText}>View Leaderboard</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Add other competition details */}
                    </View>
                )}
            </TouchableOpacity>
        ));
    };

return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.compHistoryTitle}>Competition History</Text>
                {renderCompetitionCards()}
                {renderTeamCompetitionCards()}
            </View>
        </ScrollView>
)   
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Background color for the entire screen
        paddingTop: 20, // Adding some padding at the top
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    compHistoryTitle: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 20, // Increased spacing around the title
        color: '#3498db', // Title color
    },
    cardContainer: {
        width: '90%',
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
    cardTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leaderboardButton: {
        marginTop: 20,
        height: 40,
        width: '60%',
        borderRadius: 20,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
    },
    leaderboardButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontFamily: 'MontserratMedium',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardTitle: {
        fontSize: 20,
        fontFamily: 'MontserratSemiBold',
    },
    compStartDateText: {
        fontFamily: 'MontserratSemiBold',
    },
    pointText: {
        fontSize: 18,
        fontFamily: 'MontserratMedium',
        marginBottom: 5,
    },
    teamText: {
        fontSize: 18,
        fontFamily: 'MontserratMedium',
    },
    IdText:{
        fontSize: 18,
        fontFamily: 'MontserratMedium',
    },

    dateContainer: {
        backgroundColor: '#3498db',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    dateText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardDetails: {
        marginTop: 15,
    },
});

export default CompetitionHistory;
