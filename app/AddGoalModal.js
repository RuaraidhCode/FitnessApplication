import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import NewPicker from './NewPicker';
import NewDatePicker from './NewDatePicker'; 


const AddGoalModal = ({ isVisible, onClose, onSave }) => {
  const [category, setCategory] = useState('');
  const [isGoalSettingTipsModalVisible, setIsGoalSettingTipsModalVisible] = useState(false);
  const [goalDescription, setGoalDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [targetDate, setTargetDate] = useState(new Date());
  const { userInfo } = useContext(AuthContext);
  const [date, setDate] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  const [showCategoryPickerModal, setShowCategoryPickerModal] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showTargetDatePicker, setShowTargetDatePicker] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showStartDatePickerModal, setShowStartDatePickerModal] = useState(false);
  const [showEndDatePickerModal, setShowEndDatePickerModal] = useState(false);
  const goalCategories = ['Lose Weight', 'Gain Weight', 'Strength'];
  

  const handleSave = () => {
    onSave({ category, goalDescription, targetDate: targetDate.toLocaleDateString(), startDate: startDate.toLocaleDateString() });
    setCategory('');
    setGoalDescription('');
    setTargetDate('');
    setStartDate('');
  };

  const handleCategoryPickerChange = (itemValue) => {
    setCategory(itemValue);
    console.log('New Category Selected ---->' + itemValue);
  };
  

  const onCloseStartDatePicker = () => {
    setShowStartDatePickerModal(false);
  };

  const onCloseEndDatePicker = () => {
    setShowStartDatePickerModal(false);
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          <TextInput
            style={styles.selectTextInput}
            placeholder="Goal Description"
            placeholderTextColor="grey"
            value={goalDescription}
            onChangeText={setGoalDescription}
          />

            <TouchableOpacity onPress={() => setShowCategoryPickerModal(true)} style={styles.selectBodyPart}>
                <Text style={styles.selectBodyPartText}>
                {category ? category : 'Category'}
                </Text>
            </TouchableOpacity>

          
            <NewDatePicker
            isVisible={showStartDatePickerModal}
            selectedDateTime={selectedStartDate}
            onSelect={(selectedDate) => {
              setSelectedStartDate(selectedDate);
              setStartDate(selectedDate);
              console.log('selected start date --> ' + selectedDate)
            }}
            onClose={onCloseStartDatePicker}
            btnText={'Pick Start Date'}
          />

          <NewDatePicker
            isVisible={showEndDatePickerModal}
            selectedDateTime={selectedEndDate}
            onSelect={(selectedDate) => {
              setSelectedEndDate(selectedDate);
              setTargetDate(selectedDate);
              console.log('selected end date --> ' + selectedDate)
            }}
            onClose={onCloseEndDatePicker}
            btnText={'Pick End Date'}
          />

              
        <NewPicker
        isVisible={showCategoryPickerModal}
        pickerItems={goalCategories}
        selectedPickerValue={category}
        onSelect={handleCategoryPickerChange}
        pickerLabel={'Pick a Category'}
        pickerHeight={350}
        onClose={() => setShowCategoryPickerModal(false)}
      />
          
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
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
      input: {
        paddingTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 20,
        fontSize: 16,
      },
      saveButton: {
        backgroundColor: '#3498db',
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
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
        color: '#3498db',
      },
      selectTextInput: {
        backgroundColor: '#F5F5F5',
        fontFamily: 'MontserratMedium',
        borderWidth: 0.5,
        height: 40,
        width: '100%',
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
      buttonTextContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
      },

      selectButtonText: {
        fontSize: 14,
        color: 'grey'
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
         fontFamily: 'MontserratSemiBold',
       },
});

export default AddGoalModal;
