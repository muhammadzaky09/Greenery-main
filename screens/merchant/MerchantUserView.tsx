/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {View, Image, TouchableOpacity, ScrollView} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Divider, Text} from 'react-native-paper';
import MerchantNavigation from '../NavigationBar';
import MerchantHeader from '../PageHeader';
//firebase
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';

//data structure for food information
interface FoodData {
  key: string;
  restoID: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
  calorie: number;
}
//#region COMPONENTS
//Menu Item Component
const Menu = (props: {
  MenuName: string;
  CalorieIntake: number;
  Price: number;
  Image: string;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginLeft: 15,
        justifyContent: 'space-around',
        marginTop: 10,
      }}>
      <View>
        <Text>{props.MenuName}</Text>
        <Text>Nutritional details:</Text>
        <Text>{props.CalorieIntake} kcal</Text>
      </View>

      <View>
        <Text>IDR {props.Price}</Text>
      </View>

      <View>
        <Image
          style={{
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 8,
            backgroundColor: '#A9FDAC',
            width: 60,
            height: 60,
          }}
          source={{uri: props.Image}}
        />
        <View
          style={{
            borderWidth: 0.5,
            borderColor: 'black',
            borderRadius: 50,
            backgroundColor: 'white',
            width: 65,
            height: 18,
            alignItems: 'center',
            marginTop: 5,
          }}>
          <TouchableOpacity>
            {/* add button */}
            <Text>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
//Restaurant Block component
const RestaurantBlock = (props: {
  RestaurantName: string;
  FoodCategory: string;
  Image: string;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginLeft: 25,
        marginBottom: 15,
        marginTop: 25,
      }}>
      {props.Image !== null ? (
        <Image
          source={{uri: props.Image}}
          style={{
            borderWidth: 2,
            borderRadius: 8,
            borderColor: 'black',
            backgroundColor: '#A9FDAC',
            width: 112,
            height: 90,
          }}
        />
      ) : (
        <View
          style={{
            borderWidth: 2,
            borderRadius: 8,
            borderColor: 'black',
            backgroundColor: '#A9FDAC',
            width: 112,
            height: 90,
          }}
        />
      )}

      <View style={{marginLeft: 10}}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>
          {props.RestaurantName}
        </Text>
        <Text>{props.FoodCategory}</Text>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FFF5F5',
            borderWidth: 1,
            borderColor: 'black',
            flex: 1,
            justifyContent: 'space-around',
          }}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Image source={require('../../assets/Star.png')} />
              <Text>5</Text>
            </View>
            <Text>Rating</Text>
          </View>
          <View>
            <Text>0 km</Text>
            <Text>Distance</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
//#endregion

//main
export default function MerchantUserView({navigation}) {
  const [item, setItem] = useState<FoodData[]>([]);

  const [name, setname] = useState('');
  const [address, setaddress] = useState('');
  const [image, setimage] = useState(
    'https://cdn.britannica.com/36/123536-050-95CB0C6E/Variety-fruits-vegetables.jpg',
  );
  var restoID = name + address;

  const curUser = firebase.auth().currentUser;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          setimage(userDetails?.image);
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

  //retrieve restaurant information
  useEffect(() => {
    const fetchRestaurants = async () => {
      const querySnapshot = await firestore()
        .collection('merchant')
        .doc(curUser?.uid)
        .collection('fooditems')
        .get();
      const fetchedRestaurants = querySnapshot.docs.map(
        doc => doc.data() as FoodData,
      );
      console.log(fetchedRestaurants);
      setItem(fetchedRestaurants);
    };
    fetchRestaurants();
  }, [restoID]);
  console.log(item);
  //group into categories
  const groupedData = item.reduce(
    (result, element) => ({
      ...result,
      [element.category]: [...(result[element.category] || []), element],
    }),
    {},
  );

  //MAIN TO SHOW
  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{justifyContent: 'center'}}>
        <View style={styles.containerUncentered}>
          {/* BANNER */}
          <MerchantHeader navigation={navigation} />

          {/* RESTO INFORMATION */}
          <RestaurantBlock
            RestaurantName={name}
            FoodCategory="Italian, Spaghetti, Pasta"
            Image={image}
          />

          <View style={{flex: 1, minHeight: 370}}>
            {/* FOOD INFORMATION */}
            {Object.entries(groupedData).map(([category, elements]) => (
              <View key={category}>
                {/* category title */}
                <View>
                  <Text style={{fontSize: 30, marginLeft: 40}}>{category}</Text>
                  <Divider style={{width: '80%', marginTop: 10}} />
                </View>
                {elements.map(element => (
                  <View key={element.name}>
                    <Menu
                      MenuName={element.name}
                      CalorieIntake={element.calorie}
                      Price={element.price}
                      Image={element.image}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* NAVIGATION BAR */}
          <MerchantNavigation navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
}
