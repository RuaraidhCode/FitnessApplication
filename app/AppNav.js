import { View, Text, ActivityIndicator} from 'react-native';
import React, {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ProfileScreen from './ProfileScreen';
import ExerciseScreen from './Exercise';
import GoalsScreen from './Goals';
import SettingsScreen from './SettingsScreen';
import ExerciseListScreen from './ExerciseList';
import NewWorkoutScreen from './NewWorkout';
import CompletedWorkoutModalScreen from './CompletedWorkoutModal';
import CompetitionMenuScreen from './CompetitionMenu';
import CompetitionHistoryScreen from './CompetitionHistory';
import LeaderboardScreen from './Leaderboard';
import LeaderboardHistoryScreen from './LeaderboardHistory';
import AchievementScreen from './Achievement';

import TestScreen from './test';
import LevelTestScreen from './LevelingTest'

import { AuthContext, AuthProvider } from './AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const loginName = 'Login';
const profileName = 'Profile';
const exerciseName = 'Exercise';
const goalsName = 'Goals';
const settingsName = 'Settings';
const exerciseListName = 'ExerciseList';
const newWorkoutName = 'Workout';
const competitionName = 'Compete';
const competitionHistoryName = 'CompetitionHistory';
const leaderboardName = 'Leaderboard';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ExerciseStackScreen = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main Exercise" component={ExerciseScreen} />
        <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="NewWorkout" component={NewWorkoutScreen} />
        <Stack.Screen name="CompletedWorkout" component={CompletedWorkoutModalScreen} />
    </Stack.Navigator>
);

const LeaderboardStackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Compete" component={CompetitionMenuScreen} />
      <Stack.Screen name="CompetitionHistory" component={CompetitionHistoryScreen} />
      <Stack.Screen name="Leaderboard History" component={LeaderboardHistoryScreen} />
  </Stack.Navigator>
);

const ProfileStackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TheProfile" component={ProfileScreen} />
      <Stack.Screen name="Achievement" component={AchievementScreen} />
      <Stack.Screen name="Level Test" component={LevelTestScreen} />
  </Stack.Navigator>
);

const AppNav = () => {
    const {isLoading, userToken} = useContext(AuthContext)

    if( isLoading ){
        return(
        <View style={{flex:1, position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',}}>
            <ActivityIndicator size="large" color="blue" />
        </View>
        );
    }

    if (userToken) {
        return (
          <Tab.Navigator
            initialRouteName={profileName} 
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                let rn = route.name;
    
                if (rn === profileName) {
                  iconName = focused ? 'person' : 'person-outline';
                } else if (rn === exerciseName) {
                  iconName = focused ? 'barbell' : 'barbell-outline';
                } else if (rn === goalsName) {
                    iconName = focused ? 'fitness' : 'fitness-outline';
                } else if (rn === leaderboardName) {
                    iconName = focused ? 'podium' : 'podium-outline';
                } else if (rn === settingsName) {
                    iconName = focused ? 'settings' : 'settings-outline';
                }
    
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              headerShown: false,
              tabBarActiveTintColor: 'white',
              tabBarInactiveTintColor: '#3498db',
              tabBarStyle: {
                backgroundColor: '#28282B',
              },
            })}
           
          >
            <Tab.Screen name={profileName} component={ProfileStackScreen} />
            <Tab.Screen name={exerciseName} component={ExerciseStackScreen} />
            <Tab.Screen name={goalsName} component={GoalsScreen} />
            <Tab.Screen name={leaderboardName} component={LeaderboardStackScreen} />
            <Tab.Screen name={settingsName} component={SettingsScreen} />
          </Tab.Navigator>
        );
      } else {
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        );
      }
    };

export default AppNav;
