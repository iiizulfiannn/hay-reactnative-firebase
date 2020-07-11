import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {getData, removeData} from '../utils/localStorage';
import Firebase from '../config/Firebase';
import {showMessage} from 'react-native-flash-message';
import Header from '../components/Header';
import {ILNull} from '../assets';

const Profile = ({navigation}) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    getData('user').then(res => {
      const data = res;
      data.photo = !data.photo ? ILNull : {uri: data.photo};
      setUser(data);
    });
  }, [user]);

  const signOut = () => {
    Firebase.auth()
      .signOut()
      .then(() => {
        removeData('user');
        navigation.replace('SignIn');
      })
      .catch(err => {
        showMessage({
          message: err.message,
          type: 'default',
          backgroundColor: '#e74c3c',
          color: '#fff',
          duration: 3000,
        });
      });
  };

  return (
    <>
      <Header title="Profile" type="header-menu" />
      <View style={styles.container}>
        {user !== null && (
          <>
            <View style={styles.wrap}>
              <TouchableOpacity>
                <View style={styles.wrapper}>
                  <Image source={user.photo} style={styles.image} />
                </View>
              </TouchableOpacity>
              <Text style={styles.textName}>{user.fullname}</Text>
              <Text style={styles.textEmail}>{user.email}</Text>
            </View>
            <View style={styles.wrap2}>
              <TouchableOpacity
                style={styles.btnActive}
                onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.uploadText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnActiveCancel}
                onPress={signOut}>
                <Text style={styles.uploadTextCancel}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 40,
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: 'white',
  },
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrap2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: 130,
    height: 130,
    borderWidth: 1,
    borderColor: 'dodgerblue',
    borderRadius: 130 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
  },
  icon: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 8,
    right: 8,
    borderRadius: 50,
  },
  textName: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 10,
    textTransform: 'capitalize',
  },
  textEmail: {
    fontSize: 15,
    fontWeight: 'normal',
    marginVertical: 10,
    textTransform: 'capitalize',
  },
  textBiography: {
    fontSize: 15,
    fontWeight: '700',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  btnActive: {
    width: '100%',
    height: 40,
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 50,
  },
  btnActiveCancel: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 50,
  },
  btnNonActive: {
    width: '100%',
    height: 40,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 50,
  },
  skip: {
    textDecorationLine: 'underline',
    textDecorationColor: '#aaa',
  },
  uploadText: {
    fontSize: 16,
    color: '#fff',
  },
  uploadTextCancel: {
    fontSize: 16,
    color: 'dodgerblue',
  },
});
