import React, { useRef } from 'react';
import { Text, View, StyleSheet, PanResponder, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Test = () => {
  const pan = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      Animated.event(
        [
          null,
          {
            dx: pan.x, // Horizontal movement
            dy: pan.y, // Vertical movement
          },
        ],
        { useNativeDriver: false }
      )(_, gesture);

      // Determine rotation direction based on vertical movement
      const rotateDirection = pan.y._value > 0 ? -1 : 1; // Clockwise for upwards, anticlockwise for downwards
      const rotationSpeed = Math.abs(pan.y._value) * rotateDirection * 0.05; // Adjust rotation speed
      Animated.spring(rotation, {
        toValue: rotationSpeed,
        useNativeDriver: false,
      }).start();
    },
    onPanResponderRelease: () => {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  const animatedStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { rotateZ: rotation.interpolate({ inputRange: [-1, 1], outputRange: ['-45deg', '45deg'] }) },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View {...panResponder.panHandlers} style={[styles.box, animatedStyle]}>
        <LinearGradient colors={['#FF6B6B', '#FFE66D']} style={styles.gradient}>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0', // Background color of the container
    },
    box: {
      width: 150,
      height: 100,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 10,
    },
    gradient: {
      width: '100%',
      height: '100%',
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: '#fff',
    },
  });
  
export default Test;
