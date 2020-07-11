import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {ILNull} from '../assets';
import Loading from '../components/Loading';
import Firebase from '../config/Firebase';
import {getData} from '../utils/localStorage';

const Maps = () => {
  const [errMessage, setErrMessage] = useState(null);
  const [profile, setProfile] = useState({});
  const [dataUser, setDataUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    getDataUserFromLocal();
    Geolocation.getCurrentPosition(
      data => {
        if (profile.uid !== null || undefined || '') {
          setLatitude(data.coords.latitude);
          setLongitude(data.coords.longitude);
          getDataUser();
          Firebase.database()
            .ref(`users/${profile.uid}/`)
            .update({
              latitude: data.coords.latitude,
              longitude: data.coords.longitude,
            })
            .then(() => {
              setIsLoading(false);
            });
        }
      },
      err => {
        setErrMessage(err.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000},
    );
  }, [profile.uid]);

  const getDataUserFromLocal = () => {
    getData('user').then(res => {
      setProfile(res);
    });
  };

  const getDataUser = () => {
    Firebase.database()
      .ref('users/')
      .on('value', result => {
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
            return item.id !== 'undefined';
          });
          setDataUser(newData);
        }
      });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        profile &&
        (latitude && longitude) !== null && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude,
              longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            {dataUser.map(user => (
              <Marker
                coordinate={{
                  latitude: user.data.latitude,
                  longitude: user.data.longitude,
                }}
                key={user.id}>
                <View style={styles.imgWrap}>
                  <Image
                    style={styles.img}
                    source={user.data.photo ? {uri: user.data.photo} : ILNull}
                  />
                </View>
                <Callout tooltip>
                  <View style={styles.wrapper}>
                    <Text style={styles.name}>{user.data.fullname}</Text>
                    <Text style={styles.email}>{user.data.email}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        )
      )}
    </View>
  );
};

export default Maps;

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width,
    flex: 1,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  imgWrap: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    backgroundColor: 'yellow',
    marginRight: 10,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  email: {
    fontSize: 16,
    color: 'white',
  },
  wrapper: {
    flex: 1,
    width: width * 0.5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
