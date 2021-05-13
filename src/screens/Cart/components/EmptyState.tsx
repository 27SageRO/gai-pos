import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from 'components';
import R from 'res/R';

export default () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        There are no items in your cart yet. Please go to Scan (
        <MaterialIcons name="barcode-scan" />) to add items in your cart.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    width: 220,
    textAlign: 'center',
    fontSize: 16,
    color: R.colors.cadetBlue,
  },
});
