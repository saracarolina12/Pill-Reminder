import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid, SafeAreaView, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors'
import NextAlarm from '../components/nextAlarm';

export default Main = ({ route, navigation }) => {
    const [btnColor, setBtnColor] = useState("#FC709B");
    const [day, setDay] = useState(new Date().getDate());
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [pills, setPills] = useState();

    const endpooooooooooooooooooooint = "http://dapp.enlacenet.net:8532/"; // TODO: Add An env? 

    useEffect(() => {
        // Replace with your API endpoint
        fetch(endpooooooooooooooooooooint + 'getPills')
          .then((response) => response.json())
          .then((result) => {
            setLoading(false);
            setPills(result);
            console.log(result);
          })
          .catch((error) => {
            console.error('API request error', error);
            setLoading(false);
          });
      }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:"white",
            marginTop:20
        },
        scrollView: {
            // backgroundColor: 'pink',
            maxHeight:"57%",
            width:"100%",
            marginBottom:15,
            width:"90%"
        },
        text: {
            fontSize: 15,
        },
        circleContainer: {
            width: 50, 
            height: 50,
            borderRadius: 25, 
            // backgroundColor: '#FC709B', // Color del círculo
            backgroundColor: btnColor,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    const meses = {
        1: "enero",
        2: "febrero",
        3: "marzo",
        4: "abril",
        5: "mayo",
        6: "junio",
        7: "julio",
        8: "agosto",
        9: "septiembre",
        10: "octubre",
        11: "noviembre",
        12: "diciembre"
    }
    
    useEffect(()=>{
        // console.log(day, , year);
    }, [day, month, year])
    
    return (
        <View style={styles.container}>

            <Text style={{ fontFamily: 'M1c-Bold', fontSize: 35, color:"#DA5D74", marginBottom:5 }}>Siguientes tomas</Text>

            <View style={{alignItems:'center', textAlign:'center', justifyContent:'center', backgroundColor:'#FCEEF1', padding:10, borderRadius:15, width:"80%", margin:10, marginBottom:15}}>
                <Text style={{ fontFamily: 'M1c-Medium', fontSize: 25, color:"#CB7C96"  }}>Hoy</Text>
                <Text style={{ fontFamily: 'M1c-Regular', fontSize: 17, color:"#EA89A7" }}>{day} {meses[month+1]} {year}</Text>
            </View>

            {/*
            <ScrollView style={styles.scrollView}>
                    <NextAlarm url={require("../assets/imgs/pill_0.png")} pill={"Paracetamol"} amount={"20 mg"} hour={"6:00"}/>
                    <NextAlarm url={require("../assets/imgs/pill_1.png")} pill={"Ramipril"} amount={"20 mg"} hour={"10:00"}/>
                    <NextAlarm url={require("../assets/imgs/pill_2.png")} pill={"Aspirina"} amount={"20 mg"} hour={"13:10"}/>
                    <NextAlarm url={require("../assets/imgs/pill_3.png")} pill={"Lexotiroxina sódica"} amount={"20 mg"} hour={"20:05"}/>
                    <NextAlarm url={require("../assets/imgs/pill_4.png")} pill={"Omeprazol"} amount={"20 mg"} hour={"22:40"}/>
            </ScrollView>
            */} 

            {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
            ) : (
            <ScrollView style={styles.scrollView}>
                {
                    pills?.length > 0 &&
                    pills.map((alarm, index) => (
                        <NextAlarm
                          key={index}
                          url={require("../assets/imgs/pill_0.png")} // TODO: Load a random image
                          pill={alarm.name}
                          amount={alarm.dose + " " + alarm.dose_unit}
                          hour={"10:00"} // TODO: Calculate next hour
                        />
                      ))
                }
            </ScrollView>
            )}
            <Pressable 
                style={styles.circleContainer}
                onPressIn={() => { setBtnColor('#CC597C') }}
                onPressOut={() => { setBtnColor('#FC709B') }}
            >
                <Text style={{ fontFamily: 'M1c-Bold', fontSize: 35, color: 'white', textAlign: 'center', lineHeight: 43 }}>+</Text>
            </Pressable>

            
        </View>
    );
};

