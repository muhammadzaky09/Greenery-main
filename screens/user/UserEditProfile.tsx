/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
//building the screen
import {Button, SegmentedButtons} from 'react-native-paper';
import {Text, View, TextInput, Alert, Platform, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackActions} from '@react-navigation/native';

//firebase stuff
import {ScrollView} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

//images
import * as ImagePicker from 'react-native-image-picker';
const includeExtra = true;

//form
import {Formik} from 'formik';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';

//import other screens
import {UserNavigation} from '../NavigationBar';
import {UserHeader} from '../PageHeader';
import {styles} from '../Style';

//checkbox categories
const initialState = {
  Vegan: false,
  Keto: false,
  Mediterranean: false,
  LowSugar: false,
  LowCarb: false,
  LowCal: false,
};
//Main funcion
export default function UserEditProfile({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  //Used for logout
  const handleLogout = async () => {
    auth()
      .signOut()
      .then(() => navigation.dispatch(StackActions.replace('UserSignin')));
    setIsLoggedIn(false);
    //just in case
    navigation.push('UserSignin');
  };
  //used for profile picture
  const [response, setResponse] = React.useState<any>(null);
  const onImageSelect = React.useCallback((type: any, options: any) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);

  //upload to firebase
  const [pfpUri, setpfpUri] = useState(null);

  //checkbox
  const [toggleButton, setToggleButton] = React.useState(false);
  const [state, setState] = React.useState(initialState);

  return (
    <View>
      <ScrollView>
        {/* Banner */}
        <UserHeader navigation={navigation} />
        {/* Main Content */}
        <View style={styles.centeredContainer}>
          {/* Profile */}
          <Text style={styles.Subheading}>Profile</Text>
          <TextInput style={styles.input} placeholder="Change Name..." />
          <TextInput
            style={styles.input}
            placeholder="Change E-Mail address..."
          />
          <TextInput style={styles.input} placeholder="Phone number..." />
          <Button
            style={styles.button}
            textColor="black"
            mode="contained"
            onPress={() => {
              console.log('confirm');
            }}>
            Confirm
          </Button>

          {/* Password */}
          <Text style={styles.Subheading}>Change Password:</Text>
          <TextInput style={styles.input} placeholder="Enter New Password..." />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password..."
          />
          <Button style={styles.button} textColor="black" mode="contained">
            Confirm
          </Button>

          {/* Details */}
          <Formik
            initialValues={{
              Name: '',
              Address: '',
            }}
            onSubmit={values => {
              console.log('new values: ', values);
            }}>
            {({handleChange, handleBlur, handleSubmit, values}) => (
              <View style={styles.container2}>
                <Text style={styles.Subheading}>Food Preferences</Text>
                <View>
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

                  <Button
                    style={styles.button}
                    textColor="black"
                    mode="contained"
                    onPress={() => {
                      setToggleButton(toggleButton => !toggleButton);
                      console.log(state);
                    }}>
                    Save
                  </Button>
                </View>
                {toggleButton && (
                  <View style={styles.resultContainer}>
                    {Object.entries(state).map(([key, value]) => {
                      return (
                        value && (
                          <View key={key} style={{paddingHorizontal: 5}}>
                            <Text>Preferences: {key}</Text>
                          </View>
                        )
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          </Formik>
          <>
            <Text style={styles.Subheading}>User Picture:</Text>
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
                    // eslint-disable-next-line react-native/no-inline-styles
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
                      setpfpUri(response.assets[0].uri);
                      console.log('file: ', pfpUri);
                      const filename = 'ProfilePicture:' + curUser?.uid;
                      //change uri link if needed
                      if (pfpUri != null) {
                        const uploadUri =
                          Platform.OS === 'ios'
                            ? pfpUri.replace('file://', '')
                            : pfpUri;
                        //check if there is a pfp already (if there is an image url)
                        const fullpath = '/userProfile/' + filename;
                        if (storage().ref(fullpath).getDownloadURL() != null) {
                          storage().ref(fullpath).delete();
                        }
                        //put file on storage
                        const task = storage()
                          .ref('/userProfile/' + filename)
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
                        setpfpUri(null);
                      }
                    }}>
                    Upload image
                  </Button>
                </View>
              ))}
          </>
        </View>

        {/* Logout Button */}
        <View style={styles.containerLogout}>
          <Text>Want to log out?</Text>
          <Button
            style={styles.logoutButton}
            textColor="black"
            mode="contained"
            onPress={handleLogout}>
            Log Out
          </Button>
        </View>

        {/* Navigation Bar */}
        <UserNavigation navigation={navigation} />
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
