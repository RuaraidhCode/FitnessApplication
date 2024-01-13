import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import Badge from '../assets/images/achievement.png';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


const BronzeModalHidden = ({ modalVisible, closeModal, selectedAchievement }) => {
  
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
        end={{ x: 0, y: 1 }}
       style={styles.modalContainerBronze}>
        
        <View style={styles.modalContent}>
        <Text style={styles.badgeTitle}>You earned a {selectedAchievement?.rank?.toLowerCase()} badge!</Text>
        <Text style={styles.xpText}>+25 XP</Text>
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
    paddingHorizontal: 25
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    fontFamily: 'MontserratSemiBold',
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'MontserratSemiBold',
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
    fontFamily: 'MontserratMedium',
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
    marginBottom: 20,
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
    fontFamily: 'MontserratSemiBold',
  },


  buttonsContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },


  xpText:{
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'MontserratBold',
    color: '#3498db',
    marginBottom: 20,
  }
});


export default BronzeModalHidden;
