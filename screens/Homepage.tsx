import React from 'react';
import 'react-native-gesture-handler';
import {StyleSheet, View, Image} from 'react-native';
import {StackActions} from '@react-navigation/native';
//material ui + form

//kijujuj
import {Button} from 'react-native-paper';
//user session security

export default function Homepage({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <View style={styles.banner} />
      <Image style={styles.Image} source={require('../assets/logo.png')} />

      <View>
        <Button
          onPress={() => {
            navigation.dispatch(StackActions.replace('MerchantSignin'));
          }}
          style={styles.buttonDefault}
          textColor="black"
          mode="contained">
          Merchant Log In
        </Button>

        <Button
          onPress={() => {
            navigation.dispatch(StackActions.replace('PartnerSignin'));
          }}
          style={styles.buttonDefault}
          textColor="black"
          mode="contained">
          Partner Log In
        </Button>

        <Button
          onPress={() => {
            navigation.dispatch(StackActions.replace('UserSignin'));
          }}
          style={styles.buttonDefault}
          textColor="black"
          mode="contained">
          User Log In
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#00BF63',
    height: 78,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  Image: {
    width: 200,
    height: 200,
  },

  buttonDefault: {
    margin: 10,
  },
});
