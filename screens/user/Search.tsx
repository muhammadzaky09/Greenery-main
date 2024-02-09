/* eslint-disable react-native/no-inline-styles */
import React, {Component, useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {View, Image, TouchableOpacity, ScrollView, Modal} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Divider, Text} from 'react-native-paper';
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
}
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
//Menu Item cards
const Menu = (props: {
  navigation: any;
  MenuName: string;
  description: string;
  Price: number;
  Image: string;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        const fetchParent = async () => {
          //get all merchants
          const docSubcollection = await firestore()
            .collectionGroup('fooditems')
            .where('name', '==', props.MenuName)
            .get();
           props.navigation.push('RestaurantPage', {
             restoName: docSubcollection.docs[0].data().Name,
             restoAddress: docSubcollection.docs[0].data().Address,
             restoCategory: docSubcollection.docs[0].data().Category,
             restoImage: docSubcollection.docs[0].data().image,
           });
        };
        fetchParent();
      }}>
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 15,
          justifyContent: 'space-around',
          marginTop: 10,
        }}>
        <View>
          <Text>{props.MenuName}</Text>
          <Text>{props.description}</Text>
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
        </View>
      </View>
    </TouchableOpacity>
  );
};

//main
export default function Search({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const [resto, setResto] = useState<RestoData[]>([]);
  const [foods, setFoods] = useState<FoodData[]>([]);

  const query = JSON.stringify(route.params.query).replace(/"/g, '');

  //retrieve restaurant and food information
  useEffect(() => {
    //GET RESTO INFORMATION
    const fetchRestaurants = async () => {
      const querySnapshot = await firestore()
        .collection('merchant')
        .where('Name', '==', query)
        .limit(20)
        .get();
      const fetchedRestaurants = querySnapshot.docs.map((doc, index) => ({
        ...(doc.data() as RestoData),
        key: index,
      }));
      setResto(fetchedRestaurants);
    };

    //GET FOOD INFORMATION
    const fetchFood = async () => {
      //get all merchants
      const docSubcollection = await firestore()
        .collectionGroup('fooditems')
        .where('name', '==', query)
        .get();

      //map the food into array
      const fetchedItems = (await docSubcollection).docs.map(
        doc => doc.data() as FoodData,
      );
      setFoods(fetchedItems);
    };

    fetchFood();
    fetchRestaurants();
  }, [query]);

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
  // Map food array into the components
  const FoodList = () => {
    return foods.map(element => {
      return (
        <View key={element.key}>
          <Menu
            navigation={navigation}
            MenuName={element.name}
            description={element.description}
            Price={element.price}
            Image={element.image}
          />
        </View>
      );
    });
  };

  //Main Function
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={styles.containerUncentered}>
          {/* Banner */}
          <UserHeader navigation={navigation} />
          {/* Content */}
          <View style={styles.basicContainer}>
            <View>
              <Text style={styles.homepagetext}>Search</Text>
              <Text style={{marginLeft: 30}}>Searching for: {query}</Text>
            </View>
            <Divider style={{marginTop: 15}} />
            {/* FOOD LIST */}
            <Text style={styles.homepagetext}>Items Found</Text>
            <View>{FoodList()}</View>

            <Divider style={{marginTop: 15}} />
            {/* RESTO LIST */}
            <Text style={styles.homepagetext}>Restos Found</Text>
            <View>{RestoList()}</View>

            <Divider style={{marginTop: 15}} />
          </View>
          {/* Navigation */}
          <UserNavigation navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
}
