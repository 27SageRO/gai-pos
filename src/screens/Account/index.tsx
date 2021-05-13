import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import actions from 'rdx/rootActions';
import R from 'res/R';

import EditProfile from './components/EditProfile';

export default function AccountScreen() {
  const userProfile = useSelector((state: ReduxState) => state.user.profile);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Store Name: {userProfile?.storeName}</Text>
      <Text style={styles.h1}>Owner: {userProfile?.ownerName}</Text>
      <Text style={styles.h1}>
        Vat Reg TIN: {userProfile?.vatRegTin}{' '}
        <EditProfile propertyName="vatRegTin" />
      </Text>
      <Text style={styles.h1}>
        Cashier Name: {userProfile?.cashierName}{' '}
        <EditProfile propertyName="cashierName" />
      </Text>
      <Pressable onPress={() => dispatch(actions.userLogout())}>
        <Text style={[styles.h1, {color: R.colors.malibu}]}>Logout?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: R.colors.white},
  h1: {
    color: R.colors.riverBed,
    fontSize: 16,
    marginHorizontal: 16,
    marginTop: 7,
  },
});
