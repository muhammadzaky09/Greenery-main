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

export default function MerchantDetails({navigation}: {navigation: any}) {
  const curUser = firebase.auth().currentUser;
  //formik validation
  const SignupSchema = Yup.object().shape({
    Category: Yup.string()
      .min(4, 'Too Short!')
      .max(16, 'Too Long!')
      .required('Required'),
    Name: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    Address: Yup.string()
      .min(8, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    Opening: Yup.number()
      .typeError('must be a number')
      .min(0, 'Too Short!')
      .max(24, 'Too Long!')
      .positive('time must be greater than zero')
      .required('Required'),
    Closing: Yup.number()
      .typeError('must be a number')
      .min(0, '0-24 Hours!')
      .max(24, '0-24 Hours!')
      .positive('time must be greater than zero')
      .required('Required'),
  });

  return (
    <View style={styles.container}>
      <Image style={styles.ImageS} source={require('../../assets/logo.png')} />
      <Formik
        initialValues={{
          Name: '',
          Category: '',
          Price: '',
          Address: '',
          Opening: '',
          Closing: '',
        }}
        //activate validation
        validationSchema={SignupSchema}
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
                restoid: values.Name + values.Address,
              })
              .then(() => {
                console.log('User updated!');
                navigation.dispatch(StackActions.replace('MerchantHomepage'));
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
            <Text style={styles.Subheading}>Restaurant Details:</Text>
            <TextInput
              style={styles.input}
              mode="outlined"
              placeholder="Restaurant Name..."
              value={values.Name}
              onChangeText={handleChange('Name')}
              onBlur={handleBlur('Name')}
              error={touched.Name && Boolean(errors.Name)}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              placeholder="Restaurant Category..."
              value={values.Category}
              onChangeText={handleChange('Category')}
              onBlur={handleBlur('Category')}
              error={touched.Category && Boolean(errors.Category)}
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
              mode="outlined"
              placeholder="Address..."
              value={values.Address}
              onChangeText={handleChange('Address')}
              onBlur={handleBlur('Address')}
              error={touched.Address && Boolean(errors.Address)}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              placeholder="Opening Time..."
              id="Opening"
              value={values.Opening}
              onChangeText={handleChange('Opening')}
              onBlur={handleBlur('Opening')}
              error={touched.Opening && Boolean(errors.Opening)}
            />
            <TextInput
              style={styles.input}
              mode="outlined"
              placeholder="Closing Time..."
              value={values.Closing}
              onChangeText={handleChange('Closing')}
              onBlur={handleBlur('Closing')}
              error={touched.Closing && Boolean(errors.Closing)}
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
