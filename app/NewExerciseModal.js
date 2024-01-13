import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import BodyPartPickerModal from './BodyPartPickerModal';
import CategoryPicker from './CategoryPicker';
import NewPicker from './NewPicker';
import { BASE_URL } from '../config';


const NewExerciseModal = ({ isVisible, onClose, onSave }) => {
const { userInfo } = useContext(AuthContext);
const [exerciseName, setExerciseName] = useState('');
const [bodyPart, setBodyPart] = useState('');
const [number, setNumber] = useState('');
const [category, setCategory] = useState('');
const [showPickerModal, setShowPickerModal] = useState(false);
const [showCategoryPickerModal, setShowCategoryPickerModal] = useState(false);
const [showBodyPartPickerModal, setShowBodyPartPickerModal] = useState(false);


const handleCreateExercise = () => {
    // Check if all required data is available
    if (bodyPart && category && exerciseName) {
      onSave(bodyPart, category, exerciseName); // Call the function with data
    } else {
      console.error('Required data missing for exercise creation');
    }
  };


const handlePressOutside = () => {
    Keyboard.dismiss();
  };

const handleBodyPartPickerChange = (itemValue) => {
    setBodyPart(itemValue);
    console.log('New Body Part Selected ---->' + itemValue)
  };

const handleCategoryPickerChange = (itemValue) => {
    setCategory(itemValue);
    console.log('New Category Selected ---->' + itemValue);
  };

  const checkSaveAvailability = () => {
    return exerciseName !== '' && bodyPart !== '' && category !== '';
  };  


  const bodyParts = [
    'Arms',
    'Back',
    'Chest',
    'Core',
    'Full Body',
    'Legs',
    'Shoulders',
    'Other'
  ];

  const categories = [
    'Barbell',
    'Band',
    'Bodyweight',
    'Cable',
    'Cardio',
    'Dumbbells',
    'Kettlebells',
    'Machine',
    'Weighted',
    'Other'
  ];

  return (
    <Modal visible={isVisible} animationType='fade' transparent>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.exerciseModalHeading}>Add New Exercise</Text>
          <TextInput
            style={styles.selectExerciseName}
            placeholder="Exercise Name"
            placeholderTextColor="grey"
            value={exerciseName}
            onChangeText={(text) => {
                setExerciseName(text);
            }}
            />

          <View style={styles.pickerRow}>
            <TouchableOpacity onPress={() => setShowBodyPartPickerModal(true)} style={styles.selectBodyPart}>
                <Text style={styles.selectBodyPartText}>
                {bodyPart ? bodyPart : 'Body Part'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowCategoryPickerModal(true)} style={styles.selectBodyPart}>
                <Text style={styles.selectBodyPartText}>
                {category ? category : 'Category'}
                </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
                handleCreateExercise();
                onClose();
              }}
              
            style={[
                styles.saveButton,
                {
                backgroundColor: checkSaveAvailability() ? '#3498db' : '#ccc',
                },
            ]}
            disabled={!checkSaveAvailability()}
            >
            <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>


      <NewPicker
        isVisible={showBodyPartPickerModal}
        pickerItems={bodyParts}
        selectedPickerValue={bodyPart}
        onSelect={handleBodyPartPickerChange}
        pickerLabel={'Pick a Body Part'}
        pickerHeight={350}
        onClose={() => setShowBodyPartPickerModal(false)}
      />

        <NewPicker
        isVisible={showCategoryPickerModal}
        pickerItems={categories}
        selectedPickerValue={category}
        onSelect={handleCategoryPickerChange}
        pickerLabel={'Pick a Cateogry'}
        pickerHeight={350}
        onClose={() => setShowCategoryPickerModal(false)}
      />
       </View>
       </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
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
        height: 350,
        width: '80%',
      },
      exerciseModalHeading: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 30,
      },
      saveButton: {
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
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
      },
      selectExerciseName: {
        height: 35,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 30,
        justifyContent: 'center',

      },
      pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      selectBodyPart: {
       backgroundColor: '#F5F5F5',
        borderWidth: 0.5,
        height: 40,
        width: 100,
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
      
      selectBodyPartText: {
        textAlign: 'center',
        fontWeight: 'bold',
      },
});

export default NewExerciseModal;
