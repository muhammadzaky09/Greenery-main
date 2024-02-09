/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Button} from 'react-native-paper';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {ScrollView} from 'react-native';

import React, {useEffect, useState, Component} from 'react';
import {StackActions} from '@react-navigation/native';
//user session security
import * as Keychain from 'react-native-keychain';
import {ImageBackground} from 'react-native';

export default function MerchantTodayPromo({navigation}: {navigation: any}) {
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={{flexDirection: 'row'}}>
          <ImageBackground
            source={require('../../assets/banner.png')}
            style={{height: 119, width: 420}}
            resizeMode="cover">
            <TextInput style={styles.input} placeholder="Today's agenda..." />
          </ImageBackground>
        </View>
        <Text
          style={{
            fontSize: 28,
            marginTop: 15,
            marginLeft: 15,
            color: 'black',
            fontWeight: 'bold',
          }}
        />
        Today's Promo:
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 40,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 45,
    marginTop: 20,
  },
});
