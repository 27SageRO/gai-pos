import React from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import R from 'res/R';

type Props = {
  item: CartItem;
  product: Product;
  onPressDelete: () => void;
};

export default ({item, product, onPressDelete}: Props) => {
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    _dragAnimatedValue: Animated.AnimatedInterpolation,
  ) => (
    <View
      style={{
        width: 120,
        flexDirection: 'row',
      }}>
      <Animated.View
        style={{
          flex: 1,
          transform: [
            {
              translateX: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [64, 0],
              }),
            },
          ],
        }}>
        <RectButton
          style={[styles.rightAction, {backgroundColor: R.colors.crimson}]}
          onPress={onPressDelete}>
          <Text style={styles.actionText}>REMOVE</Text>
        </RectButton>
      </Animated.View>
    </View>
  );

  return (
    <Swipeable
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={renderRightActions}
      enableTrackpadTwoFingerGesture>
      <View style={styles.i}>
        <View style={styles.fill}>
          <Text style={styles.iName}>{product.description}</Text>
          <Text style={styles.iQuantity}>
            {item.quantity} @ {product.price}
          </Text>
        </View>
        <Text style={styles.iPrice}>
          {(parseFloat(product.price) * item.quantity).toFixed(2)}
        </Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  fill: {flex: 1},
  swipeable: {marginTop: 8},
  i: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: R.colors.riverBed,
    backgroundColor: R.colors.white,
  },
  iName: {fontFamily: R.fonts.bold, fontSize: 16, color: R.colors.riverBed},
  iQuantity: {fontSize: 14, color: R.colors.riverBed},
  iPrice: {fontSize: 16, color: R.colors.riverBed, textAlign: 'right'},
  actionText: {
    color: R.colors.white,
    fontSize: 16,
    backgroundColor: R.colors.transparent,
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
