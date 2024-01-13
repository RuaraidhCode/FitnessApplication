// GoalSettingTipsModal.js

import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const GoalSettingTipsModal = ({ isVisible, onClose }) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>How to Properly Set Goals</Text>
          <Text style={styles.tipText}>
            Tips for setting goals that lead to long-term success:
          </Text>
          <View style={styles.tipContainer}>
            <Text style={styles.tipText}><Text style={styles.tipNumber}>1.</Text> Make your goals specific and measurable.</Text>
            <Text style={styles.tipText}><Text style={styles.tipNumber}>2.</Text> Set realistic and achievable goals.</Text>
            <Text style={styles.tipText}><Text style={styles.tipNumber}>3.</Text> Break your long-term goals into smaller milestones.</Text>
            <Text style={styles.tipText}><Text style={styles.tipNumber}>4.</Text> Track your progress regularly.</Text>
            <Text style={styles.tipText}><Text style={styles.tipNumber}>5.</Text> Stay committed and adjust your goals as needed.</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    width: '80%',
  },
  header: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#3498db',
  },
  tipContainer: {
    justifyContent: 'center',
  },
  tipNumber: {
    fontFamily: 'MontserratBold',
  },
  tipText: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'MontserratMedium',
  },
  closeButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'MontserratBold',
    fontSize: 16,
  },
});

export default GoalSettingTipsModal;
