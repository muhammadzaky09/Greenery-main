import React from 'react';
//import {View, Text} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {Drawer} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {StackActions} from '@react-navigation/native';

export function MerchantSidebar({navigation}: {navigation: any}) {
  const handleLogout = async () => {
    console.log('Sidebar: Logout triggered');
    auth()
      .signOut()
      .then(() => navigation.dispatch(StackActions.replace('MerchantSignin')));
    //just in case
    navigation.reset({
      index: 0,
      routes: [{name: 'MerchantSignin'}],
    });
  };
  return (
    <View style={styles.container}>
      <View>
        <Drawer.CollapsedItem
          focusedIcon="account"
          unfocusedIcon="account-outline"
          label="Profile"
        />
        <Drawer.CollapsedItem
          focusedIcon="bell"
          unfocusedIcon="bell-outline"
          label="Notif"
        />
      </View>
      <Drawer.CollapsedItem
        focusedIcon="logout"
        unfocusedIcon="logout"
        label="Logout"
        onPress={handleLogout}
      />
    </View>
  );
}

export function UserSidebar({navigation}: {navigation: any}) {
  const handleLogout = async () => {
    console.log('Sidebar: Logout triggered');
    auth()
      .signOut()
      .then(() => navigation.dispatch(StackActions.replace('UserSignin')));
    //just in case
    navigation.reset({
      index: 0,
      routes: [{name: 'UserSignin'}],
    });
  };
  return (
    <View style={styles.container}>
      <View>
        <Drawer.CollapsedItem
          focusedIcon="account"
          unfocusedIcon="account-outline"
          label="Profile"
        />
        <Drawer.CollapsedItem
          focusedIcon="bell"
          unfocusedIcon="bell-outline"
          label="Notif"
        />
      </View>
      <Drawer.CollapsedItem
        focusedIcon="logout"
        unfocusedIcon="logout"
        label="Logout"
        onPress={handleLogout}
      />
    </View>
  );
}

const PartnerSidebar = ({navigation}: {navigation: any}) => {
  const handleLogout = async () => {
    console.log('Sidebar: Logout triggered');
    auth()
      .signOut()
      .then(() => navigation.dispatch(StackActions.replace('PartnerSignin')));
    //just in case
    navigation.reset({
      index: 0,
      routes: [{name: 'PartnerSignin'}],
    });
  };
  return (
    <View style={styles.container}>
      <View>
        <Drawer.CollapsedItem
          focusedIcon="account"
          unfocusedIcon="account-outline"
          label="Profile"
        />
        <Drawer.CollapsedItem
          focusedIcon="bell"
          unfocusedIcon="bell-outline"
          label="Notif"
        />
      </View>
      <Drawer.CollapsedItem
        focusedIcon="logout"
        unfocusedIcon="logout"
        label="Logout"
        onPress={handleLogout}
      />
    </View>
  );
};

export default PartnerSidebar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    position: 'absolute',
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexDirection: 'column',
    paddingTop: 25,
  },
  logout: {
    marginBottom: 0,
  },
});
