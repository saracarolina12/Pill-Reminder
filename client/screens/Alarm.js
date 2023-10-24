import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Color } from '../util/colors';

export default Alarm = ({ route, navigation }) => {
    const [btnColor, setBtnColor] = useState("#FC709B");
    const[currentDate, setCurrentDate] = useState(new Date());
    useEffect(() => {
        const time = setInterval(() => {
            setCurrentDate(new Date());
        });
        return() => clearInterval(time);
    }, []);
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
            width:210,
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: {
                height: 5,
                width: 5
            },
            alignContent: 'center',
            marginTop:10,
            textAlign: 'center',
            justifyContent:'center',
            textAlignVertical:'center',
            marginBottom:75
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
          <Text style={{ color:'#CB7C96', textAlign:'center', fontFamily:'M1c-Regular', fontSize:40,}}>
                {currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
            <Text style={{color:'#F7A5BF', textAlign:'center',fontFamily:'M1c-Light',fontSize:20,marginBottom:70}}>
                {currentDate.toLocaleDateString([],{weekday:'long', day:'numeric', month:'short'})}
            </Text>
            <View style={styles.circle}>
                <Image
                source={require("../assets/imgs/alarm_pill.png")}
                style={styles.imagen}>
                </Image>
            </View>
            <Text style={{fontFamily: 'M1c-Regular', fontSize: 20, color:'#F7A5BF',textAlign:'center'}}>Paracetamol 20 mg</Text>
            <Pressable
                style={styles.Button}
                onPressIn={() => { 
                    setBtnColor(Color[50]) 
                }} 
                onPressOut={() => { 
                    setBtnColor(Color[40]) 
                }}
            >
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: 'row'}}>
                            <Text style={{fontSize:15,fontFamily:'M1c-Regular', color:'white', textAlign:'center'}} >
                                Posponer (10 minutos)
                            </Text>
                        </View>
            </Pressable>
        <Image source={require("../assets/imgs/left.png")}/> 
        <View style={styles.circle2}/>
        <Image source={require("../assets/imgs/right.png")}/> 
        <Text style={{color:'#A9939A',fontFamily:'M1c-Light',fontSize:13}}>Desliza al tomar tu medicamento</Text>
        </View>
    );
};