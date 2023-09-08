import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors'
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

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

    // const [selected, setSelected] = useState('');
    // const [day, setDay] = useState(new Date().getDate());
    // const [month, setMonth] = useState(new Date().getMonth()+1);
    // const [year, setYear] = useState(new Date().getFullYear());
    const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate();

  const initialSelectedDates = {}; // Inicialmente, ninguna fecha está seleccionada

  const getMarked = () => {
    let marked = {};

    for (let i = 1; i <= 31; i++) {
      const dayNumber = i.toString().padStart(2, '0');
      const dateStr = `${year}-${month}-${dayNumber}`;
      
      marked[dateStr] = {
        startingDay: false,
        endingDay: false,
        color: selectedDates[dateStr] ? '#FFC9DA' : 'white',
        textColor: '#444444',
        disabled: false,
      };
    }

    return marked;
  };

  const [selectedDates, setSelectedDates] = useState(initialSelectedDates);

  const handleDayPress = (day) => {
    const dateStr = day.dateString;
    const newSelectedDates = { ...selectedDates };
    newSelectedDates[dateStr] = !newSelectedDates[dateStr];
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
        console.log(day, meses[month] , year);
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
        enableSwipeMonths={true} // Permite seleccionar fechas de otros meses
      />
    </SafeAreaView>


                <View style={styles.buttonContainer}>
                    <Pressable 
                        // style={styles.circleCancelContainer}
                        onPressIn={() => { setCancelBtnColor('#D76161') }}
                        onPressOut={() => { setCancelBtnColor('#FC7070') }}
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
