/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Divider, Text} from 'react-native-paper';
import {UserNavigation} from '../NavigationBar';
import {UserHeader} from '../PageHeader';
//firebase
import firestore from '@react-native-firebase/firestore';
import {StackActions} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/auth';
const curUser = firebase.auth().currentUser;

//data structure for food information
interface FoodData {
  key: string;
  restoid: string;
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
  Description: any;
  onButtonPress: any;
}) => {
  const [active, setactive] = useState(false);
  const showModal = () => setactive(true);
  const hideModal = () => setactive(false);

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
        <TouchableOpacity
          onPress={() => {
            setactive(!active);
          }}>
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
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={active}
          onRequestClose={() => {
            console.warn('closed');
          }}>
          <TouchableOpacity onPress={hideModal} style={styles2.container}>
            <View>
              <View style={styles2.View}>
                <Image
                  source={{uri: props.Image}}
                  style={{
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 8,
                    backgroundColor: '#A9FDAC',
                    width: 100,
                    height: 100,
                  }}
                />
                <Text style={styles2.text}>{props.MenuName}</Text>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold'}}>
                    Calorie: {props.CalorieIntake} kcal
                  </Text>
                  <Text style={{marginLeft: 5, fontWeight: 'bold'}}>
                    IDR {props.Price}
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: 'black',
                    borderRadius: 50,
                    backgroundColor: '#A9FDAC',
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
                <View>
                  <Text>Description:</Text>
                </View>
                <Text>{props.Description}</Text>
                {/* <Button onPress={()=>{setactive(!active)}}/> */}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

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
          <TouchableOpacity onPress={props.onButtonPress}>
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
  Rating: number;
  Distance: number;
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
              <Text>{props.Rating}</Text>
            </View>
            <Text>Rating</Text>
          </View>

          <View>
            <Text>{props.Distance} km</Text>
            <Text>Distance</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
//#endregion
const CartBar = (props: {quantity: number; navigation: any}) => {
  return (
    <View>
      <Divider style={{marginVertical: 15}} />
      <View style={styles2.cartContainer}>
        <View>
          <Text style={{fontSize: 15, marginLeft: 30}}> </Text>
        </View>

        <TouchableOpacity onPress={props.navigation}>
          <View style={styles2.cartButton}>
            <Text style={styles2.notif}>{props.quantity}</Text>
            <Text style={{fontWeight: 'bold', padding: 8}}>Check Basket</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

//main
export default function RestaurantPage({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const [item, setItem] = useState<FoodData[]>([]);
  const restoName = JSON.stringify(route.params.restoName).replace(/"/g, '');
  const restoAddress = JSON.stringify(route.params.restoAddress).replace(
    /"/g,
    '',
  );
  const restoCategory = JSON.stringify(route.params.restoCategory).replace(
    /"/g,
    '',
  );
  const restoImage = JSON.stringify(route.params.restoImage).replace(/"/g, '');

  //retrieve restaurant information
  useEffect(() => {
    const fetchFood = async () => {
      const docSnapshot = await firestore()
        .collection('merchant')
        .where('Name', '==', restoName)
        .limit(1)
        .get();
      const docSubcollection = docSnapshot.docs[0].ref
        .collection('fooditems')
        .get();
      const fetchedItems = (await docSubcollection).docs.map(
        doc => doc.data() as FoodData,
      );
      setItem(fetchedItems);
    };
    fetchFood();
  }, [restoName]);

  //group into categories
  const groupedData = item.reduce(
    (result, element) => ({
      ...result,
      [element.category]: [...(result[element.category] || []), element],
    }),
    {},
  );
  // counter
  const [totalProduct, setTotalProduct] = useState(0);
  //MAIN TO SHOW
  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{justifyContent: 'center'}}>
        <View style={styles.containerUncentered}>
          {/* BANNER */}
          <UserHeader navigation={navigation} />

          {/* RESTO INFORMATION */}
          <RestaurantBlock
            RestaurantName={restoName}
            FoodCategory="Italian, Spaghetti, Pasta"
            Rating={4.5}
            Distance={3.0}
            Image={restoImage}
          />

          <View style={styles.basicContainerResto}>
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
                      Description={element.description}
                      onButtonPress={async () => {
                        //add to cart in firestore
                        //if the food is already in the cart, add 1 to quantity, otherwise create new entry
                        const docSnapshot = await firestore()
                          .collection('user')
                          .doc(curUser?.uid)
                          .collection('cart')
                          .doc(element.name + element.restoid)
                          .get();

                        if ((await docSnapshot.exists) === false) {
                          await firestore()
                            .collection('user')
                            .doc(curUser?.uid)
                            .collection('cart')
                            .doc(element.name + element.restoid)
                            .set({
                              foodid: element.name + element.description,
                              quantity: firestore.FieldValue.increment(1),
                              restoid: element.restoid,
                            })
                            .then(() => {
                              console.log('Added ' + element.name + ' to cart');
                              //print if added
                              setTotalProduct(totalProduct + 1);
                            })
                            .catch(error => {
                              console.log(
                                'Something went wrong with added ' +
                                  element.name +
                                  ' to cart: ' +
                                  error,
                              );
                            });
                        } else {
                          firestore()
                            .collection('user')
                            .doc(curUser?.uid)
                            .collection('cart')
                            .doc(element.name + element.restoid)
                            .update({
                              quantity: firestore.FieldValue.increment(1),
                            })
                            .then(() => {
                              console.log(
                                'Added 1 ' + element.name + ' to cart',
                              );
                              //print if added
                              setTotalProduct(totalProduct + 1);
                            });
                          console.log(
                            'Something went wrong with increasing ' +
                              element.name +
                              ' to cart: ',
                          );
                        }
                      }}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
          <CartBar
            quantity={totalProduct}
            navigation={() => {
              navigation.dispatch(StackActions.replace('Cart'));
            }}
          />
          {/* NAVIGATION BAR */}
          <UserNavigation navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
}
const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  View: {
    backgroundColor: 'white',
    height: 300,
    width: 250,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
  },
  text: {
    fontSize: 20,
    color: 'green',
    marginBottom: 5,
    marginTop: 10,
  },
  button: {
    margin: 20,
    width: 200,
  },
  notif: {
    fontSize: 12,
    color: 'white',
    backgroundColor: 'red',
    paddingLeft: 9,
    paddingTop: 4,
    borderRadius: 25,
    width: 24,
    height: 24,
    position: 'absolute',
    top: -13,
    right: -5,
  },
  cartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cartButton: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'black',
    backgroundColor: '#A9FDAC',
    width: 112,
    height: 40,
    marginRight: 30,
  },
});
