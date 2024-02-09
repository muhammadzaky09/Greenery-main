/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UserHeader} from '../PageHeader';
import {styles} from '../Style';
import {UserNavigation} from '../NavigationBar';
import MapView, {Marker} from 'react-native-maps';
import {ActivityIndicator, Button, Card, List, Text} from 'react-native-paper';
import MapViewDirections from 'react-native-maps-directions';
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

export default function UserMap({navigation}: {navigation: any}) {
  const [state, setState] = useState<string>('');
  // Coordinates
  const [driverPos, setDriverPos] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [merchantPos, setMerchantPos] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [userPos, setUserPos] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [description, setDescription] = useState<string>(
    'Driver Name Plate Number',
  );

  // Google API Key
  const GOOGLE_MAPS_APIKEY = 'AIzaSyDt3gq9B06vP0LuF24Zb2GmsARP3stipaw';
  const curUser = firebase.auth().currentUser;

  const randomTime = Math.floor(Math.random() * 25) + 5;

  //Fetching order from the database
  //obtain orders assigned to the driver from firebase
  const [orders, setOrders] = useState<OrderData>();

  const fetchOrders = async () => {
    if (curUser?.uid !== undefined) {
      await firestore()
        .collection('orders')
        .where('orderData.userid', '==', curUser?.uid)
        .where('orderData.orderStatus', '!=', 'finished')
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
          setState(_orders[0].orderStatus);
        });
    }
  };
  //Fetch driver information
  const [driver, setDriver] = useState<any>();
  const fetchDriver = async () => {
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
        setDescription(
          _driver[0].Name +
            ' ' +
            _driver[0].VehiclePlate +
            '\n' +
            randomTime +
            ' minutes away',
        );
      });
  };
  //make a function to get the mwechant information from firebase
  const [merchant, setMerchant] = useState<any>();
  const fetchMerchant = async () => {
    await firestore()
      .collection('merchant')
      .where('restoid', '==', orders?.restoid)
      .limit(1)
      .get()
      .then(querySnapshot => {
        setMerchant(querySnapshot.docs[0].data());
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [curUser?.uid]);

  useEffect(() => {
    if (orders?.restoid === undefined) {
      return;
    }
    fetchMerchant();
    fetchDriver();
  }, [orders]);

  // console.log(merchant, driver);

  //OBTAINING LOCATIONS
  useEffect(() => {
    if (orders?.latitude !== undefined) {
      //this is user location
      if (userPos.latitude !== 0) {
        return;
      }
      setUserPos({
        latitude: orders.latitude,
        longitude: orders.longitude,
      });
      console.log('user location updated: ', userPos);
    }
  }, [orders?.latitude]);
  useEffect(() => {
    if (merchant?.latitude !== undefined) {
      if (merchantPos.latitude !== 0) {
        return;
      }
      setMerchantPos({
        latitude: merchant.latitude,
        longitude: merchant.longitude,
      });
      console.log('merchant location updated: ', merchantPos);
    }
  }, [merchant?.latitude]);
  useEffect(() => {
    if (driver?.latitude !== undefined) {
      if (driverPos.latitude !== 0) {
        return;
      }
      setDriverPos({
        latitude: driver.latitude,
        longitude: driver.longitude,
      });
      console.log('driver location updated: ', driverPos);
    }
  }, [driver?.latitude]);

  return (
    <SafeAreaView style={styles.containerUncentered}>
      {/* Banner */}
      <UserHeader navigation={navigation} />
      {/* Content */}
      {orders !== undefined &&
      userPos.latitude !== 0 &&
      driverPos.latitude !== 0 &&
      merchantPos.latitude !== 0 ? (
        <View style={styles.contentBox}>
          {/* Map */}
          <MapView
            style={MapStyles.flex}
            initialRegion={{
              latitude: userPos.latitude,
              longitude: userPos.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.05,
            }}>
            <Marker description="Driver Location" coordinate={driverPos}>
              <Image
                source={require('../../assets/driverMarker.png')}
                style={MapStyles.driverMarker}
              />
            </Marker>

            <Marker description="User Location" coordinate={userPos}>
              <Image
                source={require('../../assets/destination.png')}
                style={MapStyles.pinPoint}
              />
            </Marker>

            <Marker description="Merchant Location" coordinate={merchantPos}>
              <Image
                source={require('../../assets/restaurant.png')}
                style={MapStyles.pinPoint}
              />
            </Marker>
            {/* DRIVER GOING TO RESTAURANT STATE */}
            {state === 'picking' ? (
              <>
                {/* Directions */}
                <MapViewDirections
                  origin={driverPos}
                  destination={merchantPos}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={5}
                  strokeColor="#00BF63"
                />
              </>
            ) : null}

            {/* DRIVER GOING TO USER HOME STATE */}
            {state === 'delivering' ? (
              <>
                <MapViewDirections
                  origin={merchantPos}
                  destination={userPos}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={5}
                  strokeColor="#00BF63"
                />
              </>
            ) : null}
          </MapView>
          {/* DRIVER GO TO RESTAURANT State */}
          {state === 'picking' ? (
            <>
              <Card mode="elevated" style={{marginBottom: 20}}>
                <Card.Content>
                  <List.Item
                    title="Driver is on the way to the restaurant"
                    description={description}
                    descriptionNumberOfLines={3}
                    titleNumberOfLines={3}
                    left={() => (
                      <Image
                        source={require('../../assets/person.png')}
                        style={{width: 50, height: 50, marginTop: 3}}
                      />
                    )}
                    right={() => (
                      <View>
                        <Button>Cancel</Button>
                        <TouchableOpacity>
                          <Button mode="contained" style={MapStyles.button}>
                            Message
                          </Button>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </Card.Content>
              </Card>
            </>
          ) : null}

          {/* DRIVER WAITING AT RESTAURANT STATE */}
          {state === 'waiting' ? (
            <>
              <Card mode="elevated" style={{marginBottom: 20}}>
                <Card.Content>
                  <List.Item
                    title="Driver has arrived at the restaurant"
                    description={description}
                    descriptionNumberOfLines={4}
                    titleNumberOfLines={3}
                    left={() => (
                      <Image
                        source={require('../../assets/person.png')}
                        style={{width: 50, height: 50, marginTop: 3}}
                      />
                    )}
                    right={() => (
                      <View>
                        <TouchableOpacity>
                          <Button mode="contained" style={MapStyles.button}>
                            Message
                          </Button>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </Card.Content>
              </Card>
            </>
          ) : null}

          {/* DRIVER GOING TO USER HOME */}
          {state === 'delivering' ? (
            <>
              <Card mode="elevated" style={{marginBottom: 20}}>
                <Card.Content>
                  <List.Item
                    title="Driver is on the way to your home"
                    description={description}
                    titleNumberOfLines={3}
                    left={() => (
                      <Image
                        source={require('../../assets/person.png')}
                        style={{width: 50, height: 50, marginTop: 3}}
                      />
                    )}
                    right={() => (
                      <View style={{justifyContent: 'space-evenly'}}>
                        <TouchableOpacity>
                          <Button mode="contained" style={MapStyles.button}>
                            Message
                          </Button>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </Card.Content>
              </Card>
            </>
          ) : null}
          {/* DELIVERING ORDER STATE */}
        </View>
      ) : (
        <View style={styles.contentBox}>
          <ActivityIndicator size="large" color="#00BF63" />
          <Text style={{textAlign: 'center'}}>Waiting for orders...</Text>
        </View>
      )}

      {/* Navigation */}
      <UserNavigation navigation={navigation} />
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
