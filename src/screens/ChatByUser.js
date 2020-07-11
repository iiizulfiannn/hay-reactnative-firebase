import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ILNull} from '../assets';
import ChatItem from '../components/ChatItem';
import Header from '../components/Header';
import Firebase from '../config/Firebase';
import {getChatTime, setDateChat} from '../utils/date';
import {getData} from '../utils/localStorage';

const ChatByUser = ({navigation, route}) => {
  const dataUser = route.params;
  const [chatContent, setChatContent] = useState('');
  const [user, setUser] = useState({});
  const [setErr] = useState('');
  const [chatData, setChatData] = useState([]);
  const [user2, setUser2] = useState(false);

  useEffect(() => {
    getDataUserFromLocal();
    const chatID1 = `${user.uid}_${dataUser.uid}`;
    const chatID2 = `${dataUser.uid}_${user.uid}`;
    const urlFirebase1 = `chatting/${chatID1}/allChat/`;
    const urlFirebase2 = `chatting/${chatID2}/allChat/`;
    Firebase.database()
      .ref(urlFirebase1)
      .on('value', snapshot => {
        if (snapshot.val() !== null) {
          setUser2(false);
          const dataSnapshot = snapshot.val();
          const allDataChat = [];
          // tgl -> array
          Object.keys(dataSnapshot).map(key => {
            const dataChat = dataSnapshot[key];
            const newDataChat = [];
            Object.keys(dataChat).map(itemChat => {
              newDataChat.push({
                id: itemChat,
                data: dataChat[itemChat],
              });
            });
            allDataChat.push({
              id: key,
              data: newDataChat,
            });
          });
          setChatData(allDataChat);
        } else {
          Firebase.database()
            .ref(urlFirebase2)
            .on('value', snapshot2 => {
              if (snapshot2.val()) {
                setUser2(true);
                const dataSnapshot = snapshot2.val();
                const allDataChat = [];
                // tgl -> array
                Object.keys(dataSnapshot).map(key => {
                  const dataChat = dataSnapshot[key];
                  const newDataChat = [];
                  Object.keys(dataChat).map(itemChat => {
                    newDataChat.push({
                      id: itemChat,
                      data: dataChat[itemChat],
                    });
                  });
                  allDataChat.push({
                    id: key,
                    data: newDataChat,
                  });
                });
                setChatData(allDataChat);
              }
            });
        }
      });
  }, [dataUser.uid, user.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };

  const chatSend = () => {
    const today = new Date();

    const data = {
      sendBy: user.uid,
      chatDate: today.getTime(),
      chatTime: getChatTime(today),
      chatContent,
    };

    const chatID1 = `${user.uid}_${dataUser.uid}`;
    const chatID2 = `${dataUser.uid}_${user.uid}`;
    const urlFirebase = `chatting/${
      !user2 ? chatID1 : chatID2
    }/allChat/${setDateChat(today)}`;
    const urlMessageUser = `messages/${user.uid}/${!user2 ? chatID1 : chatID2}`;
    const urlMessageDataUser = `messages/${dataUser.uid}/${
      !user2 ? chatID1 : chatID2
    }`;
    const dataHistoryUser = {
      lastChat: chatContent,
      lastDate: today.getTime(),
      uidPartner: dataUser.uid,
    };
    const dataHistoryDataUser = {
      lastChat: chatContent,
      lastDate: today.getTime(),
      uidPartner: user.uid,
    };

    Firebase.database()
      .ref(urlFirebase)
      .push(data)
      .then(() => {
        setChatContent('');
        // set user
        Firebase.database()
          .ref(urlMessageUser)
          .set(dataHistoryUser);
        // set dataUser
        Firebase.database()
          .ref(urlMessageDataUser)
          .set(dataHistoryDataUser);
      })
      .catch(error => {
        setErr(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        type="header-chat-by-user"
        title={dataUser.fullname}
        photo={dataUser.photo ? {uri: dataUser.photo} : ILNull}
        onPress={() => navigation.navigate('Chat')}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {chatData.map(chat => {
          return (
            <View key={chat.id}>
              <Text style={styles.date}>{chat.id}</Text>
              {chat.data.map(item => {
                return (
                  <ChatItem
                    key={item.id}
                    isMe={item.data.sendBy === user.uid}
                    text={item.data.chatContent}
                    date={item.data.chatTime}
                  />
                );
              })}
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.chatInput}>
        <TextInput
          style={styles.textInput}
          placeholder="Type here ..."
          value={chatContent}
          onChangeText={value => setChatContent(value)}
        />
        <TouchableOpacity style={styles.buttonSend}>
          <Text style={styles.textSend} onPress={chatSend}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatByUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingVertical: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
    alignItems: 'center',
  },
  date: {
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  backIcon: {
    width: 50,
    alignItems: 'center',
  },
  textBack: {
    fontSize: 30,
    color: '#aaa',
  },
  userImage: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginRight: 10,
  },
  textUsername: {
    fontSize: 20,
  },
  chatInput: {
    height: 60,
    backgroundColor: 'dodgerblue',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  textInput: {
    backgroundColor: 'white',
    flex: 1,
    height: 40,
    paddingLeft: 15,
  },
  buttonSend: {
    width: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginLeft: 10,
    borderRadius: 50,
  },
  textSend: {
    color: 'dodgerblue',
  },
});
