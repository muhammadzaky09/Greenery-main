//building the screen
import {Button, SegmentedButtons} from 'react-native-paper';
import {Text, View, TextInput, Alert, Platform, Image} from 'react-native';
import React, {useState} from 'react';
import {StackActions} from '@react-navigation/native';

//firebase stuff
import {ScrollView} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

//images
import * as ImagePicker from 'react-native-image-picker';
const includeExtra = true;

//form
import {Formik} from 'formik';

//import other screens
import MerchantHeader from '../PageHeader';
import MerchantNavigation from '../NavigationBar';
import {styles} from '../Style';

//Main funcion
export default function MerchantEditProfile({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Used for logout
  const handleLogout = async () => {
    auth()
      .signOut()
      .then(() => navigation.dispatch(StackActions.replace('MerchantSignin')));
    setIsLoggedIn(false);
    //just in case
    navigation.dispatch(StackActions.replace('MerchantSignin'));
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
        <MerchantHeader navigation={navigation} />

        {/* Main Content */}
        <View style={styles.container}>
          {/* Profile */}
          <Text style={styles.Subheading}>Login Information:</Text>
          <TextInput style={styles.input} placeholder="Change username..." />
          <TextInput
            style={styles.input}
            placeholder="Change E-Mail address..."
          />
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
              Category: '',
              Price: '',
              Address: '',
              Opening: '',
              Closing: '',
            }}
            onSubmit={values => {
              if (firestore().collection('merchant').doc(curUser?.uid)) {
                //user data found found
                console.log('user data found');
                firestore()
                  .collection('merchant')
                  .doc(curUser?.uid)
                  .set({
                    Name: values.Name,
                    Category: values.Category,
                    Price: values.Price,
                    Address: values.Address,
                    Opening: values.Opening,
                    Closing: values.Closing,
                  })
                  .then(() => {
                    console.log('User updated!');
                  });
              }
            }}>
            {({handleChange, handleBlur, handleSubmit, values}) => (
              <>
                <Text style={styles.Subheading}>Restaurant Details:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Restaurant Name..."
                  value={values.Name}
                  onChangeText={handleChange('Name')}
                  onBlur={handleBlur('Name')}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Restaurant Category..."
                  value={values.Category}
                  onChangeText={handleChange('Category')}
                  onBlur={handleBlur('Category')}
                />
                <SegmentedButtons
                  style={styles.segmentButton}
                  value={values.Price}
                  onValueChange={handleChange('Price')}
                  theme={buttons}
                  buttons={[
                    {
                      value: 'Low',
                      label: 'Low',
                      style: {
                        borderWidth: 0,
                        borderRadius: 15,
                        backgroundColor:
                          values.Price === 'Low'
                            ? buttons.colors.primary
                            : buttons.colors.background,
                      },
                    },
                    {
                      value: 'Medium',
                      label: 'Medium',
                      style: {
                        borderWidth: 0,
                        borderRadius: 15,
                        backgroundColor:
                          values.Price === 'Medium'
                            ? buttons.colors.primary
                            : buttons.colors.background,
                      },
                    },
                    {
                      value: 'High',
                      label: 'High',
                      style: {
                        borderWidth: 0,
                        borderRadius: 15,
                        backgroundColor:
                          values.Price === 'High'
                            ? buttons.colors.primary
                            : buttons.colors.background,
                      },
                    },
                  ]}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address..."
                  value={values.Address}
                  onChangeText={handleChange('Address')}
                  onBlur={handleBlur('Address')}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Opening Time..."
                  id="Opening"
                  value={values.Opening}
                  onChangeText={handleChange('Opening')}
                  onBlur={handleBlur('Opening')}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Closing Time..."
                  value={values.Closing}
                  onChangeText={handleChange('Closing')}
                  onBlur={handleBlur('Closing')}
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
            <Text style={styles.Subheading}>Restaurant Picture:</Text>
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
                      setpfpUri(response.assets[0].uri);
                      console.log('file: ', pfpUri);
                      const filename = 'ProfilePicture:' + curUser?.uid;
                      if (pfpUri != null) {
                        const uploadUri =
                          Platform.OS === 'ios'
                            ? pfpUri.replace('file://', '')
                            : pfpUri;
                        //check if there is a pfp already
                        const fullpath = '/merchant/' + filename;
                        if (storage().ref(fullpath).getDownloadURL() != null) {
                          storage().ref(fullpath).delete();
                        }
                        const task = storage()
                          .ref('/merchant/' + filename)
                          .putFile(uploadUri);
                        try {
                          await task;
                        } catch (e) {
                          console.error(e);
                        }
                        Alert.alert(
                          'Photo uploaded!',
                          'Your photo has been uploaded to Firebase Cloud Storage!',
                        );
                        const uriFirebase = await storage()
                          .ref(fullpath) //name in storage in firebase console
                          .getDownloadURL();
                        await firestore()
                          .collection('merchant')
                          .doc(curUser?.uid)
                          .update({
                            image: uriFirebase,
                          })
                          .then(() => {
                            console.log('pfp updated!');
                          });
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
