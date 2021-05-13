import React, {useLayoutEffect, useMemo, useRef, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Pressable} from 'react-native';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {TextInputMask} from 'react-native-masked-text';
import ViewShot, {captureRef} from 'react-native-view-shot';
import moment from 'moment';
import R from 'res/R';

import {MaterialIcons} from 'components';
import actions from 'rdx/rootActions';
import EmptyState from './components/EmptyState';
import SwipableItem from './components/SwipableItem';

type Totals = {
  amountDue: string;
  vatableSales: string;
  vatAmount: string;
};

type Props = {
  navigation: NativeStackNavigationProp<AppNavigation>;
};

const generateORNumber = () => {
  return Math.random().toString().slice(2, 11);
};

export default function CartScreen({navigation}: Props) {
  const userProfile = useSelector((state: ReduxState) => state.user.profile);
  const products = useSelector((state: ReduxState) => state.products.products);
  const cart = useSelector((state: ReduxState) => state.transactions.cart);

  const dispatch = useDispatch();
  const viewShot = useRef<ViewShot>(null);

  const [orNumber, setORNumber] = useState(generateORNumber());
  const [cash, setCash] = useState({unsafe: '0', safe: '0'});

  const totals: Totals = useMemo(() => {
    let amountDue = 0;
    let vatAmount = 0;
    cart.forEach((i) => {
      const product = products[i.productId];
      amountDue += parseFloat(product.price) * i.quantity;
      vatAmount += parseFloat(product.vat) * i.quantity;
    });
    return {
      amountDue: amountDue.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      vatableSales: (amountDue - vatAmount).toFixed(2),
    };
  }, [cart]);

  const date = moment().format('MM/DD/YYYY');
  const change = (parseFloat(cash.safe) - parseFloat(totals.amountDue)).toFixed(
    2,
  );

  const submittable =
    cart.length > 0 &&
    parseFloat(totals.amountDue) > 0 &&
    parseFloat(cash.safe) > parseFloat(totals.amountDue);

  const handleDiscard = () => {
    setCash({safe: '0', unsafe: '0'});
    setORNumber(generateORNumber());
  };

  const handleSubmit = () => {
    const productsToSubmit: Products = {};
    cart.forEach(
      (i) => (productsToSubmit[i.productId] = products[i.productId]),
    );

    dispatch(
      actions.postReceiptBegin({
        ...totals,
        cash: parseFloat(cash.safe).toFixed(2),
        cart,
        change,
        date,
        orNumber,
        products: productsToSubmit,
      }),
    );

    captureRef(viewShot, {}).then(
      (uri) => {
        navigation.navigate('Receipt', {imageUri: uri});
        handleDiscard();
      },
      (error) => console.error('Snapshot failed', error),
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={styles.action}
          onPress={handleSubmit}
          disabled={!submittable}>
          <MaterialIcons
            name="check"
            color={submittable ? R.colors.malibu : R.colors.mercury}
            size={28}
          />
        </Pressable>
      ),
    });
  }, [navigation, cart, cash.safe, products]);

  if (cart.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <ScrollView style={[styles.fill, {backgroundColor: R.colors.white}]}>
        <ViewShot ref={viewShot}>
          <View style={styles.s1}>
            <Text style={styles.h0}>{userProfile?.storeName}</Text>
            <Text style={styles.h0}>{userProfile?.ownerName}</Text>
            {userProfile?.vatRegTin && (
              <Text style={styles.h0}>{userProfile?.vatRegTin}</Text>
            )}
          </View>

          <View style={[styles.i, {marginTop: 32, marginBottom: 8}]}>
            <View style={styles.fill}>
              <Text style={styles.h1}>OR Number:</Text>
              {userProfile?.cashierName && (
                <Text style={styles.h1}>Cashier:</Text>
              )}
              <Text style={styles.h1}>DATE:</Text>
            </View>
            <View>
              <Text style={styles.iPrice}>{orNumber}</Text>
              {userProfile?.cashierName && (
                <Text style={styles.iPrice}>{userProfile.cashierName}</Text>
              )}
              <Text style={styles.iPrice}>{date}</Text>
            </View>
          </View>

          <View style={styles.lineWrapper}>
            <View style={styles.line} />
          </View>

          {cart.map((i, index) => {
            const product = products[i.productId];
            return (
              <View key={`item-${index}`}>
                <SwipableItem
                  item={i}
                  product={product}
                  onPressDelete={() => {
                    dispatch(actions.cartDel(index));
                  }}
                />
              </View>
            );
          })}

          <View style={styles.lineWrapper}>
            <View style={styles.line} />
          </View>

          {/* COMPUTATION */}
          <View style={[styles.i]}>
            <View style={styles.fill}>
              <Text style={styles.iName}>AMOUNT DUE</Text>
              <Text style={styles.iName}>CASH</Text>
              <Text style={styles.iName}>CHANGE</Text>
            </View>
            <View>
              <Text style={styles.iPrice}>P{totals.amountDue}</Text>
              <Text style={styles.iPrice}>
                P{parseFloat(cash.safe).toFixed(2)}
              </Text>
              <Text style={styles.iPrice}>P{change}</Text>
            </View>
          </View>

          {/* TOTAL */}
          <View style={[styles.i, {marginBottom: 16}]}>
            <View style={styles.fill}>
              <Text style={styles.iName}>VATABLE SALES</Text>
              <Text style={styles.iName}>VAT (12%)</Text>
            </View>
            <View>
              <Text style={styles.iPrice}>{totals.vatableSales}</Text>
              <Text style={styles.iPrice}>{totals.vatAmount}</Text>
            </View>
          </View>
        </ViewShot>
      </ScrollView>
      <View style={styles.cashWrapper}>
        <Text style={styles.cashText}>Cash</Text>
        <TextInputMask
          selectionColor={R.colors.riverBed}
          placeholderTextColor={R.colors.cadetBlue}
          type="money"
          placeholder="P0.00"
          options={{
            precision: 2,
            separator: '.',
            delimiter: ',',
            suffixUnit: '',
            unit: 'P',
          }}
          maxLength={14}
          style={styles.cashInput}
          value={cash.unsafe}
          onChangeText={(t, r) => setCash({safe: r ?? '0', unsafe: t})}
          includeRawValueInChangeText
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  lineWrapper: {height: 1, overflow: 'hidden'},
  action: {height: '100%', justifyContent: 'center', paddingHorizontal: 16},
  line: {
    borderColor: R.colors.riverBed,
    borderTopColor: R.colors.riverBed,
    borderWidth: 2,
    borderRadius: 1,
    borderStyle: 'dashed',
    height: 10,
  },
  s1: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  s2: {marginLeft: 16, marginTop: 16},
  h0: {fontSize: 17, color: R.colors.riverBed},
  h1: {fontSize: 16, color: R.colors.riverBed},
  i: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    color: R.colors.riverBed,
  },
  iName: {fontFamily: R.fonts.bold, fontSize: 16, color: R.colors.riverBed},
  iQuantity: {fontSize: 14, color: R.colors.riverBed},
  iPrice: {fontSize: 16, color: R.colors.riverBed, textAlign: 'right'},
  cashWrapper: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: R.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cashText: {
    textAlign: 'left',
    fontFamily: R.fonts.bold,
    fontSize: 24,
  },
  cashInput: {
    flex: 1,
    fontFamily: R.fonts.bold,
    color: R.colors.riverBed,
    fontSize: 24,
    textAlign: 'right',
  },
});
