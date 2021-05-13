/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, Text} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
import R from 'res/R';

// Setting up default font
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = {fontFamily: R.fonts.regular};

AppRegistry.registerComponent(appName, () => App);
