import {StackActions} from '@react-navigation/native';
import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Avatar, Divider} from 'react-native-paper';

export default function MerchantNavigation({navigation}: {navigation: any}) {
  return (
    <View style={styles.navContainer}>
      <Divider />
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            navigation.push('MerchantHomepage');
          }}>
          <Avatar.Icon size={40} icon="home" theme={navTheme} color="black" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            console.log('To News');
          }}>
          <Avatar.Icon
            size={40}
            icon="newspaper-variant"
            theme={navTheme}
            color="black"
          />
          <Text style={styles.navLabel}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            navigation.push('MerchantProfile');
          }}>
          <Avatar.Icon
            size={40}
            icon="account"
            theme={navTheme}
            color="black"
          />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            console.log('To Settings');
          }}>
          <Avatar.Icon size={40} icon="cog" theme={navTheme} color="black" />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
    //2 rows, 5 columns
  );
}

export function PartnerNavigation({navigation}: {navigation: any}) {
  return (
    <View style={styles.navContainer}>
      <Divider />
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            navigation.dispatch(StackActions.replace('PartnerHomepage'));
          }}>
          <Avatar.Icon size={40} icon="home" theme={navTheme} color="black" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            console.log('To News');
          }}>
          <Avatar.Icon size={40} icon="wallet" theme={navTheme} color="black" />
          <Text style={styles.navLabel}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            navigation.dispatch(StackActions.replace('PartnerProfile'));
          }}>
          <Avatar.Icon
            size={40}
            icon="account"
            theme={navTheme}
            color="black"
          />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            console.log('To Settings');
          }}>
          <Avatar.Icon size={40} icon="cog" theme={navTheme} color="black" />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
    //2 rows, 5 columns
  );
}

export function UserNavigation({navigation}: {navigation: any}) {
  return (
    <View style={styles.navContainer}>
      <Divider />
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            navigation.push('UserHomepage');
          }}>
          <Avatar.Icon size={40} icon="home" theme={navTheme} color="black" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            navigation.push('Cart');
          }}>
          <Avatar.Icon size={40} icon="cart" theme={navTheme} color="black" />
          <Text style={styles.navLabel}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            navigation.push('UserWallet');
          }}>
          <Avatar.Icon size={40} icon="wallet" theme={navTheme} color="black" />
          <Text style={styles.navLabel}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            navigation.push('UserProfile'); // user profile
          }}>
          <Avatar.Icon
            size={40}
            icon="account"
            theme={navTheme}
            color="black"
          />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.col}
          onPress={() => {
            console.log('To Settings');
          }}>
          <Avatar.Icon size={40} icon="cog" theme={navTheme} color="black" />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const navTheme = {
  colors: {
    primary: '#fff',
    accent: 'black',
  },
};

const styles = StyleSheet.create({
  navLabel: {
    color: 'black',
  },
  navContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    height: 75,
  },
  navigation: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  col: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 0,
    paddingBottom: 5,
    marginTop: 10,
  },
  iconButton: {
    margin: 0,
  },
});
