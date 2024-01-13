import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';


const NewDatePicker = ({ isVisible, selectedDateTime, onSelect, onClose, btnText }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(isVisible);
  const [selectedDate, setSelectedDate] = useState(selectedDateTime || new Date());
  const [buttonText, setButtonText] = useState(btnText);

  useEffect(() => {
    if (selectedDateTime) {
      setButtonText(formatDate(selectedDateTime));
    } else {
      setButtonText(btnText);
    }
  }, [selectedDateTime]);

  const formatDate = (date) => {
    // Format the selected date to display it in the desired format
    // You can use libraries like Moment.js for advanced formatting
    return date.toISOString().split('T')[0]; // Displaying in YYYY-MM-DD format
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    onClose();
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    onSelect(date);
    hideDatePicker();
  };

  return (
    <View>
      <TouchableOpacity onPress={showDatePicker} style={styles.selectBodyPart}>
        <View style={styles.textRow}>
          <Text style={styles.selectBodyPartText}>{buttonText}</Text>
          <Ionicons name="calendar-outline" size={20} />
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={selectedDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  selectBodyPart: {
    backgroundColor: '#F5F5F5',
    borderWidth: 0.5,
    height: 40,
    width: '100%', // Adjust the width to accommodate the initial text
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
     fontFamily: 'MontserratSemiBold',
  },
});

export default NewDatePicker;
