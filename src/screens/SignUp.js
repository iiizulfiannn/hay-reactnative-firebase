import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Loading from '../components/Loading';
import Firebase from '../config/Firebase';
import {useForm} from '../utils/useForm';
import {ILLogoBlue} from '../assets';

const SignUp = ({navigation}) => {
  const [form, setForm] = useForm({
    fullname: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const onContinue = () => {
    setLoading(true);
    Firebase.auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(success => {
        setLoading(false);
        setForm('reset');
        const data = {
          fullname: form.fullname,
          email: form.email,
          uid: success.user.uid,
        };

        Firebase.database()
          .ref(`users/${success.user.uid}/`)
          .set(data)
          .then(() => navigation.replace('SignIn'));
      })
      .catch(error => {
        const errorMessage = error.message;
        setLoading(false);
        showMessage({
          message: errorMessage,
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
        <Text style={styles.login}>REGISTER</Text>
        <Text style={styles.text}>'happy chat with soulmate friend'</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Fullname"
          value={form.fullname}
          onChangeText={value => setForm('fullname', value)} //formType formValue
        />
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
        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.textButton}>SIGN UP</Text>
        </TouchableOpacity>
        <Text>
          Have an account?{' '}
          <Text
            style={styles.textLink}
            onPress={() => navigation.replace('SignIn')}>
            Sign In
          </Text>
        </Text>
      </View>
      {loading && <Loading />}
    </>
  );
};

export default SignUp;

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
    paddingHorizontal: 10,
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
