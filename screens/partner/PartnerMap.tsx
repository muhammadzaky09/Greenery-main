/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PartnerHeader} from '../PageHeader';
import {styles} from '../Style';
import {PartnerNavigation} from '../NavigationBar';
import MapView, {Marker} from 'react-native-maps';
import {Button, Card, IconButton, List, Text} from 'react-native-paper';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';

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

export default function PartnerMap({navigation}: {navigation: any}) {
  const [state, setState] = useState<string>('available');
  const curUser = firebase.auth().currentUser;

  //create a variable that stores latitude and longitude
  const [_latitude, setLatitude] = useState(0);
  const [_longitude, setLongitude] = useState(0);

  const getUserLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if ((await granted) === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            //record current location in firebase
            firestore().collection('driver').doc(curUser?.uid).set(
              {
                latitude: latitude,
                longitude: longitude,
              },
              {merge: true},
            );
            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);
            setLatitude(latitude);
            setLongitude(longitude);
          },
          error => {
            console.log('Error:', error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const fetchStatus = async () => {
    if (curUser?.uid || true) {
      await firestore()
        .collection('driver')
        .doc(curUser?.uid)
        .get()
        .then(documentSnapshot => {
          const userDetails = documentSnapshot.data();
          //check if the user Status exists
          if (userDetails?.Status) {
            //if it does, set the state to the status else create status in firebase
            setState(userDetails?.Status);
            console.log('obtained status from firebase: ', state);
          } else {
            firestore().collection('driver').doc(curUser?.uid).set(
              {
                Status: 'available',
              },
              {merge: true},
            );
          }
        });
      fetchOrders();
    }
  };

  useEffect(() => {
    fetchStatus();
    console.log('state is ', state);
  }, []);

  //obtain orders assigned to the driver from firebase
  const [orders, setOrders] = useState<OrderData>();
  const [lat, setLat] = useState<number>(0);
  const [long, setLong] = useState<number>(0);
  const [orderdocid, setOrderDocId] = useState<string>('');
  const fetchOrders = async () => {
    if (curUser?.uid) {
      await firestore()
        .collection('orders')
        .where('orderData.driverid', '==', curUser?.uid)
        .where('orderData.orderStatus', '!=', 'finished')
        .limit(1)
        .get()
        .then(querySnapshot => {
          const _orders: any = [];
          setOrderDocId(querySnapshot.docs[0].id);
          querySnapshot.forEach(documentSnapshot => {
            _orders.push({
              ...documentSnapshot.data().orderData,
              key: documentSnapshot.id,
            });
          });
          console.log('putting orders');
          setOrders(_orders[0]);
        });
      if (orders?.latitude !== undefined) {
        setLat(orders.latitude);
        setLong(orders.longitude);
      }
    }
  };

  //make a function to get the user information from firebase
  const [customer, setCustomer] = useState<any>();
  const fetchCustomer = async () => {
    if (orders !== undefined) {
      await firestore()
        .collection('user')
        .doc(orders?.userid)
        .get()
        .then(documentSnapshot => {
          const userDetails = documentSnapshot.data();
          setCustomer(userDetails);
        });
    }
  };
  //make a function to get the mwechant information from firebase
  const [merchant, setMerchant] = useState<any>();
  const [mlat, setmLat] = useState<number>(-7.7739);
  const [mlong, setmLong] = useState<number>(110.368);

  const fetchMerchant = async () => {
    if (orders !== undefined) {
      await firestore()
        .collection('merchant')
        .where('restoid', '==', orders?.restoid)
        .limit(1)
        .get()
        .then(querySnapshot => {
          setMerchant(querySnapshot.docs[0].data());
        });
      if (merchant?.latitude !== undefined) {
        setmLat(merchant.latitude);
        setmLong(merchant.longitude);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [curUser?.uid]);

  useEffect(() => {
    fetchCustomer();
    fetchMerchant();
  }, [orders?.userid]);

  console.log(customer);
  console.log(merchant);

  return (
    <SafeAreaView style={styles.containerUncentered}>
      {/* Banner */}
      <PartnerHeader navigation={navigation} />
      {/* Content */}
      {/* check if merchant and users are not undefined else it is null*/}
      {merchant !== undefined && customer !== undefined ? (
        <View style={styles.contentBox}>
          {/* Map */}
          <MapView
            style={MapStyles.flex}
            initialRegion={{
              latitude: mlat,
              longitude: mlong,
              latitudeDelta: 0.04,
              longitudeDelta: 0.05,
            }}>
            {/* WAITING ORDER STATE */}
            {state === 'available' ? (
              <>
                <Marker
                  description="Driver Location"
                  coordinate={{
                    latitude: _latitude,
                    longitude: _longitude,
                  }}>
                  <Image
                    source={require('../../assets/driverMarker.png')}
                    style={MapStyles.driverMarker}
                  />
                </Marker>
              </>
            ) : null}
            {state === 'pending' ||
            state === 'picking' ||
            state === 'delivering' ? (
              <>
                <Marker
                  description="Driver Location"
                  coordinate={{
                    latitude: _latitude,
                    longitude: _longitude,
                  }}>
                  <Image
                    source={require('../../assets/driverMarker.png')}
                    style={MapStyles.driverMarker}
                  />
                </Marker>
                {merchant?.latitude !== undefined ? (
                  <>
                    <Marker
                      description="User Location"
                      coordinate={{
                        latitude: lat,
                        longitude: long,
                      }}>
                      <Image
                        source={require('../../assets/destination.png')}
                        style={MapStyles.pinPoint}
                      />
                    </Marker>
                    <Marker
                      description="Merchant Location"
                      coordinate={{
                        latitude: mlat,
                        longitude: mlong,
                      }}>
                      <Image
                        source={require('../../assets/restaurant.png')}
                        style={MapStyles.pinPoint}
                      />
                    </Marker>
                  </>
                ) : null}
              </>
            ) : null}
          </MapView>

          {state === 'available' ? (
            <>
              <Card mode="elevated" style={{marginBottom: 20}}>
                <Card.Content>
                  <List.Item
                    title="Waiting for order..."
                    description="Tips: You can go offline to stop receiving orders"
                    left={() => <IconButton icon="bike" size={30} />}
                  />
                </Card.Content>
              </Card>
            </>
          ) : null}
          {/* CONFIRMING ORDER STATE */}

          {state === 'pending' ? (
            <>
              <Card mode="elevated" style={{marginBottom: 20}}>
                <Card.Content>
                  <List.Item
                    title="Confirm Delivery Order"
                    description={
                      '800m from you \nPrice: IDR.' +
                      orders?.orderTotalFee +
                      '\n' +
                      orders?.paymentMethod
                    }
                    descriptionNumberOfLines={3}
                    left={() => <IconButton icon="bike" size={30} />}
                    right={() => (
                      <View>
                        <Button>Cancel</Button>
                        <Button
                          mode="contained"
                          style={MapStyles.button}
                          onPress={async () => {
                            //update the driver status in firebase
                            await firestore()
                              .collection('driver')
                              .doc(curUser?.uid)
                              .update({
                                Status: 'picking',
                              });
                            if (orders !== undefined) {
                              orders.orderStatus = 'picking';
                              await firestore()
                                .collection('orders')
                                .doc(orderdocid)
                                .update({
                                  orderData: orders,
                                });
                              setState('picking');
                            }
                          }}>
                          Confirm
                        </Button>
                      </View>
                    )}
                  />
                </Card.Content>
              </Card>
            </>
          ) : null}
          {/* WORKING ON ORDER STATE */}

          {state === 'picking' ? (
            <>
              <Card mode="elevated" style={{marginBottom: 30}}>
                <Card.Content>
                  <List.Item
                    title={merchant?.Name}
                    description={
                      merchant?.Address +
                      '\nPrice: IDR.' +
                      orders?.orderTotalFee +
                      '\n' +
                      orders?.orderItems.map((item: OrderItemData) => {
                        return item.foodName + ' x' + item.foodQuantity + '\n';
                      })
                    }
                    descriptionNumberOfLines={
                      2 + (orders?.orderItems.length || 0)
                    }
                    left={() => (
                      <Image
                        source={require('../../assets/person.png')}
                        style={{width: 50, height: 50, marginTop: 20}}
                      />
                    )}
                    right={() => (
                      <View style={{justifyContent: 'space-evenly'}}>
                        <Button mode="contained" style={MapStyles.button}>
                          Message
                        </Button>
                        <Button
                          mode="contained"
                          style={MapStyles.button}
                          onPress={async () => {
                            //update the driver status in firebase
                            await firestore()
                              .collection('driver')
                              .doc(curUser?.uid)
                              .update({
                                Status: 'delivering',
                              });
                            setState('delivering');
                            if (orders !== undefined) {
                              orders.orderStatus = 'delivering';
                              await firestore()
                                .collection('orders')
                                .doc(orderdocid)
                                .update({
                                  orderData: orders,
                                });
                              setState('delivering');
                            }
                          }}>
                          Finish
                        </Button>
                      </View>
                    )}
                  />
                </Card.Content>
              </Card>
            </>
          ) : null}
          {/* DELIVERING ORDER STATE */}
          {state === 'delivering' ? (
            <>
              <Card mode="elevated" style={{marginBottom: 20}}>
                <Card.Content>
                  <List.Item
                    title={customer?.Name}
                    description={customer?.Address}
                    left={() => (
                      <Image
                        source={require('../../assets/person.png')}
                        style={{width: 50, height: 50, marginTop: 20}}
                      />
                    )}
                    right={() => (
                      <View style={{justifyContent: 'space-evenly'}}>
                        <Button mode="contained" style={MapStyles.button}>
                          Message
                        </Button>
                        <Button
                          mode="contained"
                          style={MapStyles.button}
                          onPress={async () => {
                            //update the driver status in firebase
                            await firestore()
                              .collection('driver')
                              .doc(curUser?.uid)
                              .update({
                                Status: 'available',
                              });
                            if (orders !== undefined) {
                              orders.orderStatus = 'finished';
                              await firestore()
                                .collection('orders')
                                .doc(orderdocid)
                                .update({
                                  orderData: orders,
                                });
                              setState('available');
                            }
                          }}>
                          Finish
                        </Button>
                      </View>
                    )}
                  />
                </Card.Content>
              </Card>
            </>
          ) : null}
        </View>
      ) : (
        <View style={styles.contentBox}>
          <Text style={styles.text}>No Orders Available</Text>
        </View>
      )}
      {/* Navigation */}
      <PartnerNavigation navigation={navigation} />
    </SafeAreaView>
  );
}

const MapStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  driverMarker: {
    width: 60,
    height: 60,
  },
  pinPoint: {
    width: 15,
    height: 15,
  },
  button: {
    backgroundColor: '#00BF63',
    marginBottom: 5,
  },
});
