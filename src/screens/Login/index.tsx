import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Input, Button} from 'components';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack';
import {getInProgress, getError} from 'rdx/interactions/selectors';
import R from 'res/R';
import actions from 'rdx/rootActions';
import {useDispatch, useSelector} from 'react-redux';

type Props = {
  navigation: NativeStackNavigationProp<AppNavigation>;
};

export default function LoginScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const inProgress = useSelector((state: ReduxState) =>
    getInProgress(state, actions.userSigninBegin),
  );

  const error = useSelector((state: ReduxState) =>
    getError(state, actions.userSigninBegin),
  );

  const handleSubmit = () => {
    dispatch(actions.userSigninBegin(email, password));
  };

  const isSubmittable = !!email && !!password;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>POS LOGIN</Text>
      {error && <Text style={styles.error}>{error.message}</Text>}
      <View style={styles.inputWrapper}>
        <Input
          style={styles.input}
          title="Email"
          placeholder="johndoe123@gmail.com"
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
          placeholder="*****"
          value={password}
          onChangeText={(t) => setPassword(t)}
          secureTextEntry
        />
      </View>
      <Text style={styles.footer}>
        Not yet registered?{' '}
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableWithoutFeedback>
      </Text>
      <View style={styles.buttonWrapper}>
        <Button
          text="LET'S GO"
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
