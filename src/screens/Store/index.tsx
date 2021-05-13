import {Ionicons, Modal} from 'components';
import actions from 'rdx/rootActions';
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import R from 'res/R';

import CreateProduct from './components/CreateProduct';
import EmptyState from './components/EmptyState';

type Props = {
  navigation: NativeStackNavigationProp<AppNavigation>;
};

export default function StoreScreen({}: Props) {
  const products = useSelector((state: ReduxState) => state.products.products);
  const dispatch = useDispatch();

  const [removeId, setRemoveId] = useState('');

  const productKeys = Object.keys(products);

  useEffect(() => {
    dispatch(actions.getProductsBegin());
  }, []);

  const isEmpty = Object.keys(products).length === 0;

  return (
    <View style={styles.fill}>
      {isEmpty && <EmptyState />}
      {!isEmpty && (
        <FlatList
          data={productKeys}
          keyExtractor={(k) => k}
          renderItem={({item}) => {
            const product = products[item];
            return (
              <View style={styles.item}>
                <View style={styles.fill}>
                  <Text style={styles.h1}>
                    {product.description}{' '}
                    <Text style={styles.h2}>{product.sku}</Text>
                  </Text>
                  <Text style={styles.h2}>{item}</Text>
                </View>
                <View style={styles.itemPrice}>
                  <Text style={styles.h1}>P {product.price}</Text>
                </View>
                <Pressable
                  style={styles.button}
                  onPress={() => setRemoveId(item)}>
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color={R.colors.malibu}
                  />
                </Pressable>
              </View>
            );
          }}
        />
      )}
      <CreateProduct />
      <Modal
        visible={removeId !== ''}
        title="NOTIFICATION"
        content="This action will remove all your items in your cart. Are you sure you want to continue?"
        onPressCancel={() => setRemoveId('')}
        onPressConfirm={() => {
          dispatch(actions.delProductBegin(removeId));
          setRemoveId('');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  h1: {fontFamily: R.fonts.bold, color: R.colors.riverBed, fontSize: 15},
  h2: {color: R.colors.riverBed, fontSize: 12},
  item: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: R.colors.white,
    borderRadius: 4,
    padding: 8,
  },
  itemPrice: {alignItems: 'center', justifyContent: 'center', marginRight: 8},
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
