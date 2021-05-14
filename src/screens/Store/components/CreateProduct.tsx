import React, {memo, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Input, InputMask, MaterialIcons, Modal} from 'components';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {useDispatch, useSelector} from 'react-redux';
import {getError, getInProgress} from 'rdx/interactions/selectors';
import actions from 'rdx/rootActions';
import BarcodeMask from 'react-native-barcode-mask';
import R from 'res/R';

const empty: Product = {
  description: '',
  sku: '',
  price: '',
  vat: '',
  srp: '',
  barcode: '',
  barcodeType: '',
};

export default memo(
  () => {
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [imageUri, setImageUri] = useState<string>();

    // unsafe data
    const [product, setProduct] = useState<Product>(empty);

    // safe data
    const [rawProduct, setRawProduct] = useState<Product>(empty);

    const products = useSelector(
      (state: ReduxState) => state.products.products,
    );

    const inProgress = useSelector((state: ReduxState) =>
      getInProgress(state, actions.postProductBegin),
    );

    const error = useSelector((state: ReduxState) =>
      getError(state, actions.postProductBegin),
    );

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const camera = useRef<RNCamera>(null);
    const captured = useRef(false);
    const productsRef = useRef(products);

    const takePicture = async () => {
      const data = await camera.current?.takePictureAsync({
        quality: 0.5,
        base64: false,
      });
      setImageUri(data?.uri);
    };

    const handleBarCodeRead = (e: BarCodeReadEvent) => {
      if (captured.current) {
        return;
      }
      captured.current = true;
      takePicture();
      setRawProduct({...rawProduct, barcode: e.data, barcodeType: e.type});
    };

    const handleConfirm = () => {
      // We used the safe data
      // for database
      dispatch(actions.postProductBegin(rawProduct));
    };

    const handleDismiss = () => {
      captured.current = false;
      setErrorMessage(undefined);
      setProduct(empty);
      setRawProduct(empty);
      setImageUri(undefined);
      setVisible(false);
    };

    // An effect for success
    useEffect(() => {
      if (products !== productsRef.current) {
        handleDismiss();
      }
    }, [products]);

    // An effect for error
    useEffect(() => {
      if (error) setErrorMessage(error.message);
    }, [error]);

    // A layout effect for
    // the action button
    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Pressable style={styles.action} onPress={() => setVisible(true)}>
            <MaterialIcons
              name="playlist-plus"
              color={R.colors.riverBed}
              size={28}
            />
          </Pressable>
        ),
      });
    }, [navigation]);

    const unConfirmable =
      !rawProduct.sku ||
      !rawProduct.description ||
      !rawProduct.price ||
      !rawProduct.srp ||
      !rawProduct.barcode ||
      !rawProduct.description;

    return (
      <Modal
        visible={visible}
        title="Create Product"
        content="Place here all the information of your product. All fields are required."
        confirmable={!unConfirmable}
        loading={inProgress}
        customContent={
          <>
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            <View style={styles.wrapper}>
              <Input
                style={styles.input}
                title="SKU*"
                placeholder="KS944RUR"
                backgroundColor={R.colors.wildsand}
                value={product.sku}
                onChangeText={(t) => {
                  setProduct({...product, sku: t});
                  setRawProduct({...rawProduct, sku: t});
                }}
              />
            </View>
            <View style={styles.wrapper}>
              <Input
                style={styles.input}
                title="DESCRIPTION*"
                placeholder="Wine 500ml"
                backgroundColor={R.colors.wildsand}
                value={product.description}
                onChangeText={(t) => {
                  setProduct({...product, description: t});
                  setRawProduct({...rawProduct, description: t});
                }}
              />
            </View>
            <View style={styles.wrapper}>
              <InputMask
                style={[styles.inputHalf, {marginRight: 5}]}
                title="PRICE*"
                backgroundColor={R.colors.wildsand}
                placeholder="P500.00"
                type="money"
                value={product.price}
                options={{
                  precision: 2,
                  separator: '.',
                  delimiter: ',',
                  suffixUnit: '',
                  unit: 'P',
                }}
                onChangeText={(t, r) => {
                  setProduct({...product, price: t});
                  r &&
                    setRawProduct({
                      ...rawProduct,
                      price: parseFloat(r).toFixed(2),
                      vat: (parseFloat(r) * 0.12).toFixed(2).toString(),
                    });
                }}
                info={`VAT: P${rawProduct.vat ?? 0}`}
                includeRawValueInChangeText
              />
              <InputMask
                style={[styles.inputHalf, {marginLeft: 5}]}
                title="SRP*"
                placeholder="P480.00"
                backgroundColor={R.colors.wildsand}
                type="money"
                options={{
                  precision: 2,
                  separator: '.',
                  delimiter: ',',
                  suffixUnit: '',
                  unit: 'P',
                }}
                value={product.srp}
                onChangeText={(t, r) => {
                  setProduct({...product, srp: t});
                  r &&
                    setRawProduct({
                      ...rawProduct,
                      srp: parseFloat(r).toFixed(2),
                    });
                }}
                includeRawValueInChangeText
              />
            </View>
            <View style={styles.wrapper}>
              <View style={styles.camWrapper}>
                {imageUri ? (
                  <Image style={styles.image} source={{uri: imageUri}} />
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
                    <BarcodeMask
                      height={120}
                      width={180}
                      edgeRadius={8}
                      backgroundColor="transparent"
                    />
                  </RNCamera>
                )}
              </View>
            </View>
          </>
        }
        onPressConfirm={handleConfirm}
        onPressCancel={handleDismiss}
      />
    );
  },
  () => true,
);

const styles = StyleSheet.create({
  action: {height: '100%', justifyContent: 'center', paddingHorizontal: 16},
  error: {
    alignSelf: 'center',
    color: R.colors.crimson,
    fontSize: 13,
    marginBottom: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 8,
  },
  input: {width: 240},
  inputHalf: {width: 115},
  camWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: 240,
    height: 150,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: R.colors.black,
  },
  image: {height: 150, width: 240},
  cam: {height: 150, width: 240},
});
