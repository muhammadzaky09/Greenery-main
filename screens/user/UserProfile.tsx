/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {View, Image, TouchableOpacity, Text, SafeAreaView} from 'react-native';
//material ui + form
import {Divider} from 'react-native-paper';
import {UserHeader} from '../PageHeader';
import {UserNavigation} from '../NavigationBar';
import {styles} from '../Style';
//firebase
import storage from '@react-native-firebase/storage';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function UserProfile({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;
  const fullpath = '/userProfile/' + 'ProfilePicture:' + curUser?.uid;
  const [imageUrl, setImageUrl] = useState('');
  const [isPfp, setisPfp] = React.useState(false);
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

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
    const fetchUserInfo = async () => {
      if (curUser?.uid) {
        firestore()
          .collection('user')
          .doc(curUser?.uid)
          .get()
          .then(documentSnapshot => {
            // Document fields
            const userDetails = documentSnapshot.data();
            console.log(userDetails);
            // Get the document related data
            setName(userDetails?.Name);
            setPhoneNo(userDetails?.PhoneNumber);
          });
      }
    };

    if (curUser) {
      fetchUserInfo();
    } else {
      console.log('Error in retrieving user data');
    }
  }, [curUser]);

  return (
    <SafeAreaView>
      <View style={styles.containerUncentered}>
        {/* <PartnerSidebar /> */}
        {/* Screen Header */}
        <UserHeader navigation={navigation} />
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
                <Image source={require('../../assets/person.png')} />
              )}
            </View>
            <Text style={styles.text}>{name}</Text>
            <Text>{phoneNo}</Text>
          </View>

          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <View style={styles.box}>
              <Text style={styles.textBasic}>Activity</Text>
            </View>

            <View style={styles.box}>
              <TouchableOpacity
                onPress={() => {
                  firestore()
                    .collection('user')
                    .doc(curUser?.uid)
                    .get()
                    .then(function (querySnapshot) {
                      if (querySnapshot.exists) {
                        //user has a user account already
                        navigation.push('UserEditProfile');
                        console.log('to edit profile');
                      } else {
                        //user needs to enter account info first
                        navigation.push('UserDetails');
                        console.log('to user details');
                      }
                    });
                }}>
                <Text style={styles.textBasic}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* DEV: Create Wallet */}
            <View style={styles.box}>
              <TouchableOpacity
                onPress={async () => {
                  //create wallet document for user in wallet collection in firestore
                  await firestore()
                    .collection('wallet')
                    .doc(curUser?.uid)
                    .set({balance: 100000})
                    .then(() => {
                      console.log('Wallet Created!');
                      //create subcollection called history
                      firestore()
                        .collection('wallet')
                        .doc(curUser?.uid)
                        .collection('history')
                        .doc('history')
                        .set({history: []})
                        .then(() => {
                          console.log('History created!');
                        });
                    })
                    .catch(error => {
                      console.error('Error updating balance: ', error);
                    });
                }}>
                <Text style={styles.textBasic}>Create Wallet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Divider />
        {/* Screen Navigation */}
        <UserNavigation navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}
