import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';
import Firebase from '../config/Firebase';
import {storeData, defaultAvatar, getData} from '../utils/localStorage';
import {NavigationContainer} from '@react-navigation/native';
import Header from '../components/Header';
import {ILNull} from '../assets';

const EditProfile = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullname: '',
    email: '',
  });

  const [password, setpassword] = useState('');
  const [photo, setPhoto] = useState('');
  const [photoForDB, setPhotoForDB] = useState('');

  useEffect(() => {
    getData('user').then(res => {
      setPhoto(!res.photo ? ILNull : {uri: res.photo});
      setProfile(res);
    });
  }, [navigation]);

  const update = () => {
    if (password.length > 0) {
      if (password.length < 6) {
        showMessage({
          message: 'Password kurang dari 6 karakter',
          type: 'default',
          backgroundColor: '#e74c3c',
          color: 'white',
        });
      } else {
        updatePassword();
        updateProfileData();
        navigation.navigate('Profile');
      }
    } else {
      updateProfileData();
      navigation.navigate('Profile');
    }
  };

  const updatePassword = () => {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        user.updatePassword(password).catch(err => {
          showMessage({
            message: err.message,
            type: 'default',
            backgroundColor: '#e74c3c',
            color: '#fff',
            duration: 3000,
          });
        });
      }
    });
  };

  const updateProfileData = () => {
    const data = profile;
    if (photoForDB) {
      data.photo = photoForDB;
    }
    Firebase.database()
      .ref(`users/${profile.uid}/`)
      .update(data)
      .then(() => {
        storeData('user', data);
        showMessage({
          message: 'Success Update',
          type: 'default',
          backgroundColor: '#2ecc71',
          color: '#fff',
          duration: 3000,
        });
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

  const changeText = (key, value) => {
    setProfile({
      ...profile,
      [key]: value,
    });
  };

  const getImage = () => {
    ImagePicker.launchImageLibrary(
      {quality: 0.5, maxWidth: 200, maxHeight: 200},
      response => {
        if (response.didCancel || response.error) {
          showMessage({
            message: 'Oops, sepertinya anda tidak jadi memilih photo',
            type: 'default',
            backgroundColor: '#e74c3c',
            color: '#fff',
            duration: 3000,
          });
        } else {
          const source = {uri: response.uri};
          setPhotoForDB(`data:${response.type};base64, ${response.data}`);
          setPhoto(source);
        }
      },
    );
  };

  return (
    <>
      <Header
        title="Edit Profile"
        type="header-back"
        onPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.wrap}>
            <TouchableOpacity onPress={getImage}>
              <View style={styles.wrapper}>
                <Image source={photo} style={styles.image} />
              </View>
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Fullname"
              value={profile.fullname}
              onChangeText={value => changeText('fullname', value)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              value={profile.email}
              editable={false}
              onChangeText={value => changeText('email', value)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              value={password}
              onChangeText={value => setpassword(value)}
              secureTextEntry
            />
          </View>
          <View style={styles.wrap2}>
            <TouchableOpacity style={styles.btnActiveSave} onPress={update}>
              <Text style={styles.uploadTextSave}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnActiveCancel}
              onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.uploadTextCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default EditProfile;

const {width} = Dimensions.get('screen');

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
    marginTop: 30,
  },
  wrapper: {
    width: 130,
    height: 130,
    borderWidth: 1,
    borderColor: 'dodgerblue',
    borderRadius: 130 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  text: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 20,
  },
  btnActiveSave: {
    width: '100%',
    height: 40,
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 20,
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
  uploadTextSave: {
    fontSize: 16,
    color: '#fff',
  },
  uploadTextCancel: {
    fontSize: 16,
    color: 'dodgerblue',
  },

  textInput: {
    width: width * 0.8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    marginBottom: 10,
  },
});
