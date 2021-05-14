import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack';
import {Button, Input} from 'components';
import R from 'res/R';
import {useDispatch, useSelector} from 'react-redux';
import actions from 'rdx/rootActions';
import {getInProgress, getError} from 'rdx/interactions/selectors';

type Props = {
  navigation: NativeStackNavigationProp<AppNavigation>;
};

export default function RegisterScreen({navigation}: Props) {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');

  const error = useSelector((state: ReduxState) =>
    getError(state, actions.userSignupBegin),
  );

  const inProgress = useSelector((state: ReduxState) =>
    getInProgress(state, actions.userSignupBegin),
  );

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(
      actions.userSignupBegin({
        storeName,
        ownerName,
        email,
        password,
      }),
    );
  };

  const isSubmittable =
    !!storeName &&
    !!ownerName &&
    !!email &&
    !!password &&
    !!repassword &&
    password === repassword;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>POS SIGN UP</Text>
      {error && <Text style={styles.error}>{error.message}</Text>}
      <View style={styles.inputWrapper}>
        <Input
          style={styles.input}
          title="Store Name"
          placeholder="Aleng Nena Store"
          value={storeName}
          onChangeText={(t) => setStoreName(t)}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Input
          style={styles.input}
          title="Owner Name"
          placeholder="Nena Dela Cruz"
          value={ownerName}
          onChangeText={(t) => setOwnerName(t)}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Input
          style={styles.input}
          title="Email"
          placeholder="nenastore@gmail.com"
          value={email}
          onChangeText={(t) => setEmail(t)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Input
          style={styles.input}
          title="Password"
          placeholder="********"
          value={password}
          onChangeText={(t) => setPassword(t)}
          secureTextEntry
        />
      </View>
      <View style={styles.inputWrapper}>
        <Input
          style={styles.input}
          title="Re-enter Password"
          value={repassword}
          onChangeText={(t) => setRepassword(t)}
          placeholder="********"
          info={
            password && repassword && password !== repassword
              ? 'The passwords entered do not match.'
              : undefined
          }
          secureTextEntry
        />
      </View>
      <Text style={styles.footer}>
        Already registered?{' '}
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Go back</Text>
        </TouchableWithoutFeedback>
      </Text>
      <View style={styles.buttonWrapper}>
        <Button
          text="SIGN ME UP"
          style={styles.button}
          onPress={handleSubmit}
          loading={inProgress}
          disabled={!isSubmittable}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: R.fonts.bold,
    color: R.colors.riverBed,
    fontSize: 17,
    marginBottom: 16,
  },
  error: {
    color: R.colors.crimson,
    fontSize: 13,
    marginBottom: 8,
  },
  inputWrapper: {
    marginTop: 8,
  },
  input: {
    width: 240,
  },
  footer: {
    fontSize: 15,
    color: R.colors.riverBed,
    marginTop: 16,
  },
  link: {
    fontFamily: R.fonts.bold,
    color: R.colors.black,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    borderRadius: 0,
    width: '100%',
  },
});
