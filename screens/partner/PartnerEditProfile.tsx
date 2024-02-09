/* eslint-disable @typescript-eslint/no-unused-vars */
//building the screen
import {Button, IconButton, SegmentedButtons} from 'react-native-paper';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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

//import other screens
import {PartnerNavigation} from '../NavigationBar';
import {PartnerHeader} from '../PageHeader';
import {styles} from '../Style';

//Main funcion
export default function PartnerEditProfile({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Used for logout
  const handleLogout = async () => {
    auth()
      .signOut()
      .then(() => navigation.dispatch(StackActions.replace('PartnerSignin')));
    setIsLoggedIn(false);
    //just in case
    navigation.dispatch(StackActions.replace('PartnerSignin'));
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

  return (
    <View>
      <ScrollView>
        {/* Banner */}
        <PartnerHeader navigation={navigation} />
        {/* Main Content */}
        <View style={styles.centeredContainer}>
          {/* Profile */}
          <Text style={styles.Subheading}>Profile</Text>
          <TextInput style={styles.input} placeholder="Change username..." />
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
              VehicleType: '',
              VehicleDescription: '',
              VehiclePlateNumber: '',
            }}
            onSubmit={values => {
              console.log('new values: ', values);
              //**change this to send the form data to the partner database
              if (firestore().collection('partner').doc(curUser?.uid)) {
                //user data found found
                console.log('user data found');
                //   //change this to send the 'change vehicle detils'
                firestore()
                  .collection('partner')
                  .doc(curUser?.uid)
                  .update({
                    VehicleType: values.VehicleType,
                    VehicleDescription: values.VehicleDescription,
                    VehiclePlateNumber: values.VehiclePlateNumber,
                  })
                  .then(() => {
                    console.log('User updated!');
                  });
              }
            }}>
            {({handleChange, handleBlur, handleSubmit, values}) => (
              <>
                <Text style={styles.Subheading}>Change Vehicle Details:</Text>
                <SegmentedButtons
                  style={styles.segmentButton}
                  value={values.VehicleType}
                  onValueChange={handleChange('VehicleType')}
                  theme={buttons}
                  buttons={[
                    {
                      value: 'Motorcycle',
                      label: 'Motorcycle',
                      style: {
                        borderWidth: 0,
                        borderRadius: 15,
                        backgroundColor:
                          values.VehicleType === 'Motorcycle'
                            ? buttons.colors.primary
                            : buttons.colors.background,
                      },
                    },
                    {
                      value: 'Car',
                      label: 'Car',
                      style: {
                        borderWidth: 0,
                        borderRadius: 15,
                        backgroundColor:
                          values.VehicleType === 'Car'
                            ? buttons.colors.primary
                            : buttons.colors.background,
                      },
                    },
                  ]}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Vehicle Description..."
                  value={values.VehicleDescription}
                  onChangeText={handleChange('VehicleDescription')}
                  onBlur={handleBlur('VehicleDescription')}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Vehicle Vehicle Plate Number..."
                  id="Price"
                  value={values.VehiclePlateNumber}
                  onChangeText={handleChange('VehiclePlateNumber')}
                  onBlur={handleBlur('VehiclePlateNumber')}
                />

                {/* Confirm Button */}
                <Button
                  style={styles.button}
                  textColor="black"
                  mode="contained"
                  onPress={handleSubmit}>
                  Confirm
                </Button>
              </>
            )}
          </Formik>
          <>
            <Text style={styles.Subheading}>Driver Picture:</Text>
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
                        const fullpath = '/driverProfile/' + filename;
                        if (storage().ref(fullpath).getDownloadURL() != null) {
                          storage().ref(fullpath).delete();
                        }
                        //put file on storage
                        const task = storage()
                          .ref('/driverProfile/' + filename)
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
        <View style={styles.container}>
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
        <PartnerNavigation navigation={navigation} />
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
