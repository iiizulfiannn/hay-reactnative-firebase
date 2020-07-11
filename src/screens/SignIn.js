import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useForm} from '../utils/useForm';
import Firebase from '../config/Firebase';
import {showMessage} from 'react-native-flash-message';
import Loading from '../components/Loading';
import {storeData} from '../utils/localStorage';
import {ILLogoBlue} from '../assets';

const SignIn = ({navigation}) => {
  const [form, setForm] = useForm({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    Firebase.auth()
      .signInWithEmailAndPassword(form.email, form.password)
      .then(res => {
        setLoading(false);
        Firebase.database()
          .ref(`users/${res.user.uid}/`)
          .once('value')
          .then(resDB => {
            if (resDB.val()) {
              storeData('user', resDB.val());
              navigation.replace('MainApp');
            }
          });
      })
      .catch(err => {
        setLoading(false);
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
      <View style={styles.container}>
        <Image source={ILLogoBlue} style={styles.image} />
        <Text style={styles.login}>LOGIN</Text>
        <Text style={styles.text}>'happy chat with soulmate friend'</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={form.email}
          onChangeText={value => setForm('email', value)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={form.password}
          onChangeText={value => setForm('password', value)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.textButton}>SIGN IN</Text>
        </TouchableOpacity>
        <Text>
          Don't have an account?{' '}
          <Text
            style={styles.textLink}
            onPress={() => navigation.replace('SignUp')}>
            Sign Up
          </Text>
        </Text>
      </View>
      {loading && <Loading />}
    </>
  );
};

export default SignIn;

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  login: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  text: {
    fontSize: 17,
    marginBottom: 60,
    color: '#999',
    fontStyle: 'italic',
  },
  image: {
    height: 100,
    width: 100,
    marginBottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    width: width * 0.8,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    width: width * 0.5,
    height: 40,
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 50,
  },
  textButton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textLink: {
    color: 'dodgerblue',
  },
});
