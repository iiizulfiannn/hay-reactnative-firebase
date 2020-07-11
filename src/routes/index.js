import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ChatListScreen from '../screens/ChatList';
import MapsScreen from '../screens/Maps';
import EditProfileScreen from '../screens/EditProfile';
import ProfileScreen from '../screens/Profile';
import ChatByUserScreen from '../screens/ChatByUser';
import SplashScreen from '../screens/Splash';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import SearchScreen from '../screens/Search';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainApp = () => (
  <Tab.Navigator
    initialRouteName="Chat"
    tabBarOptions={{
      // tabStyle: {
      //   backgroundColor: 'dodgerblue',
      // },
      activeTintColor: 'white',
      activeBackgroundColor: 'dodgerblue',
      inactiveTintColor: '#125699',
      inactiveBackgroundColor: 'dodgerblue',
      showLabel: false,
    }}>
    <Tab.Screen
      name="Chat"
      component={ChatListScreen}
      options={{
        tabBarLabel: 'Chat',
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons name="chat" color={color} size={32} />
        ),
      }}
    />
    <Tab.Screen
      name="Maps"
      component={MapsScreen}
      options={{
        tabBarLabel: 'Maps',
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons name="map" color={color} size={32} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons name="account" color={color} size={32} />
        ),
      }}
    />
  </Tab.Navigator>
);

const Router = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Splash">
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="MainApp" component={MainApp} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChatByUser" component={ChatByUserScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
    </Stack.Navigator>
  );
};

export default Router;

const styles = StyleSheet.create({
  barBackground: {
    backgroundColor: 'white',
    borderTopColor: '#e9e9e9',
    borderTopWidth: 1,
  },
});
