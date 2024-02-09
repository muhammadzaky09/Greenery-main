/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import 'react-native-gesture-handler';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  GestureResponderEvent,
  ImageSourcePropType,
} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Text} from 'react-native-paper';
import {UserNavigation} from '../NavigationBar';
import {UserHeader} from '../PageHeader';
import {StackActions} from '@react-navigation/native';

//main
export default function UserHomepage({navigation}: {navigation: any}) {
  // eslint-disable-next-line react/no-unstable-nested-components
  const ButtonBox = (props: {
    navigation: ((event: GestureResponderEvent) => void) | undefined;
    image: ImageSourcePropType;
    name: string;
  }) => {
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
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <View style={styles.containerUncentered}>
          {/* Banner */}
          <UserHeader navigation={navigation} />
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
                image={require('../../assets/BestSeller.png')}
                name="Bestsellers"
                navigation={() => {
                  navigation.push('BestSeller');
                }}
              />

              <ButtonBox
                image={require('../../assets/Map2.png')}
                name="Finished Orders"
                navigation={() => {
                  navigation.push('UserFinishedOrder');
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
                image={require('../../assets/TodayPromo.png')}
                name="Promo"
              />
              <ButtonBox
                image={require('../../assets/map.png')}
                name="Track Order"
                navigation={() => {
                  navigation.push('UserMap');
                }}
              />
            </View>
          </View>
          {/* Navigation */}
          <UserNavigation navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
}
