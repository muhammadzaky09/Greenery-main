/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {View, TouchableOpacity} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Divider, Text} from 'react-native-paper';

//import other pages
import MerchantHeader from '../PageHeader';
import MerchantNavigation from '../NavigationBar';
import OrderBar from '../OrderBar';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function MerchantOrdersProcessing({
  navigation,
}: {
  navigation: any;
}) {
  // eslint-disable-next-line react/no-unstable-nested-components
  const OrderInformation = (props: {
    userid: string;
    totalFee: number;
    orderID: string;
    orderedMenu: OrderItemData[];
  }) => {
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{marginTop: 5}} key={props.orderID}>
            <Text style={{fontWeight: 'bold'}}>Order {props.orderID}</Text>
            {props.orderedMenu !== undefined ? (
              props.orderedMenu.map(orderItem => {
                return (
                  <Text key={orderItem.foodName}>
                    {orderItem.foodName} x {orderItem.foodQuantity}
                  </Text>
                );
              })
            ) : (
              <Text>no orders</Text>
            )}
          </View>

          <View style={{marginRight: 40, justifyContent: 'space-around'}}>
          <TouchableOpacity
              onPress={() => {
                navigation.push('MerchantOrderDetailsFinished', {
                  orderid: props.orderID,
                  customerid: props.userid,
                  totalFee: props.totalFee,
                  orderItems: props.orderedMenu,
                });
              }}>
              <View
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  backgroundColor: '#A9FDAC',
                  padding: 8,
                  borderRadius: 8,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Detail</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Divider style={{width: '90%', marginTop: 5}} />
      </View>
    );
  };

  const [restoid, setRestoid] = useState('');
  //get merchant document from merchant colelction in firstore
  useEffect(() => {
    const curUser = firebase.auth().currentUser;
    const fetchRestaurants = async () => {
      const id = await firestore()
        .collection('merchant')
        .doc(curUser?.uid)
        .get();
      setRestoid(id.data()?.Name + id.data()?.Address);
    };
    fetchRestaurants();
  }, []);
  interface OrderData {
    orderDeliveryFee: number;
    orderTotalFee: number;
    orderStatus: string;
    restoid: string;
    timestamp: any;
    transactionid: string;
    userid: string;
    orderItems: OrderItemData[];
  }
  interface OrderItemData {
    foodName: string;
    foodPrice: number;
    foodQuantity: number;
    foodid: string;
    restoid: string;
  }
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const orderType = 'processing';
  useEffect(() => {
    //get documents from orders collection where the restoid = restoid. restoid is located in a map called orderData
    const fetchOrders = async () => {
      const orders = await firestore()
        .collection('orders')
        .where('orderData.restoid', '==', restoid)
        .where('orderData.orderStatus', '==', orderType)
        .get();
      //map the documents to an array of orderData, where orderData is an array of orderData maps
      const _orderData = orders.docs.map(doc => doc.data().orderData);
      setOrderData(_orderData);
    };
    fetchOrders();
  }, [restoid]);
  return (
    <View style={styles.containerUncentered}>
      {/* Banner */}
      <MerchantHeader navigation={navigation} />

      {/* Orders Header  */}
      <OrderBar navigation={navigation} status={2} />

      {/* Content */}

      <View style={styles.contentBox}>
        <Text style={styles.homepagetext}>Orders:</Text>

        <View style={{alignItems: 'center'}}>
          <Divider style={{width: '85%'}} />
        </View>

        <View style={{marginLeft: 30}}>
          {orderData.map(order => {
            return (
              <View key={order.transactionid}>
                <OrderInformation
                  userid={order.userid}
                  totalFee={order.orderTotalFee}
                  orderID={order.transactionid}
                  orderedMenu={order.orderItems as OrderItemData[]}
                />
              </View>
            );
          })}
        </View>
      </View>
      {/* Navigation */}
      <MerchantNavigation navigation={navigation} />
    </View>
  );
}
