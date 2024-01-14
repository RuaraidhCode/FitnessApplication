import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { BASE_URL } from '../config';
import { BarChart} from "react-native-gifted-charts";

const LevelingTesting = () => {
  const currentDate = new Date();
  const last8WeeksData = [];
  const [userWorkoutHistory, setUserWorkoutHistory] = useState([]);
  const [userWeekStartDate, setUserWeekStartDate] = useState('');
  const { userInfo } = useContext(AuthContext);
  const [weekOne, setWeekOne] = useState();
  const [weekTwo, setWeekTwo] = useState();
  const [weekThree, setWeekThree] = useState();
  const [weekFour, setWeekFour] = useState();
  const [weekFive, setWeekFive] = useState();
  const [weekSix, setWeekSix] = useState();
  const [weekSeven, setWeekSeven] = useState();
  const [weekEight, setWeekEight] = useState();

  const [weekOneShort, setWeekOneShort] = useState();
  const [weekTwoShort, setWeekTwoShort] = useState();
  const [weekThreeShort, setWeekThreeShort] = useState();
  const [weekFourShort, setWeekFourShort] = useState();
  const [weekFiveShort, setWeekFiveShort] = useState();
  const [weekSixShort, setWeekSixShort] = useState();
  const [weekSevenShort, setWeekSevenShort] = useState();
  const [weekEightShort, setWeekEightShort] = useState();
  


  

  const barData = [
    { value: 4, frontColor: '#177AD5', label: weekOneShort,  labelWidth: 20, labelTextStyle: {color: 'gray', fontSize: 7, textAlign: 'left'}},
    { value: 4, frontColor: '#177AD5', label: weekTwoShort,  labelWidth: 20, labelTextStyle: {color: 'gray', fontSize: 7, textAlign: 'left'}},
    { value: 4, frontColor: '#177AD5', label: weekThreeShort,  labelWidth: 20, labelTextStyle: {color: 'gray', fontSize: 7, textAlign: 'left'} },
    { value: 5, frontColor: '#177AD5', label: weekFourShort,  labelWidth: 20, labelTextStyle: {color: 'gray', fontSize: 7, textAlign: 'left'} },
    { value: 4, frontColor: '#177AD5', label: weekFiveShort,  labelWidth: 20, labelTextStyle: {color: 'gray', fontSize: 7, textAlign: 'left'} },
    { value: 5, frontColor: '#177AD5', label: weekSixShort,  labelWidth: 20, labelTextStyle: {color: 'gray', fontSize: 7, textAlign: 'left'} },
    { value: 3, frontColor: '#177AD5', label: weekSevenShort,  labelWidth: 20, labelTextStyle: {color: 'gray', fontSize: 7, textAlign: 'left'} },
    { value: 5, frontColor: '#177AD5', label: weekEightShort,  labelWidth: 20, labelTextStyle: {color: 'gray', fontSize: 7, textAlign: 'left'} }
  ];
  


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {


      const workoutHistoryResponse = await axios.get(`${BASE_URL}/api/workoutHistory?user_id=${userInfo.user_id}`);
      const userWorkoutHistoryData = workoutHistoryResponse.data
      setUserWorkoutHistory(userWorkoutHistoryData);

      const weekStartDateResponse = await axios.get(`${BASE_URL}/api/weekStartDate?user_id=${userInfo.user_id}`);

      const weekStartDate = weekStartDateResponse.data
      formattedWeekStartDate = weekStartDate[0].week_start_date.substring(0, 10)
      setUserWeekStartDate(weekStartDate[0].week_start_date.substring(0, 10));
     // console.log('current date ----> ', formattedDate);

      const startDate = new Date(weekStartDate[0].week_start_date);


      const withinWeek = userWorkoutHistoryData.filter(entry => {
        const workoutDate = new Date(entry.workout_date);
        const differenceInDays = Math.floor((workoutDate.getTime() - new Date(weekStartDate[0].week_start_date).getTime()) / (1000 * 60 * 60 * 24))
        return differenceInDays >= 0 && differenceInDays <= 7;
      });
      
      const countOfWorkoutsWithinWeek = withinWeek.length;
      setWeekOne(countOfWorkoutsWithinWeek);


      const weekTwoStart = new Date(weekStartDate[0].week_start_date);
      const weekOneEnd = new Date(weekStartDate[0].week_start_date);
      const weekTwoEnd = new Date(weekStartDate[0].week_start_date);
      const weekThreeEnd = new Date(weekStartDate[0].week_start_date);
      const weekFourEnd = new Date(weekStartDate[0].week_start_date);
      const weekFiveEnd = new Date(weekStartDate[0].week_start_date);
      const weekSixEnd = new Date(weekStartDate[0].week_start_date);
      const weekSevenEnd = new Date(weekStartDate[0].week_start_date);
      const weekEightEnd = new Date(weekStartDate[0].week_start_date);

      weekOneEnd.setDate(weekOneEnd.getDate() + 7);
      weekTwoEnd.setDate(weekTwoEnd.getDate() + 14);
      weekThreeEnd.setDate(weekThreeEnd.getDate() + 21);
      weekFourEnd.setDate(weekFourEnd.getDate() + 28);
      weekFiveEnd.setDate(weekFiveEnd.getDate() + 35);
      weekSixEnd.setDate(weekSixEnd.getDate() + 42);
      weekSevenEnd.setDate(weekSevenEnd.getDate() + 49);
      weekEightEnd.setDate(weekEightEnd.getDate() + 56);

      const formattedWeekOneEnd = weekOneEnd.toISOString().substring(5, 10);
      setWeekOneShort(formattedWeekOneEnd);

      console.log('WEEKONESHORT ---> ', formattedWeekOneEnd)

      const formattedWeekTwoEnd = weekTwoEnd.toISOString().substring(5, 10);
      setWeekTwoShort(formattedWeekTwoEnd);

      console.log('WEEKTWOSHORT ---> ', formattedWeekTwoEnd)

      const formattedWeekThreeEnd = weekThreeEnd.toISOString().substring(5, 10);
      setWeekThreeShort(formattedWeekThreeEnd);

      console.log('WEEKTHREESHORT ---> ', formattedWeekThreeEnd)

      const formattedWeekFourEnd = weekFourEnd.toISOString().substring(5, 10);
      setWeekFourShort(formattedWeekFourEnd);

      console.log('WEEKFOURSHORT ---> ', formattedWeekFourEnd)

      const formattedWeekFiveEnd = weekFiveEnd.toISOString().substring(5, 10);
      setWeekFiveShort(formattedWeekFiveEnd);

      console.log('WEEKFIVESHORT ---> ', formattedWeekFiveEnd)

      const formattedWeekSixEnd = weekSixEnd.toISOString().substring(5, 10);
      setWeekSixShort(formattedWeekSixEnd);

      console.log('WEEKSIXSHORT ---> ', formattedWeekSixEnd)

      const formattedWeekSevenEnd = weekSevenEnd.toISOString().substring(5, 10);
      setWeekSevenShort(formattedWeekSevenEnd);

      console.log('WEEKSEVENSHORT ---> ', formattedWeekSevenEnd)

      const formattedWeekEightEnd = weekEightEnd.toISOString().substring(5, 10);
      setWeekEightShort(formattedWeekEightEnd);

      console.log('WEEKEIGHTSHORT ---> ', formattedWeekEightEnd)


      const withinWeekTwo = userWorkoutHistoryData.filter(entry => {
        const workoutDate = new Date(entry.workout_date);
        const differenceInDays = Math.floor((workoutDate - weekTwoStart) / (1000 * 60 * 60 * 24));
        return differenceInDays >= 7 && differenceInDays <= 14; // Within 7 to 14 days of the week start
      });
      const countOfWorkoutsWithinWeekTwo = withinWeekTwo.length;
      setWeekTwo(countOfWorkoutsWithinWeekTwo);
      
      console.log('It should be true if a number'); // Will log true if weekOne is a number
      console.log(typeof weekOne === 'number'); // Will log true if weekOne is a number



      const withinWeekThree = userWorkoutHistoryData.filter(entry => {
        const workoutDate = new Date(entry.workout_date);
        const differenceInDays = Math.floor((workoutDate - weekTwoStart) / (1000 * 60 * 60 * 24));
        return differenceInDays > 14 && differenceInDays <= 21; // Within 7 to 14 days of the week start
      });
      const countOfWorkoutsWithinWeekThree = withinWeekThree.length;
      setWeekThree(countOfWorkoutsWithinWeekThree);


      const withinWeekFour = userWorkoutHistoryData.filter(entry => {
        const workoutDate = new Date(entry.workout_date);
        const differenceInDays = Math.floor((workoutDate - weekTwoStart) / (1000 * 60 * 60 * 24));
        return differenceInDays > 21 && differenceInDays <= 28; // Within 7 to 14 days of the week start
      });
      const countOfWorkoutsWithinWeekFour = withinWeekFour.length;
      setWeekFour(countOfWorkoutsWithinWeekFour);


      const withinWeekFive = userWorkoutHistoryData.filter(entry => {
        const workoutDate = new Date(entry.workout_date);
        const differenceInDays = Math.floor((workoutDate - weekTwoStart) / (1000 * 60 * 60 * 24));
        return differenceInDays > 28 && differenceInDays <= 35; // Within 7 to 14 days of the week start
      });
      const countOfWorkoutsWithinWeekFive = withinWeekFive.length;
      setWeekFive(countOfWorkoutsWithinWeekFive);


      const withinWeekSix = userWorkoutHistoryData.filter(entry => {
        const workoutDate = new Date(entry.workout_date);
        const differenceInDays = Math.floor((workoutDate - weekTwoStart) / (1000 * 60 * 60 * 24));
        return differenceInDays > 35 && differenceInDays <= 42; // Within 7 to 14 days of the week start
      });
      const countOfWorkoutsWithinWeekSix = withinWeekSix.length;
      setWeekSix(countOfWorkoutsWithinWeekSix);


      const withinWeekSeven = userWorkoutHistoryData.filter(entry => {
        const workoutDate = new Date(entry.workout_date);
        const differenceInDays = Math.floor((workoutDate - weekTwoStart) / (1000 * 60 * 60 * 24));
        return differenceInDays > 42 && differenceInDays <= 49; // Within 7 to 14 days of the week start
      });
      const countOfWorkoutsWithinWeekSeven = withinWeekSeven.length;
      setWeekSeven(countOfWorkoutsWithinWeekSeven);


      const withinWeekEight = userWorkoutHistoryData.filter(entry => {
        const workoutDate = new Date(entry.workout_date);
        const differenceInDays = Math.floor((workoutDate - weekTwoStart) / (1000 * 60 * 60 * 24));
        return differenceInDays > 49 && differenceInDays <= 56; // Within 7 to 14 days of the week start
      });
      const countOfWorkoutsWithinWeekEight = withinWeekEight.length;
      setWeekEight(countOfWorkoutsWithinWeekEight);
      

    } catch (error) {
      console.log(error.message);
    }

  };




  return (
    <View style={styles.container}>
      {weekOne !== undefined && weekTwo !== undefined  && weekThree !== undefined && weekFour !== undefined && weekFive !== undefined  && weekSix !== undefined  && weekSeven !== undefined  && weekEight !== undefined && (
        <View style={styles.chartContainer}>
          <BarChart
            barWidth={12}
            noOfSections={7}
            barBorderRadius={3}
            frontColor="lightgray"
            data={barData}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisType={'solid'}
            xAxisColor={'lightgray'}
            maxValue={7}
            rulesType='solid'
            spacing={15}
          />
          </View>
        )}
  </View>
  );
};

const styles = StyleSheet.create({
  
  chartContainer: {
    width: 280,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LevelingTesting;