import Modal from "react-native-modal";
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import * as ImagePicker from 'expo-image-picker';
import {Text, View, Image, SafeAreaView, TextInput, Pressable, Dimensions, ScrollView} from 'react-native';
import * as Haptics from 'expo-haptics';
import {manipulateAsync} from 'expo-image-manipulator';
import * as WebBrowser from 'expo-web-browser';

export default function ModalScreen() {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const windowWidth = Dimensions.get('window').width;

  const [things, setResults] = useState([]);

  const { persistResults } = useLocalSearchParams();

  useEffect(() => {
    console.log(persistResults);
    if (persistResults) {
      setResults(JSON.parse(persistResults)); 
    }
  }, [persistResults]);
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const pickImage = async (type) => {
    //check if camera
    if(status.granted){
      let result = type == "cam" ? await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      }) : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!result.canceled) {
        setVisible(false);
        setImage(result.assets[0].uri)
        setUploading(true);
      }
    }else{
      //setVisible(false);
      if(type == "cam"){
        ImagePicker.requestCameraPermissionsAsync()
      } else {
        ImagePicker.requestMediaLibraryPermissionsAsync()
      }
    }
  };

  const send = async ()=>{
    setLoading(true);
    const base64 = await manipulateAsync(image, [], {base64: true}).then((result) => {
      return result.base64;
    });
    var requestOptions = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"image": base64}),
      redirect: 'follow'
    };

    let diag = await fetch("https://us-central1-mlderma.cloudfunctions.net/httpsflaskexample", requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));
    
    classes = {
      0: ['akiec', 'actinic keratoses and intraepithelial carcinomae', true],
      1: ['bcc', 'basal cell carcinoma', true],
      2: ['bkl', 'benign keratosis-like lesions', false],
      3: ['df', 'dermatofibroma',false],
      4: ['nv', 'melanocytic nevi', false],
      5: ['vasc', 'pyogenic granulomas and hemorrhage', false],
      6: ['mel', 'melanoma', true],
    }
    let confidences = diag[0].map((e, i) => {
      return [classes[i][1], e, classes[i][2]];
    })
    let sortedConfidences = confidences.sort((a, b) => b[1] - a[1]);
    
  
   //const sortedConfidences = [["melanocytic nevi", 0.8867464661598206, false], ["melanoma", 0.07754587382078171, true], ["benign keratosis-like lesions", 0.019011573866009712, false], ["basal cell carcinoma", 0.00770825007930398, true], ["actinic keratoses and intraepithelial carcinomae", 0.0036374754272401333, true], ["pyogenic granulomas and hemorrhage", 0.002787025412544608, false], ["dermatofibroma", 0.002563401125371456, false]]
  
    setResults([...things, {data: sortedConfidences, dateTime: new Date()}]);
    setUploading(false);
    setLoading(false);
    if(sortedConfidences[0][2]){
      router.push({
        pathname: 'results',
        params: { _results: "potential", _data: JSON.stringify(sortedConfidences), _persistResults: JSON.stringify([...things, {data: sortedConfidences, dateTime: new Date()}]) }
      });
    }else{
      router.push({
        pathname: 'results',
        params: { _results: "benign", _data: JSON.stringify(sortedConfidences), _persistResults: JSON.stringify([...things, {data: sortedConfidences, dateTime: new Date()}]) }
      });
    }

  }
    const upload = (
      <SafeAreaView className="bg-gray-100 h-full relative ">
        
        <Pressable onPress={() => {setUploading(false); setLoading(false);}}>
          <Text className={"mx-auto mt-4 text-5xl text-gray-400 font-black"}>Derma Scan</Text>
        </Pressable>
      {loading ? <Text className={"mx-auto text-3xl text-center"}>Loading...</Text> : 
    <View className={"w-[80vw] mx-auto"}>
      <View className=" font-bold py-2 px-2 rounded-lg bg-blue-500 text-white">
      <Text className={"text-center text-md text-white font-bold"}>Ensure the lesion encompasses the entire frame</Text>
      </View>
        <Image className={"mx-auto aspect-square my-4 rounded-md max-w-[70vw] max-h-[70vw]"} source={{uri: image}} />
      <Pressable title="" onPress={()=>{send();Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);}} className={" font-bold py-3 px-8 rounded-full bg-blue-500 text-white active:bg-blue-700"}>
        <Text className={"m-auto text-2xl text-white font-bold"}>Send out for Analysis</Text>
      </Pressable>
      <Text className={'text-center mt-2'}>
        {"By pressing the above button you agree to "}
      
        <Text className={"text-blue-500"} onPress={() => router.push({pathname: 'home'})}>Terms and Conditions</Text>
      </Text>
    </View>}
  
        <Image
          source={{uri:"i"}}
          style={{ width: .8*windowWidth, height: windowWidth * .8 *.9294, alignSelf: 'center', zIndex: -1, position: 'absolute', bottom: 0}}
          resizeMode="contain"
        />      
     </SafeAreaView>
  )
  function resultView(sorteddata){
    if(sorteddata[0][2]){
      router.push({
        pathname: 'results',
        query: { _results: "potential", _data: JSON.stringify(sorteddata), _persistResults: JSON.stringify(things) }
      }); 
    }else{
      router.push({
        pathname: 'results',
        params: { _results: "benign", _data: JSON.stringify(sorteddata), _persistResults: JSON.stringify(things) }
      });
    }
  }
  const homescreen = (
    <View className={"bg-gray-100 "}>
    <SafeAreaView className="bg-gray-100 h-full relative ">
      <Modal isVisible={visible}>
        <View className="bg-gray-100 h-min p-4 rounded-lg">
          <Text className={"mx-auto text-xl text-center "}>For best accuracy, use good lighting, ensure the image is <Text className={'font-bold'}>in focus</Text>, and after taking the photo, <Text className={'font-bold'}>crop it</Text> to fully encompass the lesion within the entire frame.</Text>
          <View className={"h-8"} />
          <Pressable
          className={"mx-auto bg-blue-500 text-white font-bold py-3 px-8 rounded-full active:bg-blue-700"}  onPress={()=>{pickImage("cam");Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);}}
          >
            <Text
            className={"m-auto text-2xl text-white font-bold"}
            >Continue with Camera</Text>
          </Pressable>
          <Pressable
          className={"mx-auto bg-blue-500 mt-4 text-white font-bold py-3 px-8 rounded-full active:bg-blue-700"}  onPress={()=>{pickImage("lib");Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);}}
          >
            <Text
            className={"m-auto text-2xl text-white font-bold"}
            >Continue with library</Text>
          </Pressable>
          <Pressable onPress={()=>{setVisible(false);Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);}} className={"mt-4"}>
            <Text className={"text-center text-blue-500 text-lg"}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
      <Pressable onPress={() => router.push({pathname: 'home'})}>
        <Text className={"mx-auto mt-4 text-5xl text-gray-400 font-black"}>Derma Scan</Text>
      </Pressable>

      <View className={"w-[80vw] h-[70%] m-auto"}>
        <Pressable onPress={()=>{setVisible(true);Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);}} className={" bg-blue-500 text-white font-bold py-3 px-8 rounded-full active:bg-blue-700"}>
          <Text className={"m-auto text-2xl text-white font-bold"}>Start Scan</Text>
        </Pressable>
        <Pressable onPress={()=>{router.push({pathname: '/'});Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);}} className={"mt-2"}>
              <Text className={"text-center text-blue-500 text-lg"}>Logout</Text>
        </Pressable>

        <View className="mt-4 mx-auto w-full">
          <Text className={
            "text-3xl text-center font-bold"
          } >Previous Results</Text>
          <View className={"h-4"} />
          <ScrollView className={" mx-auto w-full max-h-[40vh] overflow-hidden grid grid-cols-1 gap-2"}>
            {things.length > 0 ? things.map((e, i) => {
              const datestr = new Date(e.dateTime).toLocaleDateString() + " " + new Date(e.dateTime).toLocaleTimeString( 
                'en-US', { hour: 'numeric', minute: 'numeric', hour12: true }
              );
              return (
                <Pressable key={i} className={"bg-white p-2 rounded-xl active:bg-gray-200"} 
                 onPress={()=>{resultView(e.data);Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);}}
                >
                  <Text className={"text-center text-lg font-bold"}>{datestr}</Text>
                  <Text className={"text-center text-lg capitalize"}>{e.data[0][0]} {(Math.round(e.data[0][1]*100))}%</Text>
                </Pressable>
              )
            }): <Text className={"mx-auto w-full text-center  text-lg"}>No previous results</Text>}
            </ScrollView>
        </View>
        
    </View>
    <Image
        source={{uri: "https://storage.googleapis.com/dermascanmlimages/analytic.png"}}
        style={{ width: .9*windowWidth, height: windowWidth * 0.676 *  0.9, alignSelf: 'center', zIndex: -1, position: 'absolute', bottom: 0}}
        resizeMode="contain"
      />
   </SafeAreaView>
    </View>
  );
  return (<>{!uploading ? homescreen : upload }</>);
}
