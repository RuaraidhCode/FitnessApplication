import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import Badge from '../assets/images/achievement.png';
import { LinearGradient } from 'expo-linear-gradient';

const SilverModalHidden = ({ modalVisible, closeModal, selectedAchievement }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <LinearGradient colors={['#C0C0C0', 'grey', '#C0C0C0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
       style={styles.modalContainerSilver}>
     
        <View style={styles.modalContent}>
        <Text style={styles.badgeTitle}>You earned a {selectedAchievement?.rank?.toLowerCase()} badge!</Text>
          <View style={styles.imageContainer}>
            <Image source={Badge} resizeMode='contain' style={styles.badgePic} />
          </View>
          <Text style={styles.modalTitle}>{selectedAchievement?.title}</Text>
          <Text style={styles.modalDescription}>{selectedAchievement?.description}</Text>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
     
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({

  
  modalContainerSilver:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default SilverModalHidden;
