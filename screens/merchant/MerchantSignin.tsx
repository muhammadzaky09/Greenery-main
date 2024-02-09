//basic
import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {View, Image} from 'react-native';
import {StackActions} from '@react-navigation/native';
//material ui + form
import {Button, Text, TextInput} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
//user session security
import auth, {firebase} from '@react-native-firebase/auth';
import {styles} from '../authStyles';
import {useIsFocused} from '@react-navigation/native';

export default function MerchantSignin({navigation}: {navigation: any}) {
  const isFocused = useIsFocused();
  const [isvalid, setisvalid] = React.useState(true);

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      if (firebase.auth().currentUser != null) {
        console.log('Merchant Sign in: user logged');
        navigation.dispatch(StackActions.replace('MerchantHomepage'));
      } else {
        console.log('Merchant Sign in: No user signed in data saved');
      }
    }
  }, [isFocused, navigation]);

  //formik validation
  const SignupSchema = Yup.object().shape({
    email: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
  });
  //what is displayed
  return (
    //form setup
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      //activate validation
      validationSchema={SignupSchema}
      //submit form values
      onSubmit={values => {
        //login
        auth()
          .signInWithEmailAndPassword(values.email, values.password)
          .then(userCredential => {
            console.log('signed in as ', userCredential.user.email);
            //next page
            navigation.dispatch(StackActions.replace('MerchantHomepage'));
          })
          .catch(error => {
            const errorCode = error.code;
            console.log(errorCode);
            setisvalid(false);
            //wrong credentials
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
            placeholder="Enter Email..."
            style={styles.paperinput}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            error={touched.email && Boolean(errors.email)}
          />
          <TextInput
            mode="outlined"
            placeholder="Enter password..."
            style={styles.paperinput}
            secureTextEntry
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            error={touched.password && Boolean(errors.password)}
          />
          {/* Bottom Buttons */}
          {!isvalid ? (
            <View>
              <Text style={styles.errorText}>
                Invalid Email-Password Combination
              </Text>
            </View>
          ) : (
            <Text> </Text>
          )}
          <Button
            style={styles.buttonDefault}
            textColor="black"
            mode="contained"
            onPress={handleSubmit}>
            Sign In
          </Button>

          <Text>
            <Text>Don't have an Accoount? Sign Up </Text>
            <Text
              style={styles.Highlight}
              onPress={() => {
                navigation.push('MerchantSignup');
              }}>
              Here
            </Text>
          </Text>
          <Text> Return to Homepage?</Text>
          <Text
            style={styles.Highlight}
            onPress={() => {
              navigation.dispatch(StackActions.replace('Homepage'));
            }}>
            Here
          </Text>
        </View>
      )}
    </Formik>
  );
}
