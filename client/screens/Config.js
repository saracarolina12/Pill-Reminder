import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';


const endpooooooooooooooooooooint = "http://dapp.enlacenet.net:8532/"; // TODO: Add An env? 

LocaleConfig.locales['fr'] = {
    monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ],
    monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sept.', 'Oct.', 'Nov.', 'Dic.'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
    today: "Hoy"
};

LocaleConfig.defaultLocale = 'fr';


export default Config = ({ route, navigation }) => {
    const [cancelBtnColor, setCancelBtnColor] = useState("#FC7070");
    const [OKBtnColor, setOKBtnColor] = useState("#8CD19E");
    const [medicine, onChangeMedicine] = useState("");
    const [dosis, onChangeDosis] = useState("");
    const [unidad, onChangeUnidad] = useState("");
    const [hoursMedicine, onChangeHoursMedicine] = useState("");

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate();

    const initialSelectedDates = {}; // Inicialmente, ninguna fecha está seleccionada

    const getMarked = () => {
        let marked = {};
        const endDate = new Date(year + 10, 11, 31); 
        let currentDate = new Date(year, month - 1, day);
        while (currentDate <= endDate) {
            const nextYear = currentDate.getFullYear();
            const nextMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const nextDay = currentDate.getDate().toString().padStart(2, '0');
            const dateStr = `${nextYear}-${nextMonth}-${nextDay}`;
            
            marked[dateStr] = {
                startingDay: false,
                endingDay: false,
                color: selectedDates[dateStr] ? '#FFC9DA' : 'white',
                textColor: '#444444',
                disabled: false,
            };

            // Incrementar la fecha en 1 día
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return marked;
    };

    const [selectedDates, setSelectedDates] = useState(initialSelectedDates);

    const handleDayPress = (day) => {
        const date = new Date();
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        const todayString = `${y}-${m}-${d}`;

        const today = new Date(todayString), selected = new Date(day.dateString);
        if(selected < today) return;
        const dateStr = day.dateString;
        const newSelectedDates = { ...selectedDates };
        newSelectedDates[dateStr] = !newSelectedDates[dateStr];
        console.log(newSelectedDates);
        setSelectedDates(newSelectedDates);
    };

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
            backgroundColor: cancelBtnColor,
            justifyContent: 'center',
            alignItems: 'center',
        },
        circleCancelContainer: {
            marginTop:15,
            width: 50, 
            height: 50,
            borderRadius: 25, 
            backgroundColor: cancelBtnColor,
            justifyContent: 'center',
            alignItems: 'center',
        },
        circleOKContainer: {
            marginTop:15,
            width: 50, 
            height: 50,
            borderRadius: 25, 
            backgroundColor: OKBtnColor,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonContainer: {
            flexDirection: 'row', // Esto coloca los elementos en una fila
            justifyContent: 'space-between', // Esto distribuye los elementos de manera uniforme en la fila
            alignItems: 'center', // Esto alinea los elementos verticalmente en el centro
        },
        fieldsContainer:{
            flexDirection: 'row', // Esto coloca los elementos en una fila
            justifyContent: 'space-between', // Esto distribuye los elementos de manera uniforme en la fila
            alignItems: 'center', // Esto alinea los elementos verticalmente en el centro
        }
    });

    const meses = {
        "01": "enero",
        "02": "febrero",
        "03": "marzo",
        "04": "abril",
        "05": "mayo",
        "06": "junio",
        "07": "julio",
        "08": "agosto",
        "09": "septiembre",
        10: "octubre",
        11: "noviembre",
        12: "diciembre"
    }
    
    useEffect(()=>{
        console.log(day, meses[month] , year);
    }, [day, month, year])

    const handleOkPress = () => {
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');

        const trueDates = Object.keys(selectedDates).filter((date) => selectedDates[date]);
  
        if (trueDates.length === 0) {
            console.log("No dates where selected"); // TODO: Add notif
            return null;
        }
        trueDates.sort();
        const firstDate = `${trueDates[0]} ${hours}:${minutes}:00`;
        const lastDate = `${trueDates[trueDates.length - 1]} 23:59:59`;

        if(!medicine || !firstDate || !lastDate || !hoursMedicine || !dosis || !unidad){
            console.log("Form is not complete"); // TODO: Add notif
            return;
        }

        const data = {
            name: medicine,
            start: firstDate,
            end: lastDate,  
            frequency: parseInt(hoursMedicine),
            dose: dosis,
            dose_unit: unidad,
        };

        axios.post(endpooooooooooooooooooooint + 'newPill', data) //TODO: ADD GLOBAL ENDPOINT
        .then((response) => {
            console.log('Data sent successfully:', data);
            navigation.navigate('Main');
        })
        .catch((error) => {
            console.error('Error sending data:', error);
        });
    };

    return (
        <View style={styles.container}>

            <Text style={{ fontFamily: 'M1c-Bold', fontSize: 30, color:"#DA5D74", marginBottom:15 }}>Nueva alarma</Text>

            <Image
                    source={require("../assets/imgs/clock.png")}
                    style={{marginBottom:8, width: 70, height: 70, marginTop:0}}
            />
            <View style={{width:'80%'}}>
                <Text style={{ fontFamily: 'M1c-Regular', fontSize: 18, color:"black", marginBottom:0, textAlign:'left', color:"#EA889A" }}>Nombre del medicamento</Text>
                <View style={{backgroundColor:'#E9E9E9',padding:10, color:'#A9A9A9', borderRadius:10, width:'100%', marginBottom: 10}}>
                        <TextInput
                            style={{color:'#808080', fontFamily: "M1c-Regular", height:20}}
                            onChangeText={onChangeMedicine}
                            value={medicine}
                            placeholder="ej. Paracetamol"
                        />
                </View>


                {/* PARALELO */}
                <View style={styles.fieldsContainer}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontFamily: 'M1c-Regular', fontSize: 18, color: 'black', marginBottom: 0, textAlign: 'left', color: '#EA889A' }}>¿Cada cuánto?</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#E9E9E9', padding: 10, color: '#A9A9A9', borderRadius: 10, width: 50 }}>
                            <TextInput
                            style={{ color: '#808080', fontFamily: 'M1c-Regular', height: 20 }}
                            onChangeText={onChangeHoursMedicine}
                            value={hoursMedicine}
                            placeholder="ej. 8"
                            />
                        </View>
                        <Text style={{ fontFamily: 'M1c-Medium', fontSize: 14, color: 'black', marginBottom: 5, textAlign: 'left', marginLeft: 7,color: '#A9A9A9'}}>hrs</Text>
                        </View>
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontFamily: 'M1c-Regular', fontSize: 18, color: 'black', marginBottom: 0, textAlign: 'left', color: '#EA889A' }}>Dosis</Text>
                        <View style={{ backgroundColor: '#E9E9E9', padding: 10, color: '#A9A9A9', borderRadius: 10, width: 60 }}>
                            <TextInput
                                style={{ color: '#808080', fontFamily: 'M1c-Regular', height: 20 }}
                                onChangeText={onChangeDosis}
                                value={dosis}
                                placeholder="ej. 15"
                            />
                        </View>
                    </View>

                    <SelectDropdown
                        defaultButtonText= {<AntDesign name="caretdown" size={16} color="grey" />}
                        buttonStyle={{backgroundColor: '#E9E9E9', color: '#A9A9A9', borderRadius: 10, width: 60,alignSelf:'center'}}
                        data={["mg","mcg","mL", "Gotas", "UI", "%", "Patch", "Sup", "Spray"]} // TODO: Fetch this from server
                        onSelect={(selectedItem, index) => {
                            onChangeUnidad(selectedItem);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}
                    />

                    
                </View>

                <Text style={{ fontFamily: 'M1c-Regular', fontSize: 18, color:"black", textAlign:'left', color: "#EA889A" }}>Duración del tratamiento</Text>
                <SafeAreaView>
                    <Calendar
                        current={`${year}-${month}-${day}`}
                        initialDate={`${year}-${month}-${day}`}
                        markingType="period"
                        markedDates={getMarked()}
                        onDayPress={handleDayPress}

                    />
                </SafeAreaView>


                <View style={styles.buttonContainer}>
                    <Pressable 
                        // style={styles.circleCancelContainer}
                        onPressIn={() => { setCancelBtnColor('#D76161') }}
                        onPressOut={() => {
                            setCancelBtnColor('#FC7070')
                            navigation.navigate("Main")
                        }}
                    >
                        {/* <Text style={{ fontFamily: 'M1c-Bold', fontSize: 35, color: 'white', textAlign: 'center', lineHeight: 43 }}>+</Text> */}
                        <MaterialIcons name="cancel" size={60} color={cancelBtnColor} />
                    </Pressable>

                    <Pressable 
                        // style={styles.circleOKContainer}
                        onPressIn={() => {
                            setOKBtnColor('#74AD83');
                        }}
                        onPressOut={() => {
                            setOKBtnColor('#8CD19E');
                            handleOkPress();
                        }}
                    >
                        {/* <Text style={{ fontFamily: 'M1c-Bold', fontSize: 35, color: 'white', textAlign: 'center', lineHeight: 43 }}>+</Text> */}
                        <Ionicons name="md-checkmark-circle" size={60} color={OKBtnColor} />
                    </Pressable>
                </View>

            </View>
            
        </View>
    );
};
