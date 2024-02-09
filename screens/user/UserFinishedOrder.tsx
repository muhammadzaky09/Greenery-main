/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {View, Image, ImageSourcePropType} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Divider, Text} from 'react-native-paper';
import {UserNavigation} from '../NavigationBar';
import {UserHeader} from '../PageHeader';
import {AirbnbRating} from 'react-native-ratings';
import {ScrollView} from 'react-native-gesture-handler';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface OrderData {
  orderDeliveryFee: number;
  orderTotalFee: number;
  orderStatus: string;
  restoid: string;
  timestamp: any;
  transactionid: string;
  userid: string;
  orderItems: OrderItemData[];
  driverid: string;
  latitude: number;
  longitude: number;
  paymentMethod: string;
}
interface OrderItemData {
  foodName: string;
  foodPrice: number;
  foodQuantity: number;
  foodid: string;
  restoid: string;
}

const OrderSummary = (props: {
  qty: number;
  image: ImageSourcePropType;
  name: string;
  price: number;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 50,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'black',
            marginLeft: 30,
          }}>
          <Image
            source={props.image}
            style={{width: 45, height: 45}}
            resizeMode="contain"
          />
        </View>

        <Text style={{fontWeight: 'bold', marginHorizontal: 10}}>
          {props.name}
        </Text>
        <Text>x{props.qty}</Text>
      </View>

      <Text>Rp {props.price * props.qty}</Text>
    </View>
  );
};
const DriverRating = (props: {
  driverName: string;
  driverImage: ImageSourcePropType;
  driverPlateNumber: string;
}) => {
  return (
    <View>
      <Divider style={{marginHorizontal: 33}} />

      <View style={{marginTop: 15, marginLeft: 30, flexDirection: 'row'}}>
        <Image source={props.driverImage} style={{width: 50, height: 50}} />

        <View style={{marginLeft: 20}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            {props.driverName}
          </Text>
          <Text>{props.driverPlateNumber}</Text>
        </View>
      </View>

      <View>
        <Divider style={{marginHorizontal: 33, marginTop: 15}} />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 30,
            marginTop: 15,
          }}>
          Give rating to the driver!
        </Text>

        <AirbnbRating count={5} defaultRating={5} size={30} />
      </View>
    </View>
  );
};
//main
export default function UserHomepage({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;

  //get most recent finished order
  const [orders, setOrders] = useState<OrderData>();

  const fetchOrders = async () => {
    if (curUser?.uid !== undefined) {
      await firestore()
        .collection('orders')
        .where('orderData.userid', '==', curUser?.uid)
        .where('orderData.orderStatus', '==', 'finished')
        .orderBy('orderData.timestamp', 'desc')
        .limit(1)
        .get()
        .then(querySnapshot => {
          const _orders: any = [];
          querySnapshot.forEach(documentSnapshot => {
            _orders.push({
              ...documentSnapshot.data().orderData,
              key: documentSnapshot.id,
            });
          });
          setOrders(_orders[0]);
        });
    }
  };
  //Fetch driver information
  const [driver, setDriver] = useState<any>();
  const fetchDriver = async () => {
    if (orders?.driverid === undefined) {
      return;
    }
    await firestore()
      .collection('driver')
      .doc(orders?.driverid)
      .get()
      .then(documentSnapshot => {
        const _driver: any = [];
        _driver.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
        setDriver(_driver[0]);
      });
  };
  useEffect(() => {
    fetchOrders();
  }, [curUser?.uid]);

  useEffect(() => {
    if (orders?.restoid === undefined) {
      return;
    }
    fetchDriver();
  }, [orders]);

  return (
    <ScrollView>
      <View style={{minHeight: '100%'}}>
        <View style={styles.containerUncentered}>
          {/* Banner */}
          <UserHeader navigation={navigation} />
          {/* Content */}
          <View style={{minHeight: 700}}>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  marginLeft: 32,
                  marginTop: 20,
                  marginRight: 40,
                  fontWeight: 'bold',
                  fontSize: 26,
                }}>
                Order Finished !
              </Text>
              <Image
                source={require('../../assets/check.png')}
                style={{width: 100, height: 100, marginVertical: 15}}
              />
            </View>
            {/* check if driver is not undefined */}
            <DriverRating
              driverImage={require('../../assets/person.png')}
              //set driver name to 'Driver' if driver is undefined
              driverName={driver?.Name || 'Driver'}
              driverPlateNumber={driver?.VehiclePlate || 'B 1234 ABC'}
            />
            {/* Order Summary */}
            <Divider style={{marginHorizontal: 33, marginTop: 15}} />
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                marginLeft: 30,
                marginTop: 15,
              }}>
              Order Summary
            </Text>
            {/* if orders is not undefined, get the order items array and map it */}
            {orders?.orderItems.map((item, index) => {
              return (
                <View key={index}>
                  <OrderSummary
                    image={require('../../assets/Dessert.png')}
                    name={item.foodName}
                    qty={item.foodQuantity}
                    price={item.foodPrice}
                  />
                </View>
              );
            })}
          </View>
          {/* Navigation */}
          <UserNavigation navigation={navigation} />
        </View>
      </View>
    </ScrollView>
  );
}
