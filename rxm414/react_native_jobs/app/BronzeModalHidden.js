import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import Badge from '../assets/images/achievement.png';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


const BronzeModalHidden = ({ modalVisible, closeModal, selectedAchievement }) => {
const navigation = useNavigation();
const [secondModalVisible, setSecondModalVisible] = useState(false);
const achievementSide = ['Left', 'Middle', 'Right'];
  
/*  
<TouchableOpacity style={styles.showcaseButton} onPress={() => setSecondModalVisible(true)}>
<Text style={styles.showcaseButtonText}>Send to Showcase</Text>
</TouchableOpacity> */

  const handleLeftShowcase = () => {
    setSecondModalVisible(false);

    const badgeInfo = {
      title: selectedAchievement?.title,
      rank: selectedAchievement?.rank?.toLowerCase(),
      side: achievementSide[0],
    };
    navigation.navigate('Profile', { badgeInfo });
  } 

  const handleMiddleShowcase = () => {
    setSecondModalVisible(false);

    const badgeInfo = {
      title: selectedAchievement?.title,
      rank: selectedAchievement?.rank?.toLowerCase(),
      side: achievementSide[1],
    };
    navigation.navigate('Profile', { badgeInfo });
  } 

  const handleRightShowcase = () => {
    setSecondModalVisible(false);

    const badgeInfo = {
      title: selectedAchievement?.title,
      rank: selectedAchievement?.rank?.toLowerCase(),
      side: achievementSide[2],
    };
    navigation.navigate('Profile', { badgeInfo });
  } 


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setSecondModalVisible(false)}
    >
       <LinearGradient
        colors={['#CD7F32', '#8B4513', '#CD7F32']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
       style={styles.modalContainerBronze}>
        
        <View style={styles.modalContent}>
        <Text style={styles.badgeTitle}>You earned a {selectedAchievement?.rank?.toLowerCase()} badge!</Text>
          <View style={styles.imageContainer}>
            <Image source={Badge} resizeMode='contain' style={styles.badgePic} />
          </View>
          <Text style={styles.modalTitle}>{selectedAchievement?.title}</Text>
          <Text style={styles.modalDescription}>{selectedAchievement?.description}</Text>
          <View style={styles.closeButtonContainer}>
         
            <TouchableOpacity style={styles.showcaseButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={secondModalVisible}
        onRequestClose={() => setSecondModalVisible(false)}
      >

        <View style={styles.secondModalContainer}>
          <View style={styles.secondModalContent}>
            <Text style={styles.secondModalTitle}>Choose Side</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.secondModalButton} onPress={handleLeftShowcase}>
                <Text style={styles.secondModalButtonText}>Left</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondModalButton} onPress={handleMiddleShowcase}>
                <Text style={styles.secondModalButtonText}>Middle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondModalButton} onPress={handleRightShowcase}>
                <Text style={styles.secondModalButtonText}>Right</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({

  modalContainerBronze:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 50,
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

  showcaseButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
  },
  showcaseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  closeButton: {
    backgroundColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },


  buttonsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  secondModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  secondModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    height: '20%',
  },
  secondModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  secondModalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
    height: 60,
    width: 80,
    justifyContent: 'center',
  },
  secondModalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default BronzeModalHidden;
