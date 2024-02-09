/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
} from 'react-native';
//material ui + form
import {Divider} from 'react-native-paper';
import MerchantHeader from '../PageHeader';
import MerchantNavigation from '../NavigationBar';
import {styles} from '../Style';
//firebase stuff
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Geolocation from '@react-native-community/geolocation';

export default function MercantProfile({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //user data
  const [name, setname] = useState('Resto Name');
  const [category, setcategory] = useState('Category');
  const [price, setprice] = useState('Price');
  const [address, setaddress] = useState('Address');
  const [opening, setopening] = useState('0');
  const [closing, setclosing] = useState('24');

  //Fetch data from firestore
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUserInfo = async () => {
    if (curUser?.uid) {
      firestore()
        .collection('merchant')
        .doc(curUser?.uid)
        .get()
        .then(documentSnapshot => {
          // Document fields
          const userDetails = documentSnapshot.data();
          // All the document related data
          setname(userDetails?.Name);
          setcategory(userDetails?.Category);
          setprice(userDetails?.Price);
          setaddress(userDetails?.Address);
          setopening(userDetails?.Opening);
          setclosing(userDetails?.Closing);
        });
    }
  };
  //Profile picture
  const fullpath = '/merchant/' + 'ProfilePicture:' + curUser?.uid;
  const [imageUrl, setImageUrl] = useState('');
  const [isPfp, setisPfp] = React.useState(false);

  useEffect(() => {
    storage()
      .ref(fullpath) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImageUrl(url);
        setisPfp(true);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }, [fullpath]);

  //Fetch user data on start
  useEffect(() => {
    if (!isLoggedIn) {
      if (curUser) {
        fetchUserInfo();
        setIsLoggedIn(true);
      } else {
        console.log('Error in retrieving user data');
      }
    }
  }, [curUser, fetchUserInfo, isLoggedIn]);

  //create a variable that stores latitude and longitude
  const [_latitude, setLatitude] = useState(0);
  const [_longitude, setLongitude] = useState(0);

  const getUserLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if ((await granted) === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);
            setLatitude(latitude);
            setLongitude(longitude);
          },
          error => {
            console.log('Error:', error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <View style={styles.containerUncentered}>
      {/* Screen Header */}
      <MerchantHeader navigation={navigation} />
      {/* Page Content */}
      <View style={styles.profilePage}>
        <View
          style={{
            marginTop: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.picture}>
            {isPfp ? (
              <View>
                <Image
                  style={{height: 200, width: 200, borderRadius: 100}}
                  source={{uri: imageUrl}}
                />
              </View>
            ) : (
              <Image source={require('../../assets/scooter.png')} />
            )}
          </View>
          <Text style={styles.text}>{name}</Text>
          <Text>Category: {category}</Text>
          <Text>Pricing: {price}</Text>
          <Text>Address: {address}</Text>
          <Text>
            Open: {opening} - {closing}
          </Text>
        </View>

        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.box}>
            <TouchableOpacity
              onPress={() => {
                if (firestore().collection('merchant').doc(curUser?.uid)) {
                  //user has a merchant account already
                  navigation.push('MerchantEditProfile');
                } else {
                  //user needs to enter account info first
                  navigation.push('MerchantDetails');
                }
              }}>
              <Text style={styles.textBasic}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                getUserLocation();
                await firestore()
                  .collection('merchant')
                  .doc(curUser?.uid)
                  .update({
                    latitude: _latitude,
                    longitude: _longitude,
                    restoid: name + address,
                  });
              }}>
              <Text style={styles.textBasic}>Set Current Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Divider />
      {/* Screen Navigation */}
      <MerchantNavigation navigation={navigation} />
    </View>
  );
}
