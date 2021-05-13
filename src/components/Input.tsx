import React, {forwardRef} from 'react';
import {TextInput, View, Text, StyleSheet, TextInputProps} from 'react-native';
import R from 'res/R';

type Props = {
  title?: string;
  info?: string;
  backgroundColor?: string;
} & TextInputProps;

export default forwardRef<TextInput, Props>((props, ref) => {
  const {backgroundColor = R.colors.white} = props;

  return (
    <View>
      {props.title && <Text style={styles.title}>{props.title}</Text>}
      <TextInput
        ref={ref}
        selectionColor={R.colors.riverBed}
        placeholderTextColor={R.colors.cadetBlue}
        {...props}
        style={[styles.input, props.style, {backgroundColor}]}
      />
      {props.info && <Text style={styles.info}>{props.info}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    fontFamily: R.fonts.regular,
    backgroundColor: R.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: R.colors.riverBed,
    borderRadius: 4,
    fontSize: 17,
  },
  title: {
    fontFamily: R.fonts.bold,
    fontSize: 12,
    color: R.colors.riverBed,
    marginLeft: 4,
    marginBottom: 4,
  },
  info: {
    fontSize: 11,
    color: R.colors.riverBed,
    marginLeft: 4,
    marginTop: 2,
  },
});
