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

export default function MerchantOrdersReceived({
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
          <View style={{marginTop: 5}}>
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
            <TouchableOpacity onPress={() => handleConfirmOrder(props.orderID)}>
              <View
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  backgroundColor: '#7CFF81',
                  padding: 8,
                  borderRadius: 8,
                }}>
                <Text style={{fontWeight: 'bold'}}>Confirm</Text>
              </View>
            </TouchableOpacity>

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

  async function assignRandomDriver() {
    // Retrieve the list of drivers from the Firestore database
    const driversSnapshot = await firestore()
      .collection('driver')
      .where('Status', '==', 'available')
      .get();

    //map driver documents to an array of driver data and the docid as driverid
    const drivers = driversSnapshot.docs.map(doc => {
      return {
        driverId: doc.id,
        ...doc.data(),
      };
    });

    if (drivers.length === 0) {
      // No drivers available
      throw new Error('No drivers available');
    }

    // Generate a random index to select a driver
    const randomIndex = Math.floor(Math.random() * drivers.length);

    // Return the randomly assigned driver
    return drivers[randomIndex];
  }

  function handleConfirmOrder(orderID) {
    console.log(orderID);
    assignRandomDriver()
      .then(assignedDriver => {
        // Perform other necessary actions like updating the order status and assigning the driver to the order in the database
        firestore()
          .collection('orders')
          .doc(orderID)
          .get()
          .then(doc => {
            if (!doc.exists) {
              console.log('No such document!');
            } else {
              const data = doc.data();
              console.log('Document data:', data);
              data.orderData.orderStatus = 'processing';
              data.orderData.driverid = assignedDriver.driverId;
              console.log('Document data:', data);

              firestore()
                .collection('orders')
                .doc(orderID)
                .update(data)
                .then(() => {
                  // Success message or navigation to the next screen
                  console.log(
                    'Order confirmed. Driver assigned:',
                    assignedDriver.driverId,
                  );
                })
                .catch(error => {
                  // Error handling
                  console.log('Error confirming order:', error);
                });
            }
          });
        //update driver status to pending
        firestore()
          .collection('driver')
          .doc(assignedDriver.driverId)
          .update({Status: 'pending'});
      })
      .catch(error => {
        // Error handling
        console.log('Error assigning random driver:', error);
      });
  }

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
    transactionID: string;
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
  const orderType = 'Received';
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
      <OrderBar navigation={navigation} status={1} />

      {/* Content */}

      <View style={styles.contentBox}>
        <Text style={styles.homepagetext}>Orders:</Text>

        <View style={{alignItems: 'center'}}>
          <Divider style={{width: '85%'}} />
        </View>

        <View style={{marginLeft: 30}}>
          {orderData.map(order => {
            return (
              <View key={order.transactionID}>
                <OrderInformation
                  userid={order.userid}
                  totalFee={order.orderTotalFee}
                  orderID={order.transactionID}
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
