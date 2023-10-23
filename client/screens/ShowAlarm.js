import { Pressable, View, Image, StyleSheet, Text, TextInput, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Color } from '../util/colors';
import { Ionicons } from '@expo/vector-icons';

export default ShowAlarm = ({ route, navigation }) => {

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#FFFEFE"}}>
            <Text style={{fontSize:32, color:"#FC709B"}}>Paracetamol 20 mg</Text>
        </View>
    );
};