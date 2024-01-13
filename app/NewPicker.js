import React, { useState } from 'react';
import { StyleSheet, Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const NewPicker = ({ isVisible, pickerItems, selectedPickerValue, onSelect, onClose, pickerLabel, pickerHeight, pickerBackgroundColor }) => {
  return (
    <Modal visible={isVisible} animationType='fade' transparent>
      <View style={[styles.pickerModalContainer, {backgroundColor: pickerBackgroundColor }]}>
      <View style={[styles.pickerModalContent, { height: pickerHeight }]}>
          <Picker
            selectedValue={selectedPickerValue}
            onValueChange={(itemValue) => {
              if (itemValue) {
                onSelect(itemValue);
                onClose();
              }
            }}>
            <Picker.Item label={pickerLabel} value="" />
            {pickerItems.map((pickerItem) => (
              <Picker.Item key={pickerItem} label={pickerItem} value={pickerItem} />
            ))}
          </Picker>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
   

    pickerModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      pickerModalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        elevation: 10,
        width: '80%',
        height: 350,
        justifyContent: 'center'
      },
  });
  
export default NewPicker;