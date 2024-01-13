import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const CompleteGoalModal = ({ isVisible, onClose, onComplete }) => {

  const handleComplete = () => {
    onComplete();
    onClose()
  };

 
  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

            <Text style={styles.completeConfirmationText}>Confirm completion of goal</Text>
          
          <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleComplete} style={styles.completeButton}>
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          </View>
          
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
      completeConfirmationText: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 30,
        fontFamily: 'MontserratMedium',
      },
      buttonsContainer: {
       flexDirection: 'row',
       justifyContent: 'space-around'
      },
      completeButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
      },
      cancelButton: {
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'MontserratSemiBold',
      },
    
});

export default CompleteGoalModal;
