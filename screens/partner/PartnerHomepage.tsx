/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import 'react-native-gesture-handler';
import {View, Image, TouchableOpacity} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Text} from 'react-native-paper';
import {PartnerNavigation} from '../NavigationBar';
import {PartnerHeader} from '../PageHeader';

//main
export default function PartnerHomepage({navigation}: {navigation: any}) {
  // eslint-disable-next-line react/no-unstable-nested-components
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

  return (
    <View style={{flex: 1}}>
      <View style={styles.containerUncentered}>
        {/* Banner */}
        <PartnerHeader navigation={navigation} />
        {/* Content */}
        <View style={styles.contentBox}>
          <View>
            <Text style={styles.homepagetext}>
              What would you like to do today?
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20,
            }}>
            <ButtonBox
              image={require('../../assets/motorbike.png')}
              name="Go On Duty!"
            />

            <ButtonBox
              image={require('../../assets/photo.png')}
              name="Profile"
              navigation={() => {
                navigation.push('PartnerProfile');
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 80,
            }}>
            <ButtonBox
              image={require('../../assets/wallet.png')}
              name="MyWallet"
            />
            <ButtonBox
              image={require('../../assets/map.png')}
              name="Map"
              navigation={() => {
                navigation.push('PartnerMap');
              }}
            />
          </View>
        </View>
        {/* Navigation */}
        <PartnerNavigation navigation={navigation} />
      </View>
    </View>
  );
}
