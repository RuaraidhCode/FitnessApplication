import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView , TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import ColorSquare from './ColorSquare';
import { BASE_URL } from '../config';
import NewPicker from './NewPicker';


const CompetitionMenu = () => {
    const navigation = useNavigation();
    const { userInfo } = useContext(AuthContext);
    const [isCreateCompetitionModalVisible, setCreateCompetitionModalVisible] = useState(false);
    const [isJoinCompetitionModalVisible, setJoinCompetitionModalVisible] = useState(false);
    const [isTeamCompModalVisible, setTeamCompModalVisible] = useState(false);
    const [isJoinTeamCompModalVisible, setJoinTeamCompModalVisible] = useState(false);
    const [isStartingStatsModalVisible, setIsStartingStatsModalVisible] = useState(false);
    const [competitionName, setCompetitionName] = useState('');
    const [competitionType, setCompetitionType] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [showDurationPicker, setShowDurationPicker] = useState(false);
    const [showTypePicker, setShowTypePicker] = useState(false);
    const [category, setCategory] = useState('');
    const [duration, setDuration] = useState('');
    const competitionCategories = ['Lose Weight', 'Gain Weight', 'Strength'];
    const competitionDuration = ['1 Month', '3 Month', '6 Month'];
    const competitionTypeOptions = ['Solo', 'Team'];
    const [startDateString, setStartDateString] = useState('');
    const [endDateString, setEndDateString] = useState('');
    const [competitionListData, setCompetitionListData] = useState([]);
    const [competitorList, setCompetitorList] = useState([]);
    const [expandedCards, setExpandedCards] = useState([]);
    const [selectedWeight, setSelectedWeight] = useState('');
    const [weight, setWeight] = useState('');
    const [chosenCompID, setChosenCompID] = useState(null);
    const [teamOneName, setTeamOneName] = useState('');
    const [teamTwoName, setTeamTwoName] = useState('');
    const basicColors = ['orange', 'green', 'violet', 'yellow', 'pink', 'white'];
    const [selectedColorOne, setSelectedColorOne] = useState(basicColors[0]);
    const [selectedColorTwo, setSelectedColorTwo] = useState(basicColors[0]);
    const [selectedTeamName1, setSelectedTeamName1] = useState(null);
    const [selectedTeamName2, setSelectedTeamName2] = useState(null);
    const [selectedTeamColour1, setSelectedTeamColour1] = useState(null);
    const [selectedTeamColour2, setSelectedTeamColour2] = useState(null);
    const [selectedTeamId1, setSelectedTeamId1] = useState(null);
    const [selectedTeamId2, setSelectedTeamId2] = useState(null);
    const points = 0;
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedTeamColor, setSelectedTeamColor] = useState(null);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [selectedCompName, setSelectedCompName] = useState(null);
    const [hasUserJoinedComp, setHasUserJoinedComp] = useState(false);

    
      const handleTeamPress = (teamName, teamColour, teamId) => {
        setSelectedTeam(teamName);
        setSelectedTeamColor(teamColour);
        setSelectedTeamId(teamId);
        console.log('Selected Team Id --> ', teamId)
      }

    const handleColorChangeOne = (color) => {
      setSelectedColorOne(color);
    };
    const handleColorChangeTwo = (color) => {
      setSelectedColorTwo(color);
    };

    const handleCreateCompetitionModal = () => {
        setCreateCompetitionModalVisible(true);
      };

      const handleCompetitionCategoryChange = (itemValue) => {
        if (itemValue) {
          setCategory(itemValue);
          setShowPicker(false);
          console.log('Competition Category ---->' + itemValue)
      }
      };

      const handleCompetitionTypeChange = (itemValue) => {
        if (itemValue) {
          setCompetitionType(itemValue);
          setShowTypePicker(false);
          console.log('Competition Type ---->' + itemValue)
      }
      };

      const handleCompetitionDurationChange = (itemValue) => {
        if (itemValue) {
          setDuration(itemValue);
          setShowDurationPicker(false);
          console.log('Competition Duration ---->' + itemValue)

          const currentDate = new Date();
          const endDate = new Date(currentDate);

          if (itemValue === '1 Month') {
            endDate.setMonth(currentDate.getMonth() + 1);
          } else if (itemValue === '3 Month') {
            endDate.setMonth(currentDate.getMonth() + 3);
          } else if (itemValue === '6 Month') {
            endDate.setMonth(currentDate.getMonth() + 6);
          }

        setStartDateString(currentDate.toISOString().split('T')[0]);
        setEndDateString(endDate.toISOString().split('T')[0]);
      }
      };

      



     const handleJoinCompetitionModal = () => {
        setJoinCompetitionModalVisible(true);
      };  
      const handleStartingStatsModalModal = () => {
        setIsStartingStatsModalVisible(true);
      };  

      const handleJoinButtonPress = (competition) => {
        setJoinCompetitionModalVisible(false);
        setIsStartingStatsModalVisible(true);
        setChosenCompID(competition.comp_id);
        setHasUserJoinedComp(true);
    };
    
    useEffect(() => {
      fetchData();
    }, []); 
    

      const toggleCardExpansion = (index) => {
        const updatedExpandedCards = [...expandedCards];
        updatedExpandedCards[index] = !updatedExpandedCards[index];
        setExpandedCards(updatedExpandedCards);
      };
      
  
        const handleWeightOptionPress = (selectedWeight, chosenCompID, selectedTeam, selectedTeamColor) => {
          setSelectedWeight(selectedWeight);

          const createStatsPackage = {
            weight: selectedWeight,
            chosenCompID: chosenCompID,
            compName: selectedCompName,
            selectedTeam: selectedTeam,
            selectedTeamColor: selectedTeamColor,
            selectedTeamId: selectedTeamId,
            userInfo: userInfo,
            points: points
          };
          const numberOfContestants = competitorList.filter(item => item.comp_id === chosenCompID).length;

          if (numberOfContestants < 13) {
          
          axios.post(`${BASE_URL}/api/addCompetitor`, { statsPackage: createStatsPackage, userInfo })
            .then((response) => {
              console.log('Successfully sent stats to the backend:');
          
            })
            .catch((error) => {
              console.error('Error sending stats to the backend:', error);
            });

          } else {
            alert('This competition is full');
          }

        };
        
  
  
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/competitionList`);
          const competitionList = response.data;

          const expandedStates = new Array(competitionList.length).fill(false);
          setExpandedCards(expandedStates);
  
          setCompetitionListData(competitionList);
          
          const otherResponse = await axios.get(`${BASE_URL}/api/receiveWeeklyProgessCompetitorNumber`);
          const competitorList = otherResponse.data;

          setCompetitorList(competitorList)
        } catch (error) {
          console.log(error.message);
        }
      };

  


const handleCreateCompetitionBackend = () => {

  const createCompPackage = {
    compName: competitionName,
    compCategory: category,
    compType: competitionType,
    compDuration: duration,
    compStartDate: startDateString,
    compEndDate: endDateString,
    userInfo: userInfo,
    teamNameOne:teamOneName,
    teamColourOne: selectedColorOne,
    teamNameTwo: teamTwoName,
    teamColourTwo: selectedColorTwo,
  };

    
  axios.post(`${BASE_URL}/api/createCompetition`, { compPackage: createCompPackage, userInfo })
  .then((response) => {
    const { message, teamIds } = response.data;
    // Handle teamIds in your frontend as needed
  })
  .catch((error) => {
    console.error('Error:', error);
    // Handle errors in your frontend
  });
}; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Competition!</Text>
      <View style={styles.buttons}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleCreateCompetitionModal}
      >
        <Text style={styles.buttonText}>Create Competition</Text>
      </TouchableOpacity>
        <Modal
          animationType='fade'
          transparent={true}
          visible={isCreateCompetitionModalVisible}
          onRequestClose={() => {
            setCreateCompetitionModalVisible(false);
          }}
        >
            <View style={styles.createCompetitionModalContainer}>
                <View  style={styles.createCompetitionModalContent}>
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={() => setCreateCompetitionModalVisible(false)}
                        style={styles.backButton}
                        >
                            <Ionicons name="close-outline" size={24} style={styles.backIcon}></Ionicons>
                        </TouchableOpacity>
                      <Text style={styles.createCompetitionTitle}>Create Competition</Text>
                    </View>
                <View style={styles.createCompetitionModalInput}>
                    <TextInput
                        style={styles.selectCompetitionDescription}
                        placeholder="Competition Name"
                        placeholderTextColor="grey"
                        value={competitionName}
                        onChangeText={setCompetitionName}
                    />

                        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.selectButton}>
                            <Text style={styles.selectButtonText}>
                            {category ? category : 'Select a category'}
                            </Text>
                        </TouchableOpacity>

                    <NewPicker
                            isVisible={showPicker}
                            pickerItems={competitionCategories}
                            selectedPickerValue={category}
                            onSelect={handleCompetitionCategoryChange}
                            pickerLabel={'Select a Category'}
                            pickerHeight={390}
                            onClose={() => setShowPicker(false)}
                          />

                        <TouchableOpacity onPress={() => setShowTypePicker(true)} style={styles.selectButton}>
                            <Text style={styles.selectButtonText}>
                            {competitionType ? competitionType : 'Select competition type'}
                            </Text>
                        </TouchableOpacity>

                    <NewPicker
                            isVisible={showTypePicker}
                            pickerItems={competitionTypeOptions}
                            selectedPickerValue={competitionType}
                            onSelect={handleCompetitionTypeChange}
                            pickerLabel={'Select Competition Type'}
                            pickerHeight={390}
                            onClose={() => setShowTypePicker(false)}
                          />



                        <TouchableOpacity onPress={() => setShowDurationPicker(true)} style={styles.selectButton}>
                            <Text style={styles.selectButtonText}>
                            {duration ? duration : 'Select a duration'}
                            </Text>
                        </TouchableOpacity>

                        <NewPicker
                                isVisible={showDurationPicker}
                                pickerItems={competitionDuration}
                                selectedPickerValue={duration}
                                onSelect={handleCompetitionDurationChange}
                                onClose={() => setShowDurationPicker(false)}
                                pickerLabel="Select a Duration"
                                pickerHeight={390}
                              />
                  
                </View>
                <View style={styles.createButtonContainer}>
                    <TouchableOpacity
                    onPress={() => {setCreateCompetitionModalVisible(false);
                                        if (competitionType === 'Team') {
                                          setTeamCompModalVisible(true);
                                        } else (
                                          handleCreateCompetitionBackend()
                                        )
                                      }}
                    style={styles.createButton}>
                        <Text style={styles.createButtonText}>Create</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </Modal>

        <Modal
        animationType='fade'
        transparent={true}
        visible={isTeamCompModalVisible}
        onRequestClose={() => {
          setTeamCompModalVisible(false);}}>

            <View style={styles.joinCompetitionModalContainer}>
               <View style={styles.joinCompetitionModalContent}>
               <Text style={styles.startingStatsTitle}>Team Details</Text>
               <View style={styles.teamDetailsContainer}>
             
             <View style={styles.teamBlockContainer}>
                 <Text style={styles.enterTeamName}>Team 1 name</Text>
                 <Text style={styles.enterTeamcolour}>Team 1 colour</Text>
              </View>
              <View style={styles.nameAndColor}>
              <TextInput
                      style={styles.teamNameInput}
                      keyboardType='default'
                      value={teamOneName}
                      onChangeText={setTeamOneName}
                    />
              <ColorSquare selectedColor={selectedColorOne}
                            onColorChange={handleColorChangeOne} 
                            colorOptions={basicColors}/>
                            </View>
            
                    <View style={styles.teamBlockContainer}>
                      <Text style={styles.enterTeamName}>Team 2 name</Text>
                      <Text style={styles.enterTeamcolour}>Team 2 colour</Text>
                    </View>
                    <View style={styles.nameAndColor}>
                    <TextInput
                      style={styles.teamNameInput}
                      keyboardType='default'
                      value={teamTwoName}
                      onChangeText={setTeamTwoName}
                    />
                    <ColorSquare selectedColor={selectedColorTwo}
                            onColorChange={handleColorChangeTwo} 
                            colorOptions={basicColors}/>
                            </View>
                    
                  <View style={styles.teamDoneButtonContainer}>
                      <TouchableOpacity
                        style={styles.teamDoneButton}
                        onPress={() => {setTeamCompModalVisible(false);
                                        handleCreateCompetitionBackend();}}
                      >
                        <Text style={styles.teamDoneButtonText}>Done</Text>
                      </TouchableOpacity>
                      </View>
                  </View>
               </View>
              </View>
          </Modal>

          <Modal
           animationType='fade'
           transparent={true}
           visible={isJoinCompetitionModalVisible}
           onRequestClose={() => {
             setisJoinCompetitionModalVisible(false);
           }}>
             <View style={styles.joinCompetitionModalContainer}>
               <View style={styles.joinCompetitionModalContent}>
                  <View style={styles.topBar}>
                        <TouchableOpacity onPress={() => setJoinCompetitionModalVisible(false)}
                        style={styles.backButton}
                        >
                            <Ionicons name="close-outline" size={24} style={styles.backIcon}></Ionicons>
                        </TouchableOpacity>
                        <Text style={styles.joinCompetitionTitle}>Join Competition</Text>
                  </View>
                  <Text style={styles.competitionListTitleText}>List of available competitions:</Text>
                    <View style={styles.competitionListContainer}>
                    <ScrollView style={styles.scrollableList}>
                    {competitionListData.map((competition, index) => (
                      <TouchableOpacity
                        key={competition.comp_id}
                        style={styles.cardContainer}
                        onPress={() => {toggleCardExpansion(index);
                                        setSelectedTeamName1(competition.team_one_name);
                                        setSelectedTeamName2(competition.team_two_name);
                                        setSelectedTeamColour1(competition.team_one_colour);
                                        setSelectedTeamColour2(competition.team_two_colour);
                                        setSelectedTeamId1(competition.team_one_id);
                                        setSelectedTeamId2(competition.team_two_id);
                                        setSelectedCompName(competition.comp_name);
                                       }}
                                    >
                        <View style={styles.cardHeader}>
                         <Text style={styles.cardTitle}>{competition.comp_name}</Text>
                         <Text>{competition.comp_type}</Text>
                        </View>
                        {expandedCards[index] && (
                          <View style={styles.expandedContentContainer}>

                            <Text style={styles.expandedContent}>
                                Contestants: {
                                  competitorList.filter(item => item.comp_id === competition.comp_id).length
                                } / 12
                            </Text>
                           
                            <Text style={styles.expandedContent}>Duration: {competition.comp_duration}</Text>
                            <Text style={styles.expandedContent}>Start Date: {competition.comp_start_date}</Text>
                            <Text style={styles.expandedContent}>End Date: {competition.comp_end_date}</Text>
                            <View style={styles.joinButtonContainer}>
                              <TouchableOpacity style={styles.joinButton}
                                                onPress={() => {
                                                              if (competition.comp_type === 'Team') {
                                                                setChosenCompID(competition.comp_id);
                                                                setJoinCompetitionModalVisible(false);
                                                                setJoinTeamCompModalVisible(true);
                                                              } else (
                                                                handleJoinButtonPress(competition)
                                                              )}}>
                                <Text style={styles.joinButtonText}>Join</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </TouchableOpacity>
                      
                    ))}
                    
                  </ScrollView>
                  </View>
               </View>
             </View>
          </Modal>

          <Modal animationType='fade'
           transparent={true}
           visible={isStartingStatsModalVisible}
           onRequestClose={() => {
             setIsStartingStatsModalVisible(false);
           }}>
             <View style={styles.startingStatsModalContainer}>
               <View style={styles.startingStatsModalContent}>
                 <Text style={styles.startingStatsTitle}>Good Luck!</Text>
                 <Text style={styles.enterStatsTitle}>Please enter starting weight:</Text>
                 <TextInput
                    style={styles.weightInput}
                    keyboardType="numeric"
                    value={selectedWeight}
                    onChangeText={setSelectedWeight}
                  />
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => {handleWeightOptionPress(selectedWeight, chosenCompID);
                                    setIsStartingStatsModalVisible(false);}}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
               </View>
             </View>
          </Modal>
                        
                      <Modal
                      animationType='fade'
                      transparent={true}
                      visible={isJoinTeamCompModalVisible}
                      onRequestClose={() => {
                        setJoinTeamCompModalVisible(false);}}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                            <View style={styles.startingStatsModalContainer}>
                              <View style={styles.startingStatsTeamModalContent}>
                                <Text style={styles.startingStatsTitle}>Good Luck!</Text>
                                <Text style={styles.enterStatsTitle}>Please enter starting weight:</Text>
                                <View style={styles.weightInputContainer}>
                                <TextInput
                                    style={styles.weightInput}
                                    keyboardType="numeric"
                                    value={selectedWeight}
                                    onChangeText={setSelectedWeight}
                                  />
                                </View>
                                  <Text style={styles.enterStatsTitle}>Please select team you want to join:</Text>
                                    <View style={styles.teamButtonContainer}>
                                      <View style={styles.teamOneButtonContainer}>
                                      <TouchableOpacity  onPress={() => handleTeamPress(selectedTeamName1, selectedTeamColour1, selectedTeamId1)}
                                                          style={[styles.teamOneButton,
                                                                  styles.teamButton,
                                                                  selectedTeam === selectedTeamName1 && styles.selectedTeamButton,
                                                                  { backgroundColor: selectedTeamColour1},
                                                                  ]}>
                                        <Text style={styles.teamOneButtonText}>{selectedTeamName1}</Text>
                                      </TouchableOpacity>
                                      </View>
                                      <View style={styles.teamTwoButtonContainer}>
                                      <TouchableOpacity onPress={() => handleTeamPress(selectedTeamName2, selectedTeamColour2, selectedTeamId2)} 
                                                        style={[styles.teamTwoButton,
                                                                styles.teamButton,
                                                                selectedTeam === selectedTeamName2 && styles.selectedTeamButton,
                                                                { backgroundColor: selectedTeamColour2 },
                                                                ]}>
                                        <Text style={styles.teamTwoButtonText}>{selectedTeamName2}</Text>
                                      </TouchableOpacity>
                                      </View>
                                  
                                    </View>
                                    <View style={styles.doneTeamButtonContainer}>
                                  <TouchableOpacity
                                    style={styles.doneTeamButton}
                                    onPress={() => {handleWeightOptionPress(selectedWeight, chosenCompID, selectedTeam, selectedTeamColor);
                                      setJoinTeamCompModalVisible(false);
                                      setHasUserJoinedComp(true);}}
                                  >
                                    <Text style={styles.doneButtonText}>Done</Text>
                                  </TouchableOpacity>
                                  </View>
                              </View>
                            </View>
                            </TouchableWithoutFeedback>
                        </Modal>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleJoinCompetitionModal()}>
          <Text style={styles.buttonText}>Join Competition</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Main Leaderboard')}>
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>
        
      </View>
    </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: '#333',
    },
    buttons: {
     
    },
    buttonContainer: {
     backgroundColor: '#3498db',
     width: 300,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginHorizontal: 10,
      marginVertical: 5
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold'
    },

    createCompetitionModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    createCompetitionModalContent: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
    },
    topBar: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'space-between'
      },
      backButton:{
        paddingRight: 10
      },
      backIcon:{
        paddingRight: 10
      },
      createCompetitionTitle: {
        fontSize: 24,
        marginBottom: 20,
        marginRight: 30,
      },
      selectButtonText:{
        textAlign: 'center',
      },
      selectButton: {
        backgroundColor: '#F5F5F5',
         borderWidth: 0.5,
         height: 40,
         borderRadius: 8,
         paddingHorizontal: 8,
         marginBottom: 40,
         justifyContent: 'center',
         shadowColor: '#000',
         shadowOffset: {
           width: 0,
           height: 2,
         },
         shadowOpacity: 0.3,
         shadowRadius: 2,
       },
  
    selectCompetitionDescription: {
        height: 40,
        borderColor: 'grey',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 40,
        justifyContent: 'center',
      }, 
      createButtonContainer:{
          marginTop: 30,
          alignItems: 'center'
      },
      createButton:{
          height: 50,
          width: 100,
          backgroundColor: '#3498db',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10
      },
      createButtonText:{
          fontSize: 18,
          color: 'white',
          fontWeight: 'bold'
      },


      joinCompetitionModalContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
     },
      joinCompetitionModalContent: {
          width: '80%',
          height: '50%',
          backgroundColor: '#fff',
          marginHorizontal: 20,
          padding: 20,
          borderRadius: 10,
      },
      joinCompetitionTitle: {
        fontSize: 24,
        marginBottom: 10,
        marginRight: 45,
      },
      competitionListTitleText:{
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
      },
      competitionListContainer:{
        width: '100%',
        height: '80%'
      },

      cardContainer:{
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#F5F5F5',
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      cardTitle:{
        fontWeight: 'bold',
      },
      expandedContentContainer:{
      marginTop: 10,
      },
      expandedContent:{
        marginTop: 5,
      },
      joinButtonContainer:{
        alignItems: 'center',
      },
      joinButton:{
        marginTop: 20,
         height: 30,
         width: 60,
         borderWidth: 1,
         borderRadius: 10,
         backgroundColor: '#3498db',
         justifyContent: 'center',
         alignItems: 'center',
      },
      joinButtonText:{
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
      },


      startingStatsModalContainer:{
        flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      startingStatsTeamModalContent:{
        width: '80%',
        height: '55%',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
       
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
    weightInput: {
      marginTop: 20,
      borderWidth: 1,
      borderColor: 'lightgrey',
      borderRadius: 5,
      fontSize: 24,
      textAlign: 'center',
      height: 40,
      width: 70
    },
    doneButton: {
      marginTop: '30%',
      height: 40,
      width: 80,
      borderWidth: 1,
      borderRadius: 15,
      backgroundColor: '#3498db',
      justifyContent: 'center',
      alignItems: 'center',
    },
    doneTeamButtonContainer:{
      alignItems: 'center'
    },
    doneTeamButton:{
      marginTop: '25%',
      height: 40,
      width: 80,
      borderWidth: 1,
      borderRadius: 15,
      backgroundColor: '#3498db',
      justifyContent: 'center',
      alignItems: 'center',
    },
    doneButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold'
    },

    teamDetailsContainer:{
    },

    teamBlockContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    enterTeamName:{
      marginTop: 30,
      fontSize: 16,
      marginLeft: 10,
    },

    enterTeamcolour:{
      marginTop: 30,
      fontSize: 16,
      marginRight: 10,
    },

    teamNameInput:{
      marginTop: 20,
      marginLeft: 5,
      borderWidth: 1,
      borderColor: 'lightgrey',
      borderRadius: 5,
      fontSize: 16,
      textAlign: 'center',
      height: 40,
      width: '40%',
    },
    
    nameAndColor:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },

    colorSquareContainer:{
      alignItems: 'center',
    },


    teamDoneButtonContainer:{
      alignItems: 'center',
    },

    teamDoneButton:{
      height: 40,
      width: 80,
      borderWidth: 1,
      borderRadius: 15,
      backgroundColor: '#3498db',
      justifyContent: 'center',
      alignItems: 'center',
    },

    teamDoneButtonText:{
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold'
    },

    weightInputContainer:{
      alignItems: 'center',
      marginBottom: 20,
    },

    teamButtonContainer:{
      flexDirection: 'row',
      justifyContent: 'space-around',
    },

    teamOneButtonContainer:{
      opacity: 1,
    },
    teamOneButton:{
      marginTop: 20,
      height: 40,
      width: 100,
      borderWidth: 1,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    teamOneButtonText:{
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    },
    teamTwoButtonContainer:{
      opacity: 1,
    },
    teamTwoButton:{
      marginTop: 20,
      height: 40,
      width: 100,
      borderWidth: 1,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    teamTwoButtonText:{
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    },

    teamButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    selectedTeamButton: {
      opacity: 0.5, // Remove opacity when button is selected
    },
  });

export default CompetitionMenu