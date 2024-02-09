//basic
import React from 'react';
import 'react-native-gesture-handler';
import {View, Image} from 'react-native';
import {StackActions} from '@react-navigation/native';

//material ui + form
import {Button, Text, TextInput} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {styles} from '../authStyles';

//firebase
import auth from '@react-native-firebase/auth';

export default function MerchantSignup({navigation}: {navigation: any}) {
  const [isvalid, setisvalid] = React.useState(true);

  //formik validation
  const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(6, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    confirmPassword: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('password')], 'Must match "password" field value'),
  });

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: '',
      }}
      //activate validation
      validationSchema={SignupSchema}
      onSubmit={values => {
        //registering user
        setisvalid(true);
        auth()
          .createUserWithEmailAndPassword(values.email, values.password)
          .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('error: ', errorCode, ' : ', errorMessage);
            setisvalid(false);
          })
          .then(() => {
            if (isvalid) {
              //login in user for details
              auth()
                .signInWithEmailAndPassword(values.email, values.password)
                .then(() => {
                  console.log('to merchant details');
                  navigation.dispatch(StackActions.replace('MerchantDetails'));
                })
                .catch((error: {code: any}) => {
                  const errorCode = error.code;
                  console.log(errorCode);
                  //wrong credentials
                });
            }
          });
      }}>
      {({handleChange, handleBlur, handleSubmit, values, touched, errors}) => (
        <View style={styles.container}>
          {/* Image section */}
          <View style={styles.banner} />
          <Image
            style={styles.Image}
            source={require('../../assets/logo.png')}
          />
          {/* Input section */}
          <TextInput
            mode="outlined"
            placeholder="Enter email address..."
            style={styles.input}
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            error={touched.email && Boolean(errors.email)}
          />
          <TextInput
            mode="outlined"
            placeholder="Enter password..."
            style={styles.input}
            secureTextEntry
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            error={touched.password && Boolean(errors.password)}
          />
          <TextInput
            mode="outlined"
            placeholder="Confirm password..."
            style={styles.input}
            secureTextEntry
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
          />

          {/* Bottom Buttons */}
          {!isvalid ? (
            <View>
              <Text style={styles.errorText}>Email already taken</Text>
            </View>
          ) : (
            <Text> </Text>
          )}
          <Button
            style={styles.buttonDefault}
            textColor="black"
            mode="contained"
            onPress={handleSubmit}>
            Next
          </Button>

          <Text>
            <Text>Already have an account? Sign In </Text>
            <Text
              style={styles.Highlight}
              onPress={() => {
                navigation.push('MerchantSignin');
              }}>
              Here
            </Text>
          </Text>
        </View>
      )}
    </Formik>
  );
}
