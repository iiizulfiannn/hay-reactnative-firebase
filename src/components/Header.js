import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';

const Header = ({onPress, title, type, photo}) => {
  if (type === 'header-menu') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{title}</Text>
      </View>
    );
  }

  if (type === 'header-back') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress} style={styles.icon}>
          <MaterialCommunityIcons name="arrow-left" color="white" size={26} />
        </TouchableOpacity>
        <Text style={styles.text}>{title}</Text>
      </View>
    );
  }

  if (type === 'header-menu-search') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress} style={styles.icon}>
          <IonIcons name="search" color="white" size={20} />
        </TouchableOpacity>
        <Text style={styles.text}>{title}</Text>
      </View>
    );
  }

  if (type === 'header-search') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress} style={styles.icon}>
          <MaterialCommunityIcons name="arrow-left" color="white" size={26} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type here..."
          placeholderTextColor="white"
        />
      </View>
    );
  }

  if (type === 'header-chat-by-user') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress} style={styles.iconBackUser}>
          <MaterialCommunityIcons name="arrow-left" color="white" size={26} />
        </TouchableOpacity>
        <Image
          style={styles.userImage}
          source={photo === photo.uri ? {uri: photo} : photo}
        />
        <Text style={styles.textUsername}>{title}</Text>
      </View>
    );
  }
};

export default Header;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: 'dodgerblue',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
  },
  textUsername: {
    fontSize: 25,
    color: 'white',
  },
  icon: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  iconBackUser: {
    marginRight: 20,
    marginLeft: 8,
  },
  userImage: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingLeft: 60,
  },
});
