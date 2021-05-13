import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from 'components';
import R from 'res/R';

export default () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        There are no products in your store yet. Please press the{' '}
        <MaterialIcons name="playlist-plus" size={14} /> in the upper right to
        add a product.
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
    width: 240,
    textAlign: 'center',
    fontSize: 16,
    color: R.colors.cadetBlue,
  },
});
