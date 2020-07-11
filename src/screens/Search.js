import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';
import Online from '../components/Online';
import Firebase from '../config/Firebase';
import {getData} from '../utils/localStorage';

const Search = ({navigation}) => {
  const [dataUser, setDataUser] = useState([]);
  useEffect(() => {
    getData('user').then(res => {
      Firebase.database()
        .ref('users/')
        .once('value')
        .then(result => {
          const oldData = result.val();
          if (oldData) {
            const data = [];
            Object.keys(oldData).map(key => {
              data.push({
                id: key,
                data: oldData[key],
              });
            });
            const newData = data.filter(item => {
              return res.uid !== item.id && item.id !== 'undefined';
            });
            setDataUser(newData);
          }
        });
    });
  }, []);

  return (
    <View>
      <Header type="header-search" onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        {dataUser.map(user => {
          return (
            <TouchableOpacity
              key={user.id}
              style={styles.chatItem}
              onPress={() => navigation.navigate('ChatByUser', user.data)}>
              <Image
                style={styles.chatItemImage}
                source={{uri: user.data.photo}}
              />
              <View style={styles.desc}>
                <View style={styles.name}>
                  <Text style={styles.fullname}>{user.data.fullname}</Text>
                  <Text style={styles.lastChat}>{user.data.email}</Text>
                </View>
                <Online isOnline={user.data.status} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Search;

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  iconStyle: {
    marginRight: 15,
  },
  textInput: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  desc: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingRight: 20,
  },
  chatItem: {
    width,
    height: 75,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  chatItemImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 50,
    marginRight: 20,
  },
  fullname: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastChat: {
    fontSize: 13,
    color: 'grey',
  },
});
