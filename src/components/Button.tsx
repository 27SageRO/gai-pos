import React from 'react';
import {
  StyleSheet,
  Pressable,
  PressableProps,
  Text,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import R from 'res/R';

type Props = {
  text: string;
  style?: ViewStyle;
  loading?: boolean;
} & PressableProps;

export default (props: Props) => {
  const {loading} = props;
  return (
    <Pressable
      {...props}
      style={[
        styles.button,
        {
          backgroundColor: props.disabled
            ? R.colors.cadetBlue
            : R.colors.malibu,
        },
        props.style,
      ]}>
      {loading && <ActivityIndicator color={R.colors.white} size={20} />}
      <Text style={styles.text}>{loading ? ' ' : props.text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    fontSize: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: R.fonts.bold,
    color: R.colors.white,
    fontSize: 17,
  },
});
