/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import 'react-native-gesture-handler';
import {View, Image, TouchableOpacity, TouchableHighlight, StyleSheet} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Divider, Text} from 'react-native-paper';

//import other pages
import MerchantHeader from '../PageHeader';
import MerchantNavigation from '../NavigationBar';

export default function MerchantOrdersDetail({navigation}: {navigation: any}) {
  // eslint-disable-next-line react/no-unstable-nested-components
  
  return (
    <View style={styles.containerUncentered}>
      {/* Banner */}
      <MerchantHeader navigation={navigation} />
      {/* Content */}
      
      <View style={styles.contentBox}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>{navigation.push('MerchantOrdersReceived');}}>
            <View style={{width:30,height:30,borderRadius:15,borderWidth:1,borderColor:'black',marginTop:20,marginLeft:30}}>
              <Image source={require('../../assets/back.png')} style={styles2.Image}/>
            </View>
          </TouchableOpacity>
          <Text style={styles.homepagetext}>Order Number K-B65939743</Text>
        </View>
        

        {/* Divider */}
        <View style={{alignItems:'center',marginVertical:10}}>
          <Divider style={{width:'85%'}}/>
        </View>
        {/* Customer */}
        <View style={{marginLeft:30}}>
          <Text style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>Customer</Text>
          <View style={{flexDirection:'row'}}>

            <View style={styles2.Circle}>
              <Image source={require('../../assets/person.png')} style={styles2.Image}/>
            </View>

            <View style={{marginLeft:10,justifyContent:'center'}}>
              <Text style={{fontWeight:'bold'}}>Name</Text>
              <Text>Address</Text>
            </View>

            <View style={{alignItems:'center',flexDirection:'row',marginLeft:150}}>
              <TouchableOpacity>
                <View style={styles2.SmallCircle}>
                  <Image source={require('../../assets/telephone.png')} style={styles2.Image}/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View style={styles2.SmallCircle}>
                  <Image source={require('../../assets/message.png')} style={styles2.Image}/>
                </View>
              </TouchableOpacity>
              
  
              
            </View>
          
          </View>
        </View>

        <View style={{alignItems:'center',marginVertical:10}}>
          <Divider style={{width:'85%'}}/>
        </View>

        {/*  Driver */}
        <View style={{marginLeft:30}}>
          <Text style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>Driver</Text>
          <View style={{flexDirection:'row'}}>

            <View style={styles2.Circle}>
              <Image source={require('../../assets/person.png')} style={styles2.Image}/>
            </View>

            <View style={{marginLeft:10,justifyContent:'center'}}>
              <Text style={{fontWeight:'bold'}}>Name</Text>
              <Text>Address</Text>
            </View>

            <View style={{alignItems:'center',flexDirection:'row',marginLeft:150}}>
              <TouchableOpacity>
                <View style={styles2.SmallCircle}>
                  <Image source={require('../../assets/telephone.png')} style={styles2.Image}/>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View style={styles2.SmallCircle}>
                  <Image source={require('../../assets/message.png')} style={styles2.Image}/>
                </View>
              </TouchableOpacity>
              
  
              
            </View>
          
          </View>
        </View>

        <View style={{alignItems:'center',marginVertical:10}}>
          <Divider style={{width:'85%'}}/>
        </View>

        {/* Order Detail*/}
        <View style={{marginHorizontal:30}}>
          <Text style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>Order Details</Text>

          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={{fontWeight:'bold'}}>Name</Text>
            <Text style={{fontWeight:'bold'}}>Quantity</Text>
            <Text style={{fontWeight:'bold'}}>Price</Text>
          </View>

          <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:5}}>
            <Text>Nasi Goreng</Text>
            <Text>2</Text>
            <Text>$25</Text>
          </View>

          <Divider bold color="black" />

          <TouchableOpacity style={{alignItems:'center',marginTop:50}}>
            <View style={{width:70,height:40,borderColor:'black',borderWidth:1,backgroundColor:'#A9FDAC',padding:8,borderRadius:8}}>
              <Text style={{fontWeight:'bold'}}>Confirm</Text>
            </View>
          </TouchableOpacity>
          
        </View>
      </View>
      {/* Navigation */}
      <MerchantNavigation navigation={navigation} />
    </View>
   
  );
}

const styles2 = StyleSheet.create({
  SmallCircle: { 
    width:40,
    height:40,
    borderRadius:20,
    borderWidth:1,
    borderColor:'black'
  },

  Circle: {
    width:50,
    height:50,
    borderRadius:25,
    borderWidth:1,
    borderColor:'black'

  },
  Image: {
    width:'100%',
    height: undefined,
    aspectRatio:1
  },
});
