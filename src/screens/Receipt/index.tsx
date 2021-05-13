import React, {useLayoutEffect} from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack';
import {RouteProp} from '@react-navigation/core';
import AutoHeightImage from 'react-native-auto-height-image';
import {ScrollView} from 'react-native-gesture-handler';
import RNImageToPdf from 'react-native-image-to-pdf';
import RNPrint from 'react-native-print';
import {MaterialIcons} from 'components';
import R from 'res/R';

type Props = {
  navigation: NativeStackNavigationProp<AppNavigation>;
  route: RouteProp<AppNavigation, 'Receipt'>;
};

const {width} = Dimensions.get('window');
const size = width - 32;

export default function ReceiptScreen({navigation, route}: Props) {
  const {imageUri} = route.params;

  const handlePrint = async () => {
    try {
      const pdfResult = await RNImageToPdf.createPDFbyImages({
        imagePaths: [imageUri.replace('file://', '')],
        name: 'printable.pdf',
      });
      await RNPrint.print({filePath: pdfResult.filePath});
    } catch (e) {
      console.log('error printing', e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable style={styles.action} onPress={handlePrint}>
          <MaterialIcons name="printer" color={R.colors.riverBed} size={28} />
        </Pressable>
      ),
    });
  }, [navigation, imageUri]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AutoHeightImage
          style={styles.image}
          source={{uri: imageUri}}
          width={size}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scroll: {flexGrow: 1, justifyContent: 'center'},
  image: {
    marginHorizontal: 16,
    backgroundColor: R.colors.white,
    borderRadius: 4,
  },
  action: {height: '100%', justifyContent: 'center', paddingHorizontal: 16},
});
