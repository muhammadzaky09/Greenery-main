/* eslint-disable react-native/no-inline-styles */
import {Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';

//user session
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

//others
import {styles} from '../Style';
import MerchantNavigation from '../NavigationBar';
import MerchantHeader from '../PageHeader';

const ButtonBox = props => {
  return (
    <View style={styles.buttonBox}>
      <TouchableOpacity style={styles.touchButton} onPress={props.navigation}>
        <Image source={props.image} style={styles.ImgPlacement} />
      </TouchableOpacity>
      <Text style={styles.buttonTitle}>{props.name}</Text>
    </View>
  );
};

export default function MerchantMenu({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [name, setname] = useState('');
  const [address, setaddress] = useState('');
  var restoID = name + address;

  //#region AUTHENTICATION
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUserInfo = async () => {
    if (curUser?.uid) {
      firestore()
        .collection('merchant')
        .doc(curUser?.uid)
        .get()
        .then(documentSnapshot => {
          const userDetails = documentSnapshot.data();
          setname(userDetails?.Name);
          setaddress(userDetails?.Address);
        });
    }
  };

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
  //#endregion

  console.log(restoID);
  return (
    <View style={styles.containerUncentered}>
      <ScrollView>
        {/* Banner */}
        <MerchantHeader navigation={navigation} />
        {/* Content */}
        <View style={styles.contentBox}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.homepagetext}>Menu:</Text>

            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  marginTop: 30,
                  marginRight: 5,
                }}
                onPress={() => {
                  navigation.push('MerchantAddMenu', {
                    foodID: 'new',
                  });
                }}>
                Add New Menu
              </Text>
              <Image
                source={require('../../assets/Add.png')}
                style={{marginTop: 32, marginRight: 50}}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20,
            }}>
            <ButtonBox
              image={require('../../assets/TodayPromo.png')}
              name="Today's Promo"
            />

            <ButtonBox
              image={require('../../assets/BestSeller.png')}
              name="Bestselling"
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 80,
            }}>
            <ButtonBox
              image={require('../../assets/Appetizer.png')}
              name="Appetizer"
              navigation={() => {
                navigation.push('MerchantAppetizer', {resto: name});
              }}
            />
            <ButtonBox
              image={require('../../assets/MainCourse.png')}
              name="Main"
              navigation={() => {
                navigation.push('MerchantMainCourse', {resto: restoID});
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 80,
              marginBottom: 80,
            }}>
            <ButtonBox
              image={require('../../assets/Dessert.png')}
              name="Dessert"
              navigation={() => {
                navigation.push('MerchantDessert', {resto: restoID});
              }}
            />
            <ButtonBox
              image={require('../../assets/Extra.png')}
              name="Extras"
            />
          </View>
        </View>

        {/* Navigation */}
        <MerchantNavigation navigation={navigation} />
      </ScrollView>
    </View>
  );
}
