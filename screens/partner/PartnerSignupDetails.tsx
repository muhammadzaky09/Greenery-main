//basic
import React from 'react';
import 'react-native-gesture-handler';
import {View, Image} from 'react-native';
import {StackActions} from '@react-navigation/native';
//material ui + form
import {Button, Text, TextInput, SegmentedButtons} from 'react-native-paper';
import {Formik} from 'formik';
import {styles} from '../authStyles';
import * as Yup from 'yup';

//firebase
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function PartnerSignupDetails({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;
  //formik validation
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const SignupSchema = Yup.object().shape({
    PhoneNumber: Yup.string()
      .min(8, 'Too Short!')
      .max(12, 'Too Long!')
      .required('Required')
      .matches(phoneRegExp, 'Phone number is not valid'),
    Name: Yup.string()
      .min(4, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    VehiclePlate: Yup.string()
      .min(5, 'Too Short!')
      .max(9, 'Too Long!')
      .required('Required'),
    VehicleDescription: Yup.string()
      .min(4, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
  });
  return (
    <View style={styles.container}>
      <Image style={styles.Image} source={require('../../assets/logo.png')} />
      <Formik
        initialValues={{
          PhoneNumber: '',
          VehiclePlate: '',
          VehicleDescription: '',
          Name: '',
          VehicleType: '',
        }}
        //activate validation
        validationSchema={SignupSchema}
        onSubmit={values => {
          if (firestore().collection('driver').doc(curUser?.uid)) {
            //find driver data document from firestore
            console.log('user data found');
            //write a new document with the new information
            firestore()
              .collection('driver')
              .doc(curUser?.uid)
              .set({
                Name: values.Name,
                PhoneNumber: values.PhoneNumber,
                VehiclePlate: values.VehiclePlate,
                VehicleDescription: values.VehicleDescription,
                latitude: -7.7739,
                longitude: 110.3741,
                Status: 'available',
              })
              .then(() => {
                //update successful
                console.log('User updated!');
                navigation.dispatch(StackActions.replace('PartnerHomepage'));
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
          <>
            <Text style={styles.Subheading}>Driver Information:</Text>
            <TextInput
              style={styles.input}
              placeholder="Driver Name..."
              id="DriverName"
              mode="outlined"
              value={values.Name}
              onChangeText={handleChange('Name')}
              onBlur={handleBlur('Name')}
              error={touched.Name && Boolean(errors.Name)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number..."
              mode="outlined"
              id="PhoneNumber"
              value={values.PhoneNumber}
              onChangeText={handleChange('PhoneNumber')}
              onBlur={handleBlur('PhoneNumber')}
              error={touched.PhoneNumber && Boolean(errors.PhoneNumber)}
            />
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
              mode="outlined"
              placeholder="Vehicle Plate Number..."
              id="VehiclePlate"
              value={values.VehiclePlate}
              onChangeText={handleChange('VehiclePlate')}
              onBlur={handleBlur('VehiclePlate')}
              error={touched.VehiclePlate && Boolean(errors.VehiclePlate)}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              placeholder="Vehicle Description..."
              id="VehicleDescription"
              value={values.VehicleDescription}
              onChangeText={handleChange('VehicleDescription')}
              onBlur={handleBlur('VehicleDescription')}
              error={
                touched.VehicleDescription && Boolean(errors.VehicleDescription)
              }
            />

            {/* Confirm Button */}
            <Button
              style={styles.buttonDefault}
              textColor="black"
              mode="contained"
              onPress={handleSubmit}>
              Confirm
            </Button>
          </>
        )}
      </Formik>
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
