import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Online = ({isOnline}) => {
  return <View style={styles.bulet(isOnline)} />;
};

export default Online;

const styles = StyleSheet.create({
  bulet: isOnline => ({
    height: 10,
    width: 10,
    backgroundColor: isOnline ? 'green' : 'red',
    borderRadius: 10 / 2,
  }),
});
