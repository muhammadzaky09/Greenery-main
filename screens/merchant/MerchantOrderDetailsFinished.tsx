/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Divider, Text} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

//import other pages
import MerchantHeader from '../PageHeader';
import MerchantNavigation from '../NavigationBar';
interface OrderData {
  orderid: string;
  customerid: string;
  totalFee: number;
  orderItems: OrderItemData[];
}
interface OrderItemData {
  foodName: string;
  foodPrice: number;
  foodQuantity: number;
  foodid: string;
  restoid: string;
}

export default function MerchantOrderDetailsFinished({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  //create a use state for orderid, customerid, totalFee, orderItems
  const orderid = route.params.orderid;
  const customerid = route.params.customerid;
  const totalFee = Number(route.params.totalFee);
  const orderItems = route.params.orderItems;

  const [user, setUser] = useState<any>();
  const [user_name, setUser_name] = useState('Name');
  const [user_address, setUser_address] = useState('Address');
  const fetchCustomer = async () => {
    await firestore()
      .collection('user')
      .doc(customerid)
      .get()
      .then(documentSnapshot => {
        const userDetails = documentSnapshot.data();
        setUser(userDetails);
      });
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  useEffect(() => {
    if (user?.Name !== undefined) {
      setUser_name(user.Name);
      setUser_address(user.Address);
    }
  }, [user]);

  console.log(user);
  console.log(user_name);
  console.log(user_address);

  return (
    <View style={styles.containerUncentered}>
      <ScrollView>
        {/* Banner */}
        <MerchantHeader navigation={navigation} />

        {/* Content */}
        <View style={styles.contentBox}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.push('MerchantOrdersReceived');
              }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: 'black',
                  marginTop: 20,
                  marginLeft: 30,
                }}>
                <Image
                  source={require('../../assets/back.png')}
                  style={styles2.Image}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.homepagetext}>Order Number {orderid}</Text>
          </View>

          {/* Divider */}
          <View style={{alignItems: 'center', marginVertical: 10}}>
            <Divider style={{width: '85%'}} />
          </View>
          {/* Customer */}
          <View style={{marginLeft: 30}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>
              Customer
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles2.Circle}>
                <Image
                  source={require('../../assets/person.png')}
                  style={styles2.Image}
                />
              </View>

              <View
                style={{marginLeft: 10, justifyContent: 'center', width: 185}}>
                <Text style={{fontWeight: 'bold'}}>{user_name}</Text>
                <Text>{user_address}</Text>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginLeft: 15,
                }}>
                <TouchableOpacity>
                  <View style={styles2.SmallCircle}>
                    <Image
                      source={require('../../assets/telephone.png')}
                      style={styles2.Image}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                  <View style={styles2.SmallCircle}>
                    <Image
                      source={require('../../assets/message.png')}
                      style={styles2.Image}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{alignItems: 'center', marginVertical: 10}}>
            <Divider style={{width: '85%'}} />
          </View>

          {/*  Driver */}
          <View style={{marginLeft: 30}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>
              Driver
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles2.Circle}>
                <Image
                  source={require('../../assets/person.png')}
                  style={styles2.Image}
                />
              </View>

              <View style={{marginLeft: 10, justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Name</Text>
                <Text>Address</Text>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginLeft: 150,
                }}>
                <TouchableOpacity>
                  <View style={styles2.SmallCircle}>
                    <Image
                      source={require('../../assets/telephone.png')}
                      style={styles2.Image}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                  <View style={styles2.SmallCircle}>
                    <Image
                      source={require('../../assets/message.png')}
                      style={styles2.Image}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{alignItems: 'center', marginVertical: 10}}>
            <Divider style={{width: '85%'}} />
          </View>

          {/* Order Detail*/}
          <View style={{marginHorizontal: 30}}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>
              Order Details
            </Text>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 'bold'}}>Name</Text>
              <Text style={{fontWeight: 'bold'}}>Quantity</Text>
              <Text style={{fontWeight: 'bold'}}>Price</Text>
            </View>

            {/* //map the items from orderItems array */}
            {orderItems.map(elements => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 5,
                  }}
                  key={elements.foodid}>
                  <Text>{elements.foodName}</Text>
                  <Text>{elements.foodQuantity}</Text>
                  <Text>{elements.foodPrice}</Text>
                </View>
              );
            })}

            <Divider style={{width: '85%'}} />
          </View>
        </View>

        {/* Navigation */}
        <MerchantNavigation navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles2 = StyleSheet.create({
  SmallCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },

  Circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'black',
  },
  Image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});
