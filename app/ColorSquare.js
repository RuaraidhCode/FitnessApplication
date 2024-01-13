import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import the Picker component you're using
import { set } from 'react-native-reanimated';

const ColorSquare = ({ selectedColor, onColorChange, colorOptions }) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColorr, setSelectedColorr] = useState('');

  const togglePicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };


  const handleColorChange = (color) => {
    onColorChange(color); // Update the color using the onColorChange function
    setSelectedColorr(color); // Update the selectedColorr state
    setIsPickerVisible(false);
    setIsModalVisible(false);
  };
  

  return (
    <TouchableOpacity onPress={() => {togglePicker(); setIsModalVisible(true)}} style={styles.colorSquare}>
      <View style={[styles.colorDisplay, { backgroundColor: selectedColor }]} />
      <Modal animationType='fade' transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
  <View style={styles.modalContentContainer}>
    <View style={styles.modalContent}>
      {isPickerVisible ? (
        <Picker
          selectedValue={selectedColorr}
          onValueChange={(itemValue) => {
            if (itemValue) {
              handleColorChange(itemValue);
              setIsPickerVisible(false);
              setIsModalVisible(false);
            }
          }}
          style={styles.colorPicker}
        >
          <Picker.Item label="Select a colour" value="" />
          {colorOptions.map((color) => (
            <Picker.Item key={color} label={color} value={color} />
          ))}
        </Picker>
      ) : (
        <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={styles.selectButton}>
          <Text style={styles.selectButtonText}>
            {selectedColorr ? selectedColorr : 'Select a colour'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
</Modal>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

modalContentContainer: {
    flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
    },

    modalContent:{
    width: '80%',
    height: 280,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
    },

  colorSquare: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  colorDisplay: {
    width: 50, // Adjust the size as needed
    height: 50, // Adjust the size as needed
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    marginTop: 15,
    marginRight: 35,
  },

  colorPicker: {
    width: 200, // Adjust the size as needed
    height: 250, // Adjust the size as needed
  },

  selectButton: {
    height: 50,
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 40,
    justifyContent: 'center',
  },
});

export default ColorSquare;
