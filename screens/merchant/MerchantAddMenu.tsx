/* eslint-disable react-native/no-inline-styles */
//building the screen
import {Button, SegmentedButtons} from 'react-native-paper';
import {Text, View, TextInput, Image, Platform, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import NumericInput from 'react-native-numeric-input';
import CheckBox from '@react-native-community/checkbox';
import * as ImagePicker from 'react-native-image-picker';
const includeExtra = true;
import {StackActions} from '@react-navigation/native';

//firebase stuff
import {ScrollView} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

//form
import {Formik} from 'formik';

//import other screens
import MerchantHeader from '../PageHeader';
import MerchantNavigation from '../NavigationBar';
import {styles} from '../Style';

//food info
const initialState = {
  Vegan: false,
  Keto: false,
  Mediterranean: false,
  LowSugar: false,
  LowCarb: false,
  LowCal: false,
};
//food data interface
interface FoodData {
  stock: number;
  name: string;
  category: string;
  description: string;
  price: number;
  calorie: number;
  image: string;
}

var _stock = -1;
var _name = '';
var _category = '';
var _description = '';
var _price = -1;

//Main funcion
export default function MerchantAddMenu({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  //get info from route
  const foodID = JSON.stringify(route.params.foodID).replace(/"/g, '');

  //authenticate user
  const curUser = firebase.auth().currentUser;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //checkbox
  const [state, setState] = React.useState(initialState);
  const [imageUrl, setImageUrl] = useState('');

  //fetch food information
  const initialArray: FoodData[] = [
    {
      stock: -1,
      name: 'Food Name',
      category: 'Food Category',
      description: 'Food Description',
      price: -1,
      calorie: -1,
      image:
        'https://cdn.britannica.com/36/123536-050-95CB0C6E/Variety-fruits-vegetables.jpg',
    },
  ];

  const [item, setItem] = useState<FoodData[]>(initialArray);
  useEffect(() => {
    if (foodID !== 'new') {
      const fetchRestaurants = async () => {
        const querySnapshot = await firestore()
          .collection('merchant')
          .doc(curUser?.uid)
          .collection('fooditems')
          .where('key', '==', foodID)
          .get();
        const fetchedFood = querySnapshot.docs.map(
          doc => doc.data() as FoodData,
        );
        console.log('looking for ', foodID);
        console.log('Menu Items Found', fetchedFood);
        setItem(fetchedFood);
      };
      fetchRestaurants();
    }
  }, [curUser?.uid, foodID]);

  //Fetch user data on start
  useEffect(() => {
    if (!isLoggedIn) {
      if (curUser) {
        setIsLoggedIn(true);
      } else {
        console.log('Error in retrieving user data');
      }
    }
  }, [curUser, isLoggedIn]);

  //Used for menu photo
  const [response, setResponse] = React.useState<any>(null);
  const onImageSelect = React.useCallback((type: any, options: any) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);

  //upload to firebase
  const [fooduri, setfooduri] = useState(
    'https://cdn.britannica.com/36/123536-050-95CB0C6E/Variety-fruits-vegetables.jpg',
  );
  const [stock, setstock] = useState(-1);
  return (
    <View>
      <ScrollView>
        {/* Banner */}
        <MerchantHeader navigation={navigation} />

        {/* Main Content */}

        <View style={styles.container}>
          {/* Menu Information */}
          <Text style={styles.Subheading}>Menu Information</Text>

          {/* Details */}
          <Formik
            initialValues={{
              name: '',
              category: '',
              description: '',
              price: -1,
              calorie: -1,
            }}
            onSubmit={values => {
              //check which are edited
              //#region
              if (stock === -1) {
                _stock = item[0].stock;
                console.log(_stock);
              } else {
                _stock = stock;
              }
              if (values.name === '') {
                _name = item[0].name;
                console.log(_name);
              } else {
                _name = values.name;
              }
              if (values.category === '') {
                _category = item[0].category;
                console.log(_category);
              } else {
                _category = values.category;
              }
              if (values.description === '') {
                _description = item[0].description;
                console.log(_description);
              } else {
                _description = values.description;
              }
              if (values.price === -1) {
                _price = item[0].price;
                console.log(_price);
              } else {
                _price = values.price;
              }
              if (imageUrl === '') {
                setImageUrl(item[0].image);
                console.log(imageUrl);
              }
              //#endregion

              //submit values to firestore
              if (firestore().collection('merchant').doc(curUser?.uid)) {
                //edit menu
                firestore()
                  .collection('merchant')
                  .doc(curUser?.uid)
                  .collection('fooditems')
                  .doc(_name)
                  .set({
                    stock: _stock,
                    name: _name,
                    category: _category,
                    price: _price,
                    description: _description,
                    calorie: values.calorie,
                    image: imageUrl,
                    key: _name + _description,
                  })
                  .then(() => {
                    console.log(
                      'Food: ',
                      curUser?.uid + values.name,
                      ' Updated!',
                    );
                    navigation.dispatch(StackActions.pop(1));
                  })
                  .catch(e => {
                    console.log('error writing food data: ', e);
                  });
              }
            }}>
            {({handleChange, handleBlur, handleSubmit, values}) => (
              <>
                <TextInput
                  style={styles.input}
                  placeholder={item[0].name}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                <TextInput
                  style={styles.input}
                  placeholder={item[0].description}
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                />
                <Text style={styles.Subheading}>Details:</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <Text style={{marginRight: 20, fontWeight: 'bold'}}>
                    Stocks
                  </Text>

                  <NumericInput
                    type="up-down"
                    onChange={value => setstock(value)}
                    totalWidth={200}
                    totalHeight={40}
                    iconSize={25}
                    step={1}
                    textColor="black"
                    valueType="integer"
                    minValue={0}
                    rightButtonBackgroundColor="#EA3788"
                    leftButtonBackgroundColor="#E56B70"
                    rounded
                  />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder={'Price: ' + item[0].price}
                  value={'' + values.price}
                  onChangeText={handleChange('price')}
                  onBlur={handleBlur('price')}
                />

                <SegmentedButtons
                  style={styles.segmentButton}
                  value={values.category}
                  onValueChange={handleChange('category')}
                  theme={buttons}
                  buttons={[
                    {
                      value: 'Appetizer',
                      label: 'Appetizer',
                      style: {
                        borderWidth: 0,
                        borderRadius: 15,
                        backgroundColor:
                          values.category === 'Appetizer'
                            ? buttons.colors.primary
                            : buttons.colors.background,
                      },
                    },
                    {
                      value: 'Main',
                      label: 'Main',
                      style: {
                        borderWidth: 0,
                        borderRadius: 15,
                        backgroundColor:
                          values.category === 'Main'
                            ? buttons.colors.primary
                            : buttons.colors.background,
                      },
                    },
                    {
                      value: 'Dessert',
                      label: 'Dessert',
                      style: {
                        borderWidth: 0,
                        borderRadius: 15,
                        backgroundColor:
                          values.category === 'Dessert'
                            ? buttons.colors.primary
                            : buttons.colors.background,
                      },
                    },
                  ]}
                />

                {/* Checklist */}
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View style={styles.checkboxWrapper}>
                      <CheckBox
                        value={state.Vegan}
                        onValueChange={value =>
                          setState({
                            ...state,
                            Vegan: value,
                          })
                        }
                      />
                      <Text>Vegan</Text>
                    </View>

                    <View style={styles.checkboxWrapper}>
                      <CheckBox
                        value={state.Keto}
                        onValueChange={value =>
                          setState({
                            ...state,
                            Keto: value,
                          })
                        }
                      />
                      <Text>Keto</Text>
                    </View>

                    <View style={styles.checkboxWrapper}>
                      <CheckBox
                        value={state.Mediterranean}
                        onValueChange={value =>
                          setState({
                            ...state,
                            Mediterranean: value,
                          })
                        }
                      />
                      <Text>Mediterranean</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View style={styles.checkboxWrapper}>
                      <CheckBox
                        value={state.LowSugar}
                        onValueChange={value =>
                          setState({
                            ...state,
                            LowSugar: value,
                          })
                        }
                      />
                      <Text>Low Sugar</Text>
                    </View>

                    <View style={styles.checkboxWrapper}>
                      <CheckBox
                        value={state.LowCarb}
                        onValueChange={value =>
                          setState({
                            ...state,
                            LowCarb: value,
                          })
                        }
                      />
                      <Text>Low Carb</Text>
                    </View>

                    <View style={styles.checkboxWrapper}>
                      <CheckBox
                        value={state.LowCal}
                        onValueChange={value =>
                          setState({
                            ...state,
                            LowCal: value,
                          })
                        }
                      />
                      <Text>Low Cal</Text>
                    </View>
                  </View>
                </View>

                {/* Image Selection */}
                <>
                  <Text style={styles.Subheading}>Menu Picture:</Text>
                  {/* Image Selection */}
                  <View>
                    {actions.map(({title, type, options}) => {
                      return (
                        <Button
                          style={styles.button}
                          textColor="black"
                          mode="contained"
                          key={title}
                          onPress={() => {
                            onImageSelect(type, options);
                          }}>
                          {title}
                        </Button>
                      );
                    })}
                  </View>

                  {/* Show response */}
                  {response?.assets &&
                    response?.assets[0].uri &&
                    response?.assets.map(({uri}: {uri: string}) => (
                      <View style={styles.container} key={uri}>
                        <Image
                          resizeMode="cover"
                          resizeMethod="scale"
                          style={{
                            height: 200,
                            width: 200,
                            borderColor: 'black',
                            borderWidth: 2,
                          }}
                          source={{uri: uri}}
                        />
                        <Button
                          style={styles.button}
                          textColor="black"
                          mode="contained"
                          onPress={async () => {
                            //assign variable the uri
                            setfooduri(response.assets[0].uri);
                            const filename =
                              'menu:' + curUser?.uid + values.name;
                            //change uri link if needed
                            if (fooduri != null) {
                              const uploadUri =
                                Platform.OS === 'ios'
                                  ? fooduri.replace('file://', '')
                                  : fooduri;
                              //get path of the image
                              const fullpath = '/fooditems/' + filename;
                              if (
                                //check if there is an image already
                                storage().ref(fullpath).getDownloadURL() != null
                              ) {
                                //delete prev image
                                storage().ref(fullpath).delete();
                                console.log('previous image found');
                              }
                              //put file on storage
                              const task = storage()
                                .ref('/fooditems/' + filename)
                                .putFile(uploadUri);
                              try {
                                await task;
                              } catch (e) {
                                console.error(e);
                              }
                              //success
                              Alert.alert(
                                'Photo uploaded!',
                                'Your photo has been uploaded to Firebase Cloud Storage!',
                              );
                              storage()
                                .ref(fullpath) //name in storage in firebase console
                                .getDownloadURL()
                                .then(url => {
                                  console.log('image server url ', url);
                                  setImageUrl(url);
                                })
                                .catch(e =>
                                  console.log(
                                    'Errors while downloading => ',
                                    e,
                                  ),
                                );
                            }
                          }}>
                          Upload image
                        </Button>
                      </View>
                    ))}
                </>

                {/* Confirm Button */}
                <Button
                  style={styles.button}
                  textColor="black"
                  mode="contained"
                  onPress={handleSubmit}>
                  Save
                </Button>
              </>
            )}
          </Formik>
        </View>

        {/* Navigation Bar */}
        <MerchantNavigation navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const buttons = {
  roundness: 5,
  colors: {
    primary: '#A9FDAC',
    accent: '#f1c40f',
    background: '#f2f2f2',
  },
};

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Select Image',
    type: 'library',
    options: {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
];
