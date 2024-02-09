import Modal from "react-native-modal";
import React, { useState} from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {Text, View, Image, SafeAreaView, TextInput, Pressable, Dimensions, ScrollView} from 'react-native';
import * as Haptics from 'expo-haptics';
import {manipulateAsync} from 'expo-image-manipulator';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

export default function ModalScreen() {  
  const windowWidth = Dimensions.get('window').width;
    const [visible, setVisible] = useState(false);
    const [results, setResults] = useState("");
    const [data, setData] = useState([]);
    
    const { _results, _data } = useLocalSearchParams();

    useEffect(() => {
      if (_results) {
        setResults(_results); 
      }
    }, [_results]);
    useEffect(() => {
      if (_data) {
        setData(JSON.parse(_data)); 
      }
    }, [_data]);
    const moreInfo = (
  <Modal isVisible={visible}>
  <View className="bg-gray-100 h-min p-4 rounded-lg">
  <Text className={"mx-auto text-2xl font-bold text-center  "}>Confidence of potential assesments</Text>
  
    <View className={"h-8"} />
    <ScrollView className={"max-h-[60vh] grid grid-cols-3 gap-4"}>
      {data.map((e, i) => {
        return (
          <View key={i} className={"bg-white p-4 rounded-lg"}>
            <Text className={`text-center text-xl font-bold ${e[2] ? "text-red-500": "text-black"}`}>{e[0]}</Text>
            <Text className={"text-center text-xl"}>{Math.round(e[1]*100)}%</Text>
          </View>
        )
      })}
    </ScrollView>
    <Pressable title="" onPress={()=>{setVisible(false);Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);}} className={"mx-auto mt-4 bg-blue-500 text-white font-bold py-3 px-8 rounded-full active:bg-blue-700"}>
      <Text className={"m-auto text-xl text-white font-bold"}>Back</Text>
    </Pressable>
  </View>
  </Modal>
  )
  
    const benign = (<>
        <Text className={"text-3xl font-bold text-center"}>Likely Benign</Text>
        <Text className={"text-lg text-center"}>Our analysis suggests the characteristics in the image or your lesion are likely benign. However, if you notice any additional concerning symptoms, we recommend consulting your primary care physician or a dermatologist for further evaluation.</Text>
        <Pressable title="" onPress={() => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);WebBrowser.openBrowserAsync('https://www.aad.org/public/diseases/skin-cancer/find/at-risk/abcdes');}} className={"mt-4 font-bold py-3 px-8 rounded-full bg-blue-500 text-white active:bg-blue-700"}>
          <Text className={"m-auto text-xl text-white font-bold"}>Identification Resource</Text>
        </Pressable>
        </>
    )
    const potential = (<>
      <Text className={"text-3xl font-bold text-center"}>Potentialy Canerous</Text>
      <Text className={"text-lg text-center"}>Our model has detected characteristics in the image of your lesion that may indicate the presence of cancer. Based on the assessment of these characteristics, we recommend consulting with your primary care physician or a dermatologist for a professional diagnosis.</Text>
      </>
    )
    return (
      <SafeAreaView className="bg-gray-100 h-full   ">
        {moreInfo}
        <Pressable onPress={() => router.push({pathname: 'home'})}>
          <Text className={"mx-auto mt-4 text-5xl text-gray-400 font-black"}>Derma Scan</Text>
        </Pressable>
      <View className={"w-[80vw] h-[100%] mx-auto flex flex-col justify-evenly"}>
        {results == "potential" ? potential : results == "benign" ? benign : <Text className={"mx-auto mt-4 text-5xl text-gray-400 font-black"}>Loading...</Text>}
        <Pressable title="" onPress={() => setVisible(true)} className={" font-bold py-3 px-8 rounded-full bg-blue-500 text-white active:bg-blue-700"}>
          <Text className={"m-auto text-xl text-white font-bold"}>More Info</Text>
        </Pressable>
        <Pressable title="" onPress={() => router.push({pathname: 'home'})} className={" font-bold py-3 px-8 rounded-full bg-blue-500 text-white active:bg-blue-700"}>
          <Text className={"m-auto text-xl text-white font-bold"}>Back Home</Text>
        </Pressable>
        <Image
          source={{uri : "https://storage.googleapis.com/dermascanmlimages/analytic.png"}}
          style={{ width: .8*windowWidth, height: windowWidth * .8 *.9294, alignSelf: 'center', }}
          resizeMode="contain"
        />  
        </View>    
     </SafeAreaView>
    );
}
