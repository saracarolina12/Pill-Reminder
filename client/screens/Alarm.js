import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Color } from '../util/colors';
import { RFValue } from "react-native-responsive-fontsize";
import { useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';

export default Alarm = ({ navigation }) => {
    const route = useRoute();
    const [btnColor, setBtnColor] = useState("#FC709B");
    const [descartarBtnColor, setDescartarBtnColor] = useState("#FC709B");
    const[currentDate, setCurrentDate] = useState(new Date());
    const [sound, setSound] = React.useState();
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(()=>{
        playSound();
    },[])

    useEffect(() => {
        const time = setInterval(() => {
            setCurrentDate(new Date());
        });
        return() => clearInterval(time);
    }, []);

    const playSound = async () => {
        if(!isPlaying){
            setIsPlaying(true);
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(require("../assets/sound/Ringtone.mp3"));
            setSound(sound);

            console.log('Playing Sound');
            await sound.playAsync();
        }
    };

    const stopSound = async () => {
        try {
            if (sound) {
                await sound.stopAsync();
                setIsPlaying(false);
            }
        } catch (error) {
            console.error('Error al detener el sonido:', error);
        }
    };
    

    useEffect(() => {
        return () => {
            if (sound) {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const styles = StyleSheet.create({
        container: {
            flex:1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:"white",
            marginTop:20
        },
        circle: {
            width: 131, 
            height: 131, 
            borderRadius: 131,
            backgroundColor: '#FFC3C3',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
        },
        imagen: {
            alignContent:'center',
        },
        Button:{
            backgroundColor: btnColor, 
            transform: btnColor === Color[912]? [{translateY: 0}]: [{translateY: 2}] ,
            textAlign:'center', 
            padding: 10,
            borderRadius:30 ,
            justifyContent: 'center',
            alignItems: 'center',
            elevation:10,
            shadowColor: "#000",
            width:RFValue(210),
            height: RFValue(50),
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: {
                height: 5,
                width: 5
            },
            alignContent: 'center',
            marginTop:RFValue(15),
            textAlign: 'center',
            justifyContent:'center',
            textAlignVertical:'center',
            marginBottom:75
        },
        DescartarBtn:{
            backgroundColor: descartarBtnColor, 
            transform: descartarBtnColor === Color[912]? [{translateY: 0}]: [{translateY: 2}] ,
            textAlign:'center', 
            padding: 10,
            borderRadius:30 ,
            justifyContent: 'center',
            alignItems: 'center',
            elevation:10,
            shadowColor: "#000",
            width:RFValue(150),
            height: RFValue(50),
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: {
                height: 5,
                width: 5
            },
            alignContent: 'center',
            marginTop:RFValue(40),
            textAlign: 'center',
            justifyContent:'center',
            textAlignVertical:'center',
            // marginBottom:75
        },
        circle2: {
            width: 85, 
            height: 85, 
            borderRadius: 85,
            borderWidth:2,
            borderColor:'#FC709B',
            backgroundColor:'#FAF3F5',
            marginBottom: 10,
            
        },
        imagestyle:{
            flexDirection:'row',
        }
        
    })

    return (
        <View style={styles.container}>
            <Text style={{ color:'#CB7C96', textAlign:'center', fontFamily:'M1c-Regular', fontSize:RFValue(50),}}>
                {/* {currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} */}
                {`${String(route.params.hour).padStart(2, '0')}:${String(route.params.minutes).padStart(2, '0')}`}
            </Text>
            <Text style={{color:'#F7A5BF', textAlign:'center',fontFamily:'M1c-Light',fontSize:RFValue(22),marginBottom:70}}>
                {currentDate.toLocaleDateString([],{weekday:'long', day:'numeric', month:'short'})}
            </Text>
            <View style={styles.circle}>
                <Image
                source={require("../assets/imgs/alarm_pill.png")}
                style={styles.imagen}>
                </Image>
            </View>
            <Text style={{fontFamily: 'M1c-Regular', fontSize: 20, color:'#F7A5BF',textAlign:'center'}}>Paracetamol 20 mg</Text>
            {/* <Pressable
                style={styles.Button}
                onPressIn={() => { 
                    setBtnColor(Color[50]) 
                }} 
                onPressOut={() => { 
                    setBtnColor(Color[40]) 
                }}
            >
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row'}}>
                            <Text style={{fontSize:RFValue(17),fontFamily:'M1c-Regular', color:'white', textAlign:'center'}} >
                                Posponer (10 minutos)
                            </Text>
                        </View>
            </Pressable> */}
        {/* <Image source={require("../assets/imgs/left.png")}/> 
        <View style={styles.circle2}/>
        <Image source={require("../assets/imgs/right.png")}/>  */}
        {/* <Text style={{color:'#A9939A',fontFamily:'M1c-Light',fontSize:13}}>Desliza al tomar tu medicamento</Text> */}
            <Pressable
                style={styles.DescartarBtn}
                onPressIn={() => { 
                    setDescartarBtnColor(Color[50]) 
                }} 
                onPressOut={() => { 
                    //TODO: agregar lógica para desactivar la alarma
                    stopSound();
                    setDescartarBtnColor(Color[40]) 
                    navigation.navigate('Main'); //TODO: navigate to last screen
                    // navigation.popToTop(); //TODO: al parecer se estanca en Login.js
                }}
            >
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row'}}>
                            <Text style={{fontSize:RFValue(20),fontFamily:'M1c-Regular', color:'white', textAlign:'center'}} >
                                Descartar
                            </Text>
                        </View>
            </Pressable>
        </View>
    );
};
