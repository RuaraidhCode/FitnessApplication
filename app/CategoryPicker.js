import React, { useState } from 'react';
import { StyleSheet, Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CategoryPicker = ({ isVisible, categories, selectedValue, onSelect, onClose }) => {
  return (
    <Modal visible={isVisible} animationType='fade' transparent>
      <View style={styles.pickerModalContainer}>
        <View style={styles.pickerModalContent}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => {
              if (itemValue) {
                onSelect(itemValue);
                onClose();
              }
            }}>
            <Picker.Item label="Select a Category" value="" />
            {categories.map((category) => (
              <Picker.Item key={category} label={category} value={category} />
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
  
export default CategoryPicker;