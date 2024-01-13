// AchievementsScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import Badge from '../assets/images/achievement.png';
import BronzeModalHidden from './BronzeModalHidden';
import SilverModalHidden from './SilverModalHidden';
import GoldModalHidden from './GoldModalHidden';
import { BASE_URL } from '../config';

const Tab = createBottomTabNavigator();

const Achievement = () => {
  const { userInfo } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievementData, setAchievementData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (achievement) => {
    setSelectedAchievement(achievement);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/receiveAchievement`, {
        params: { user_id: userInfo.user_id },
      });
      const achievementList = response.data;
      setAchievementData(achievementList);
    } catch (error) {
      console.log(error.message);
    }
  };

  const BronzeScreen = () => (
    <View style={styles.container}>
      {achievementData.map((achievement) =>
        achievement.rank === 'Bronze' && (
          <TouchableOpacity
            key={achievement.achievement_id}
            style={styles.card}
            onPress={() => openModal(achievement)}
          >
            <View style={styles.cardRowContainer}>
                <Ionicons style={styles.arrowIcon} name="trophy" size={40} color='#CD7F32'></Ionicons>
                <View style={styles.achivementInfoContainer}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
            </View>
          </TouchableOpacity>
        )
      )}

<BronzeModalHidden modalVisible={modalVisible} closeModal={closeModal} selectedAchievement={selectedAchievement} />
    </View>
  );

  const SilverScreen = () => (
    <View style={styles.container}>
      {achievementData.map((achievement) =>
        achievement.rank === 'Silver' && (
          <TouchableOpacity
            key={achievement.achievement_id}
            style={styles.card}
            onPress={() => openModal(achievement)}
          >
            <View style={styles.cardRowContainer}>
                <Ionicons style={styles.arrowIcon} name="trophy" size={40} color='#C0C0C0'></Ionicons>
                <View style={styles.achivementInfoContainer}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
            </View>
          </TouchableOpacity>
        )
      )}

<SilverModalHidden modalVisible={modalVisible} closeModal={closeModal} selectedAchievement={selectedAchievement} />
    </View>
  );

  const GoldScreen = () => (
    <View style={styles.container}>
      {achievementData.map((achievement) =>
        achievement.rank === 'Gold' && (
          <TouchableOpacity
            key={achievement.achievement_id}
            style={styles.card}
            onPress={() => openModal(achievement)}
          >
            <View style={styles.cardRowContainer}>
                <Ionicons style={styles.arrowIcon} name="trophy" size={40} color='#FFD700'></Ionicons>
                <View style={styles.achivementInfoContainer}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
            </View>
          </TouchableOpacity>
        )
      )}

<GoldModalHidden modalVisible={modalVisible} closeModal={closeModal} selectedAchievement={selectedAchievement} />
    </View>
  );

  return (
    <Tab.Navigator
    screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Bronze" component={BronzeScreen} />
      <Tab.Screen name="Silver" component={SilverScreen} />
      <Tab.Screen name="Gold" component={GoldScreen} />
    </Tab.Navigator>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  column: {
    flex: 1,
    padding: 10,
  },
  columnTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'center'
  },
  achievementTitle:{
      marginLeft: 30,
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'MontserratSemiBold',
  },
  achievementDescription:{
    marginTop: 5,
    marginLeft: 30,
    color: 'grey',
    fontFamily: 'MontserratMedium',
  },
  cardRowContainer:{
      flexDirection: 'row',
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
  tabTitle: {
    fontFamily: 'MontserratMedium',
  }
});

export default Achievement;
