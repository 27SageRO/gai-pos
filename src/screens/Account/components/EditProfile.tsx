import actions from 'rdx/rootActions';
import React, {memo, useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector, useDispatch} from 'react-redux';
import R from 'res/R';

type Props = {propertyName: 'cashierName' | 'vatRegTin'};

export default memo(
  ({propertyName}: Props) => {
    const userProfile = useSelector((state: ReduxState) => state.user.profile);

    const [content, setContent] = useState('');
    const [reveal, setReveal] = useState(false);

    const dispatch = useDispatch();
    const input = useRef<TextInput>(null);

    const isDisabled = content === '';

    const dismiss = (callback?: () => void) => {
      input.current?.blur();
      setTimeout(() => {
        setReveal(false);
        callback && callback();
      }, 100);
    };

    const handlePressSubmit = () => {
      dismiss(() =>
        dispatch(actions.putUserProfileBegin({[propertyName]: content})),
      );
    };

    const handlePressEdit = () => {
      setContent(userProfile ? userProfile[propertyName] ?? '' : '');
      setReveal(true);
    };

    return (
      <>
        <TouchableWithoutFeedback onPress={handlePressEdit}>
          <Text style={styles.text}>edit</Text>
        </TouchableWithoutFeedback>
        <Modal
          style={styles.container}
          isVisible={reveal}
          animationInTiming={400}
          onModalShow={() => {
            input.current?.focus();
          }}
          onSwipeCancel={() => dismiss()}
          onBackdropPress={() => dismiss()}
          swipeDirection="down"
          useNativeDriverForBackdrop
          useNativeDriver
          avoidKeyboard>
          <ScrollView
            style={styles.inputContainer}
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="always"
            scrollEnabled={false}>
            <View style={styles.line} />
            <TextInput
              ref={input}
              style={styles.input}
              selectionColor={R.colors.malibu}
              placeholderTextColor={R.colors.cadetBlue}
              placeholder="Type here..."
              returnKeyType="next"
              autoCapitalize="sentences"
              onChangeText={(t) => t.length < 100 && setContent(t)}
              autoCorrect={false}
              blurOnSubmit={false}
              value={content}
            />
            <Text style={styles.title}>{content.length}/100</Text>
            <TouchableOpacity
              style={styles.publishButtonPressable}
              onPress={handlePressSubmit}
              disabled={isDisabled}>
              <Text
                style={[
                  styles.publishText,
                  {
                    color: isDisabled ? R.colors.malibuFade : R.colors.malibu,
                  },
                  {fontFamily: isDisabled ? R.fonts.regular : R.fonts.bold},
                ]}>
                Publish
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      </>
    );
  },
  () => true,
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  wrapper: {
    backgroundColor: R.colors.white,
  },
  title: {
    color: R.colors.malibu,
    fontSize: 12,
    marginHorizontal: 15,
    marginBottom: 8,
    marginTop: 4,
  },
  line: {
    width: 70,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: '#E4E4E4',
  },
  inputContainer: {
    flexGrow: 0,
    backgroundColor: R.colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 10,
    paddingBottom: 18,
  },
  input: {
    backgroundColor: R.colors.wildsand,
    color: R.colors.black,
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingLeft: 14,
    paddingRight: 80,
    marginHorizontal: 13,
    marginTop: 10,
    borderRadius: 4,
    maxHeight: 240,
  },
  publishButtonPressable: {
    position: 'absolute',
    right: 0,
    top: Platform.OS === 'ios' ? 12 : 16,
  },
  publishText: {
    marginRight: 12,
    color: R.colors.crimson,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  text: {
    color: R.colors.malibu,
    fontSize: 16,
  },
});
