/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Text} from 'react-native-paper';
import {UserNavigation} from '../NavigationBar';
import {UserHeader} from '../PageHeader';
import {firebase} from '@react-native-firebase/auth';

//main
export default function UserWallet({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;

  //get user wallet balance
  const [walletBalance, setWalletBalance] = React.useState(0);

  const fetchWalletBalance = async () => {
    if (curUser?.uid) {
      firebase
        .firestore()
        .collection('wallet')
        .doc(curUser?.uid)
        .get()
        .then(documentSnapshot => {
          // Document fields
          const walletDetails = documentSnapshot.data();
          console.log(walletDetails);
          // Get the document related data
          setWalletBalance(walletDetails?.balance);
        });
    }
  };
  useEffect(() => {
    fetchWalletBalance();
  }, [curUser]);

  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <View style={styles.containerUncentered}>
          {/* Banner */}
          <UserHeader navigation={navigation} />
          {/* Content */}
          <View style={styles.contentBox}>
            <View>
              <Text style={styles.homepagetext}>MyWallet</Text>
            </View>

            <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
              <View
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  width: 279,
                  height: 186,
                  borderRadius: 8,
                }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <ImageBackground
                    source={require('../../assets/walletbg.png')}
                    style={{width: 279, height: 186}}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 70,
                      }}>
                      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                        Your Balance:{' '}
                      </Text>
                      <Text>IDR. {walletBalance}</Text>
                    </View>
                  </ImageBackground>
                </View>
              </View>

              <TouchableOpacity
                style={{marginTop: 25}}
                onPress={() => {
                  navigation.push('UserWalletTopup');
                }}>
                <View
                  style={{
                    borderColor: 'black',
                    borderWidth: 1,
                    width: 319,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: '#A9FDAC',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
                    Top Up My Wallet
                  </Text>
                  <Image
                    source={require('../../assets/Arrow.png')}
                    style={{marginRight: 10}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Navigation */}
          <UserNavigation navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
}
