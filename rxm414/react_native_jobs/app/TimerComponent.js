import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimerComponent = ({ stopTimer, onTimerStop }) => { // Accept stopTimer prop
    const [time, setTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(!stopTimer); 

    useEffect(() => {
        setIsTimerRunning(!stopTimer); // Update isTimerRunning based on stopTimer prop
      
        if (isTimerRunning) {
          const interval = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
          }, 1000);
      
          return () => clearInterval(interval);
        } else if (!isTimerRunning && stopTimer) {
      onTimerStop(formatTime(time)); // Call the callback with the formatted time value
    }
      }, [stopTimer, time]);

      

      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      };
    
      return (
        <View style={styles.timerContainer}>
          <Text>{formatTime(time)}</Text>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    });
   

    export default TimerComponent;