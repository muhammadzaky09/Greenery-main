/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import 'react-native-gesture-handler';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  GestureResponderEvent,
  ImageSourcePropType,
  ImageBackground,
} from 'react-native';
import {styles} from '../Style';
//material ui + form
import {Text} from 'react-native-paper';
import {UserNavigation} from '../NavigationBar';
import {UserHeader} from '../PageHeader';
import {StackActions} from '@react-navigation/native';

//main
export default function UserWalletTopup({navigation}: {navigation: any}) {
  // eslint-disable-next-line react/no-unstable-nested-components
  const TopupOption = (props:{
    optionLogo: ImageSourcePropType;
    optionName: string;
  }) => {
    return (
        <TouchableOpacity style={{marginTop:25}}>
            <View style={{borderColor:'black',borderWidth:1,width:319,height:70,borderRadius:8,backgroundColor:'#A9FDAC',alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={props.optionLogo} style={{marginLeft:20}}/>
                    <Text style={{marginLeft:20,fontWeight:'bold'}}>{props.optionName}</Text>
                </View>
                        
                <Image source={require('../../assets/Arrow.png')} style={{marginRight:10}}/>
            </View>
        </TouchableOpacity>
    );
  };

  

  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <View style={styles.containerUncentered}>
          {/* Banner */}
          <UserHeader navigation={navigation} />
          {/* Content */}
          <View style={styles.contentBox}>
            <View style={{flexDirection:'row',alignItems:'center'}}>  

              <Text style={styles.homepagetext}>
                Top Up Through:
              </Text>
            </View>

            <View style={{alignItems:'center'}}>
                <TopupOption
                optionLogo = {require('../../assets/bca.png')}
                optionName = 'BCA Mobile' 
                />

                <TopupOption
                optionLogo={require('../../assets/bri.png')}
                optionName='BRI Mobile'
                />

                <TopupOption
                optionLogo={require('../../assets/mandiri.png')}
                optionName='Mandiri Mobile'
                />

            </View>

            

            <View style={{flex:1,alignItems:'center',marginTop:20}}>
               

                
                
            </View>

            
            

            
          </View>
          {/* Navigation */}
          <UserNavigation navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
}
