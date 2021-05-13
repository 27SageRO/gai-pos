import React, {ReactNode} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import R from 'res/R';

type Props = {
  title: string;
  visible: boolean;
  confirmable?: boolean;
  loading?: boolean;
  content?: string;
  customContent?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onPressConfirm?: () => void;
  onPressCancel?: () => void;
};

export default ({
  title,
  visible,
  confirmable = true,
  loading = false,
  content,
  customContent,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  onPressConfirm,
  onPressCancel,
}: Props) => {
  const handleConfirm = () => {
    if (onPressConfirm) {
      onPressConfirm();
    }
  };

  const handleCancel = () => {
    if (onPressCancel) {
      onPressCancel();
    }
  };

  return (
    <Modal
      isVisible={visible}
      hideModalContentWhileAnimating
      useNativeDriverForBackdrop
      useNativeDriver
      avoidKeyboard>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {content && <Text style={styles.content}>{content}</Text>}
        {customContent && (
          <View style={styles.customContent}>{customContent}</View>
        )}

        <View style={styles.buttons}>
          {loading ? (
            <ActivityIndicator
              style={styles.indicator}
              color="#EC2A3A"
              size="small"
            />
          ) : (
            <>
              {onPressCancel && (
                <Pressable
                  style={{...styles.button, borderRightWidth: 1}}
                  onPress={handleCancel}>
                  <Text style={styles.buttonText}>{cancelText}</Text>
                </Pressable>
              )}
              <Pressable
                style={[
                  styles.button,
                  {
                    width: !onPressCancel ? '100%' : '50%',
                  },
                ]}
                onPress={handleConfirm}
                disabled={!confirmable}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: confirmable
                        ? R.colors.riverBed
                        : R.colors.cadetBlue,
                    },
                  ]}>
                  {confirmText}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: R.colors.white,
    borderRadius: 5,
    shadowColor: R.colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    alignSelf: 'center',
  },
  title: {
    fontFamily: R.fonts.bold,
    fontSize: 16,
    color: R.colors.malibu,
    textAlign: 'center',
    marginTop: 22,
  },
  content: {
    fontSize: 15,
    color: R.colors.riverBed,
    textAlign: 'center',
    marginHorizontal: 25,
    marginTop: 28,
  },
  customContent: {
    marginTop: 28,
  },
  buttons: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginTop: 28,
    borderColor: R.colors.mercury,
    borderTopWidth: 1,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderColor: R.colors.mercury,
  },
  buttonText: {
    color: R.colors.riverBed,
    fontSize: 15,
    fontFamily: R.fonts.bold,
  },
  indicator: {
    height: 50,
  },
});
