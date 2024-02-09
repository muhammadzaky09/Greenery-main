/* eslint-disable react-native/no-inline-styles */
//basic
import React from 'react';
import 'react-native-gesture-handler';
import {View, Image, ScrollView} from 'react-native';
import {StackActions} from '@react-navigation/native';
//material ui + form
import {Button, Text, TextInput} from 'react-native-paper';
import {Formik} from 'formik';
import {styles} from '../authStyles';
import * as Yup from 'yup';
import CheckBox from '@react-native-community/checkbox';

//firebase
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const initialState = {
  Vegan: false,
  Keto: false,
  Mediterranean: false,
  LowSugar: false,
  LowCarb: false,
  LowCal: false,
};

export default function UserDetails({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;
  //formik validation
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const SignupSchema = Yup.object().shape({
    Name: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    Address: Yup.string()
      .min(8, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    PhoneNumber: Yup.string()
      .min(8, 'Too Short!')
      .max(12, 'Too Long!')
      .required('Required')
      .matches(phoneRegExp, 'Phone number is not valid'),
  });
  const [state, setState] = React.useState(initialState);
  const [toggleButton, setToggleButton] = React.useState(false);

  return (
    <View style={styles.container}>
      <Image style={styles.Image} source={require('../../assets/logo.png')} />
      <Formik
        initialValues={{
          Name: '',
          PhoneNumber: '',
          Address: '',
        }}
        //activate validation
        validationSchema={SignupSchema}
        onSubmit={values => {
          if (firestore().collection('user').doc(curUser?.uid)) {
            //find user data document from firestore
            console.log('user data found');
            //write a new document with the new information
            firestore()
              .collection('user')
              .doc(curUser?.uid)
              .set({
                Name: values.Name,
                Address: values.Address,
                PhoneNumber: values.PhoneNumber,
                Vegan: state.Vegan,
                Keto: state.Keto,
                Mediterranean: state.Mediterranean,
                LowSugar: state.LowSugar,
                LowCarb: state.LowCarb,
                LowCal: state.LowCal,
              })
              .then(() => {
                //update successful
                console.log('User updated!');
                navigation.dispatch(StackActions.replace('UserHomepage'));
              });
          }
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
        }) => (
          <ScrollView>
            <Text style={styles.Subheading}>User Information:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name..."
              mode="outlined"
              value={values.Name}
              onChangeText={handleChange('Name')}
              onBlur={handleBlur('Name')}
              error={touched.Name && Boolean(errors.Name)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your address..."
              mode="outlined"
              value={values.Address}
              onChangeText={handleChange('Address')}
              onBlur={handleBlur('Address')}
              error={touched.Address && Boolean(errors.Address)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number..."
              mode="outlined"
              value={values.PhoneNumber}
              onChangeText={handleChange('PhoneNumber')}
              onBlur={handleBlur('PhoneNumber')}
              error={touched.PhoneNumber && Boolean(errors.PhoneNumber)}
            />
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
                  onPress={() => {
                    setToggleButton(toggleButton => !toggleButton);
                    console.log(state);
                  }}>
                  save
                </Button>
              </View>
              {toggleButton && (
                <View style={styles.resultContainer}>
                  {Object.entries(state).map(([key, value]) => {
                    return (
                      value && (
                        <View key={key} style={{paddingHorizontal: 5}}>
                          <Text>{key}</Text>
                        </View>
                      )
                    );
                  })}
                </View>
              )}
            </View>

            {/* Confirm Button */}
            <Button
              style={styles.buttonDefault}
              textColor="black"
              mode="contained"
              onPress={handleSubmit}>
              Confirm
            </Button>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
}
