import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors'
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown'
import { AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import NotificationSounds, { playSampleSound, stopSampleSound } from  'react-native-notification-sounds';

const unidades = ["mg", "piezas", "g", "mcg / µg", "oz", "gota(s)", ]

/* */

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        priority: Notifications.AndroidNotificationPriority.HIGH, //Android
    }),
});


/* */


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
    /* */
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    /* */

    const [cancelBtnColor, setCancelBtnColor] = useState("#FC7070");
    const [OKBtnColor, setOKBtnColor] = useState("#8CD19E");
    const [medicine, onChangeMedicine] = useState("");
    const [dosis, onChangeDosis] = useState("");
    const [unidad, onChangeUnidad] = useState("");
    const [hoursMedicine, onChangeHoursMedicine] = useState("");
    const [currentHour, setCurrentHour] = useState(new Date().getHours());
    const [currentMinutes, setCurrentMinutes] = useState(new Date().getMinutes());

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate();



    const initialSelectedDates = {}; // Inicialmente, ninguna fecha está seleccionada
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            // setCurrentTime(new Date());
            scheduleNotification(new Date());
        }, 1000);
        return () => clearInterval(interval); // Limpieza al desmontar el componente
    }, []);
    

    /* */
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("\tsetNotification: ", notification);
            navigation.navigate('Alarm');
            setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
            // navigation.navigate('Alarm');
        });
    
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []); 


    async function registerForPushNotificationsAsync() {
        let token;
        
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            }
            if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
            }
            token = (await Notifications.getExpoPushTokenAsync( {projectId:'045aec31-ccc6-46a8-bb3f-efe4110f9aba'} )).data;
        } else {
            alert('Must use physical device for Push Notifications');
        }
        
        return token;
        }
        
        const scheduleNotification = async (currDate) => {
            const triggerTime = new Date();
            triggerTime.setHours(23);
            triggerTime.setMinutes(34);
            triggerTime.setSeconds(0);

            console.log("current: ", currDate.getHours(), ":", currDate.getMinutes());
    
            if (currDate.getHours() === triggerTime.getHours() && currDate.getMinutes() === triggerTime.getMinutes()) {
                // await Notifications.scheduleNotificationAsync({
                //     content: {
                //         title: 'Recordatorio de pastilla',
                //         body: '¡Es hora de tomar tu medicamento!',
                //     },
                //     trigger: {
                //         seconds: 0, 
                //     },
                // });
                try {
                    const soundsList = await NotificationSounds.getNotifications('notification');
                    console.warn('SOUNDS', JSON.stringify(soundsList));
                    // Play the notification sound.
                    playSampleSound(soundsList[1]);
                    // Stop the sound after 4 seconds
                    setTimeout(() => {
                        stopSampleSound();
                    }, 4000); // 4000 milliseconds = 4 seconds
                } catch (error) {
                    console.error('Error fetching notification sounds:', error);
                }
                navigation.navigate('Alarm');
            }else{
                navigation.navigate("Config");
            }
        };

        
        // useEffect(() => {
        //     const interval = setInterval(() => {
        //         const now = new Date();
        //         setCurrentHour(now.getHours());
        //         setCurrentMinutes(now.getMinutes());
        //     }, 60000); 
    
        //     return () => clearInterval(interval);
        // }, []);

    /* */

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
        const dateStr = day.dateString;
        const newSelectedDates = { ...selectedDates };
        newSelectedDates[dateStr] = !newSelectedDates[dateStr];
        console.log("selected dates: ",newSelectedDates);
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
    
    

    // const getMarked = () => {
    //     let marked = {};
    
    //     for (let i = 1; i <= 31; i++) {
    //       const dayNumber = i.toString().padStart(2, '0');
    //       const dateStr = `${year}-${month}-${dayNumber}`;
          
    //       marked[dateStr] = {
    //         startingDay: false, // No necesitamos marcar un "startingDay"
    //         endingDay: false, // No necesitamos marcar un "endingDay"
    //         color: selectedDates[dateStr] ? 'white' : '#FFC9DA', // Cambia el color a blanco si está seleccionado
    //         textColor: selectedDates[dateStr] ? '#aaa' : '#444444', // Cambia el color del texto si está seleccionado
    //         disabled: false, // Habilita todas las fechas para que sean seleccionables
    //       };
    //     }
    
    //     return marked;
    //   };
    
    useEffect(()=>{
        // console.log(day, meses[month] , year);
    }, [day, month, year])


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
                        data={["mg","mcg","mL", "Gotas", "UI", "%", "Patch", "Sup", "Spray"]}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index)
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
                {/* PARALELO */}

                <Text style={{ fontFamily: 'M1c-Regular', fontSize: 18, color:"black", textAlign:'left', color: "#EA889A" }}>Duración del tratamiento</Text>
                {/* <Calendar
                    style={{
                    }}
                    current={`${year}-${month}-${day}`}
                    onDayPress={day => { 
                        console.log('selected day', day);
                    }}
                    markedDates={{
                        '2012-03-01': {selected: true, marked: true, selectedColor: 'blue'},
                        '2012-03-02': {marked: true},
                        '2012-03-03': {selected: true, marked: true, selectedColor: 'blue'}
                    }}
                /> */}
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
                            navigation.navigate("Main")
                            setCancelBtnColor('#FC7070')
                        }}
                    >
                        {/* <Text style={{ fontFamily: 'M1c-Bold', fontSize: 35, color: 'white', textAlign: 'center', lineHeight: 43 }}>+</Text> */}
                        <MaterialIcons name="cancel" size={60} color={cancelBtnColor} />
                    </Pressable>

                    <Pressable 
                        // style={styles.circleOKContainer}
                        onPressIn={() => { setOKBtnColor('#74AD83') }}
                        onPressOut={() => { setOKBtnColor('#8CD19E') }}
                    >
                        {/* <Text style={{ fontFamily: 'M1c-Bold', fontSize: 35, color: 'white', textAlign: 'center', lineHeight: 43 }}>+</Text> */}
                        <Ionicons name="md-checkmark-circle" size={60} color={OKBtnColor} />
                    </Pressable>
                </View>

            </View>
            
        </View>
    );
};

