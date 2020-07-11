import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';
import Online from '../components/Online';
import Firebase from '../config/Firebase';
import {getData} from '../utils/localStorage';

const ChatList = ({navigation}) => {
  const [user, setUser] = useState({});
  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
    getDataUserFromLocal();

    // check status user if Online/Offline
    const uid = Firebase.auth().currentUser.uid;
    const userStatusDatabaseRef = Firebase.database().ref('users/' + uid);
    const isOfflineForDatabase = {status: false};
    const isOnlineForDatabase = {status: true};

    Firebase.database()
      .ref('.info/connected')
      .on('value', function(snapshot) {
        if (snapshot.val() === false) {
          return;
        }
        userStatusDatabaseRef
          .onDisconnect()
          .update(isOfflineForDatabase)
          .then(function() {
            userStatusDatabaseRef.update(isOnlineForDatabase);
          });
      });

    const rootDB = Firebase.database().ref();
    const urlHistory = `messages/${user.uid}/`;
    const messagesDB = rootDB.child(urlHistory);
    messagesDB.on('value', async snapshot => {
      const oldData = snapshot.val();
      if (oldData) {
        const data = [];
        const promises = await Object.keys(oldData).map(async key => {
          const urlUidUser = `users/${oldData[key].uidPartner}`;
          const detailUser = await rootDB.child(urlUidUser).once('value');
          data.push({
            id: key,
            detailUser: detailUser.val(),
            ...oldData[key],
          });
        });

        await Promise.all(promises);
        setDataUser(data);
      }
    });
  }, [user.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };

  return (
    <>
      <Header
        title="Chatting"
        type="header-menu-search"
        onPress={() => navigation.navigate('Search')}
      />
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            {dataUser.map(chat => {
              const {photo, fullname, uid} = chat.detailUser;
              const data = {uid, photo, fullname};
              return (
                <TouchableOpacity
                  key={chat.id}
                  style={styles.chatItem}
                  onPress={() => navigation.navigate('ChatByUser', data)}>
                  <Image
                    style={styles.chatItemImage}
                    source={{uri: chat.detailUser.photo}}
                  />
                  <View style={styles.desc}>
                    <View style={styles.name}>
                      <Text style={styles.fullname}>
                        {chat.detailUser.fullname}
                      </Text>
                      <Text style={styles.lastChat}>{chat.lastChat}</Text>
                    </View>
                    <Online isOnline={chat.detailUser.status} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ChatList;

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
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
