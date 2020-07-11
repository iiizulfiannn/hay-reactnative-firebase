import React, {useEffect} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {ILLogo} from '../assets';
import Firebase from '../config/Firebase';

const Splash = ({navigation}) => {
  useEffect(() => {
    const unsubscribe = Firebase.auth().onAuthStateChanged(user => {
      setTimeout(() => {
        if (user) {
          navigation.replace('MainApp');
        } else {
          navigation.replace('SignIn');
        }
      }, 3000);
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={ILLogo} style={styles.image} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'dodgerblue',
  },
  image: {
    height: 100,
    width: 100,
  },
});
