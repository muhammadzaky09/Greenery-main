/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export default function OrderBar({
  navigation,
  status,
}: {
  navigation: any;
  status: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#A9FDAC',
        padding: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.push('MerchantOrdersReceived');
        }}>
        <Text style={{fontWeight: status === 1 ? 'bold' : 'normal'}}>
          Received
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.push('MerchantOrdersProcessing');
        }}>
        <Text style={{fontWeight: status === 2 ? 'bold' : 'normal'}}>
          Processing
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.push('MerchantOrdersOnDelivery');
        }}>
        <Text style={{fontWeight: status === 3 ? 'bold' : 'normal'}}>
          On Delivery
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.push('MerchantOrdersFinished');
        }}>
        {/* bold text if status = 4 */}
        <Text style={{fontWeight: status === 4 ? 'bold' : 'normal'}}>
          Finished
        </Text>
      </TouchableOpacity>
    </View>
    //2 rows, 5 columns
  );
}
