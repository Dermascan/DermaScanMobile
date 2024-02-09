import Modal from "react-native-modal";
import React, { useState} from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {Text, View, Image, SafeAreaView, TextInput, Pressable, Dimensions, ScrollView} from 'react-native';
import * as Haptics from 'expo-haptics';
import {manipulateAsync} from 'expo-image-manipulator';
import * as WebBrowser from 'expo-web-browser';

export default function ModalScreen() {
  const windowWidth = Dimensions.get('window').width;
  const [phoneNum, setPhoneNum] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [formattedValue, setFormattedValue] = React.useState('');
  const onChangeText = (inputText) => {
    const formatted = inputText.replace(/\D/g, '');
    setPhoneNum(formatted);
    let formattedWithDashes = '';
    if (formatted.length > 6) {
      formattedWithDashes = `(${formatted.slice(0, 3)}) ${formatted.slice(3, 6)}-${formatted.slice(6)}`;
    } else if (formatted.length > 3) {
      formattedWithDashes = `(${formatted.slice(0, 3)}) ${formatted.slice(3)}`;
    } else if (formatted.length > 0) {
      formattedWithDashes = `(${formatted}`;
    }
  
    //setText(formatted);
    setFormattedValue(formattedWithDashes);
  };
  return (
    <SafeAreaView className="bg-gray-100 h-full relative max-w-[80vw] mx-auto">
      <Pressable onPress={() => router.push({pathname: 'home'})}>
        <Text className={"mx-auto my-4 text-5xl text-gray-400 font-black"}>Derma Scan</Text>
      </Pressable>
      <Text className={" mx-auto my-4 text-3xl text-gray-600 font-bold"}>Sign In</Text>
      <View className={"pt-4 grid gap-4 place-content-center"}>
        <TextInput
          className={" border-blue-500 border-2 rounded-md py-2 px-8 text-2xl "}
          onChangeText={onChangeText}
          value={formattedValue}
          placeholder='Phone Number'
          keyboardType='number-pad'
          textAlign='center'
        />
        <TextInput
          className={" border-blue-500 border-2 rounded-md py-2 px-8 text-2xl "}
          onChangeText={setPassword}
          value={password}
          
          placeholder='Password'
          keyboardType='default'
          textAlign='center'
        />
        <View>
          <Pressable onPress={()=>{router.replace('/home');Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);}} className={"mx-auto bg-blue-500 text-white font-bold py-3 px-8 rounded-full active:bg-blue-700"}>
            <Text className={"m-auto text-2xl text-white font-bold"}>Login</Text>
          </Pressable>
          <Text className={'text-center mt-2'}>
            {"Don't have an account? "}
            <Text className={"text-blue-500"} onPress={() => router.push({pathname: 'login'})}>Sign Up</Text>
          </Text>
        </View>
      </View>
    <Image
        source={{uri: "https://storage.googleapis.com/dermascanmlimages/analytic.png"}}
        style={{ width: .9*windowWidth, height: windowWidth * 0.676 *  0.9, alignSelf: 'center', zIndex: -1, position: 'absolute', bottom: 0}}
        resizeMode="contain"
      />
   </SafeAreaView>
  );
}
