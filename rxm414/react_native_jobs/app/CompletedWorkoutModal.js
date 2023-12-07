import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const CompletedWorkoutModal = ({ isCompletedWorkoutModalVisible, onClose, workoutData, timerValue, onFinish }) => {

    return (
        <Modal animationType='fade'
                transparent={true}
                visible={isCompletedWorkoutModalVisible}
                onRequestClose={onClose}>
        
        <View style={styles.completedWorkoutModalContainer}>
            <View  style={styles.completedWorkoutModalContent}>
                <View style={styles.completedWorkoutTitle}>
                    <Text style={styles.completedWorkoutTitleText}>Congratulations!</Text>
                </View>
                <View style={styles.workoutDurationContainer}>
                    <Text style={styles.workoutDurationText}>Duration: {timerValue}</Text>
                </View>
                <ScrollView>
                    <View style={styles.workoutDetailsContainer}>
          
                    {workoutData.map((exercise, index) => (
                        <View key={index} style={styles.exerciseContainer}>
                            <Text style={styles.CompletedExerciseName}>{exercise.exerciseName}</Text>
                            {exercise.sets.map((set, setIndex) => (
                            <Text key={setIndex} style={styles.setDetails}>
                            Set {set.setNumber}: {set.weight}kg x {set.reps}
                            </Text>
                        ))}
                        </View>
                    ))}
                    </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.completedWorkoutCloseButton} onPress={() => {onFinish(); onClose();}}>
          <Text style={styles.completedWorkoutCloseButtonText}>Close</Text>
        </TouchableOpacity>
            </View>
        </View>
        </Modal>
    )
};


const styles = StyleSheet.create({

    completedWorkoutModalContent: {
        width: '80%',
        height: '60%',
        backgroundColor: '#fff',
        marginTop: 100,
        marginBottom: 200,
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        elevation: 5,
      },

    completedWorkoutModalContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    completedWorkoutTitle:{
    
    },

    completedWorkoutTitleText:{
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold'
    },

    workoutDurationContainer:{
        marginTop: 20
    },

    workoutDurationText:{
        textAlign: 'center',
        fontSize: 18,
        
    },

    workoutDetailsContainer:{
      
    },

    CompletedExerciseName:{
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 20,
        fontSize: 18
    },

    setDetails:{
        marginBottom: 5,
        fontSize: 16
    },

    completedWorkoutCloseButton: {
        marginTop: 'auto',
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 8,
      },
      completedWorkoutCloseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },

});

export default CompletedWorkoutModal;