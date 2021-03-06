import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function ChatMe({text, date}) {
  return (
    <View style={styles.container}>
      <View style={styles.chatContent}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <Text style={styles.time}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  chatContent: {
    backgroundColor: '#e8f3ff',
    padding: 10,
    maxWidth: '70%',
  },
  time: {
    fontSize: 12,
    color: 'grey',
  },
});
