import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack';
import {Input, MaterialIcons, Modal} from 'components';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {useDispatch, useSelector} from 'react-redux';
import actions from 'rdx/rootActions';
import R from 'res/R';

type Props = {
  navigation: NativeStackNavigationProp<AppNavigation>;
};

const {width} = Dimensions.get('window');
const size = width - 32;

export default function ScanScreen({navigation}: Props) {
  const [imageUri, setImageUri] = useState<string>();
  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState('1');
  const [discard, setDiscard] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const products = useSelector((state: ReduxState) => state.products.products);

  const dispatch = useDispatch();
  const camera = useRef<RNCamera>(null);
  const captured = useRef(false);

  const handleBarCodeRead = async (e: BarCodeReadEvent) => {
    if (captured.current) {
      return;
    }
    captured.current = true;
    const data = await camera.current?.takePictureAsync({
      quality: 0.5,
      base64: false,
    });
    const productId = `${e.type}:${e.data}`;
    const productDetected = products[productId];
    setImageUri(data?.uri);

    if (!productDetected) setNotFound(true);
    else setProduct(productDetected);
  };

  const handleDiscard = () => {
    captured.current = false;
    setImageUri(undefined);
    setProduct(undefined);
    setQuantity('1');
    setDiscard(false);
    setNotFound(false);
  };

  useEffect(() => {
    dispatch(actions.getProductsBegin());
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={styles.action}
          onPress={() => {
            if (product && product?.firebaseId) {
              dispatch(
                actions.cartAdd({
                  quantity: parseInt(quantity, 10),
                  productId: R.getProductId(product),
                  productFirebaseId: product?.firebaseId,
                }),
              );
            }
            handleDiscard();
          }}>
          <MaterialIcons name="cart-plus" color={R.colors.riverBed} size={28} />
        </Pressable>
      ),
    });
  }, [navigation, product, quantity]);

  return (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={{paddingVertical: 16}}>
      <Text style={styles.title}>Barcode Scanner</Text>
      <View style={styles.camWrapper}>
        {imageUri ? (
          <Image style={styles.cam} source={{uri: imageUri}} />
        ) : (
          <RNCamera
            ref={camera}
            style={styles.cam}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message:
                'We need your permission to use your camera for barcode scan',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message:
                'We need your permission to use your audio for barcode scan',
            }}
            onBarCodeRead={handleBarCodeRead}>
            <BarcodeMask height={180} width={180} edgeRadius={8} />
          </RNCamera>
        )}
      </View>
      <Text style={[styles.title, styles.note]}>
        Note: fields below will be automatically filled when a barcode is
        detected.
      </Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Input
            style={styles.input}
            title="SKU"
            value={product?.sku ?? ''}
            focusable={false}
            editable={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Input
            style={styles.input}
            title="Description"
            value={product?.description ?? ''}
            focusable={false}
            editable={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Input
            style={[styles.inputHalf, {marginRight: 5}]}
            title="Price"
            value={product ? `P${product?.price.toString()}` : ''}
            focusable={false}
            editable={false}
          />
          <Input
            style={[styles.inputHalf, {marginLeft: 5}]}
            title="Quantity"
            value={quantity}
            onChangeText={(t) => setQuantity(t.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
        </View>
        <Pressable style={styles.discard} onPress={() => setDiscard(true)}>
          <Text style={[styles.title, {color: R.colors.malibu}]}>Discard?</Text>
        </Pressable>
        <Modal
          visible={discard}
          title="NOTIFICATION"
          content="Are you sure you want to discard this item?"
          onPressCancel={() => setDiscard(false)}
          onPressConfirm={handleDiscard}
        />
        <Modal
          visible={notFound}
          title="NOTIFICATION"
          content="Can't find this item. Please make sure it exist in your product list."
          onPressConfirm={handleDiscard}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1},
  title: {
    fontFamily: R.fonts.bold,
    fontSize: 13,
    color: R.colors.riverBed,
    marginLeft: 16,
    marginBottom: 4,
  },
  note: {marginTop: 4},
  discard: {marginRight: 16, marginTop: 8, alignSelf: 'flex-end'},
  camWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: size,
    height: size,
    borderRadius: 8,
    marginHorizontal: 16,
    backgroundColor: R.colors.black,
  },
  cam: {height: size, width: size},
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  inputWrapper: {flexDirection: 'row', marginTop: 4},
  input: {width: size},
  inputHalf: {width: size / 2 - 5},
  action: {height: '100%', justifyContent: 'center', paddingHorizontal: 16},
});
