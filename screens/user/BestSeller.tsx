/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {View, Image, TouchableOpacity, ScrollView} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Text} from 'react-native-paper';
import {UserNavigation} from '../NavigationBar';
import {UserHeader} from '../PageHeader';
//firebase
import firestore from '@react-native-firebase/firestore';
interface RestoData {
  key: number;
  Name: string;
  Category: string;
  image: string;
  Address: string;
  Opening: any;
  Closing: any;
  Price: string;
}
// Restaurant cards
const Restaurant = (props: {
  navigation: any;
  RestaurantName: string;
  FoodCategory: string;
  eta: number;
  distance: number;
  image: string;
}) => {
  return (
    <View style={{flexDirection: 'row', marginLeft: 15, marginBottom: 25}}>
      <TouchableOpacity style={styles.touchButton} onPress={props.navigation}>
        {props.image !== null ? (
          <View style={styles.RestaurantBoxOutside}>
            <Image
              style={styles.RestaurantBoxInside}
              source={{
                uri: props.image,
              }}
            />
          </View>
        ) : (
          <View style={styles.RestaurantBoxOutside}>
            <View style={styles.RestaurantBoxInside} />
          </View>
        )}
      </TouchableOpacity>
      <View style={{justifyContent: 'center', marginLeft: 15}}>
        <Text style={styles.buttonTitle}>{props.RestaurantName}</Text>
        <Text>{props.FoodCategory}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text>{props.eta} mins - </Text>
          <Text>{props.distance} km </Text>
        </View>
      </View>
    </View>
  );
};

//main
export default function BestSeller({navigation}: {navigation: any}) {
  const [resto, setResto] = useState<RestoData[]>([]);

  //retrieve restaurant information
  useEffect(() => {
    const fetchRestaurants = async () => {
      const querySnapshot = await firestore()
        .collection('merchant')
        .limit(10)
        .get();
      const fetchedRestaurants = querySnapshot.docs.map((doc, index) => ({
        ...(doc.data() as RestoData),
        key: index,
      }));
      console.log('restos found: ', querySnapshot.docs.length);
      setResto(fetchedRestaurants);
    };
    fetchRestaurants();
  }, []);

  // Map restaurant array into the components
  const RestoList = () => {
    return resto.map(element => {
      return (
        <View key={element.key}>
          <Restaurant
            navigation={() => {
              navigation.dispatch(
                navigation.push('RestaurantPage', {
                  restoName: element.Name,
                  restoAddress: element.Address,
                  restoCategory: element.Category,
                  restoImage: element.image,
                }),
              );
            }}
            RestaurantName={element.Name}
            FoodCategory={element.Category}
            eta={30}
            distance={1.5}
            image={element.image}
          />
        </View>
      );
    });
  };

  //Main Function
  return (
    <View>
      <ScrollView>
        <View style={styles.containerUncentered}>
          {/* Banner */}
          <UserHeader navigation={navigation} />
          {/* Content */}
          <View style={{minHeight: 600}}>
            <View>
              <Text style={styles.homepagetext}>Bestsellers</Text>
              <Text style={{marginLeft: 30}}>
                Try the best we have to offer:
              </Text>
            </View>
            {/* Testing Database */}
            <View style={styles.basicContainer}>{RestoList()}</View>
          </View>

          {/* Navigation */}
          <UserNavigation navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
}
