import { Pressable, View, StyleSheet, Text, Modal } from 'react-native';
import React, { useState } from 'react';
import { Color } from '../util/colors';

export default Alerta = ({header, text}) => {
    const [visible, setVisible] = useState(true);

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
        },
        modalView: {
            width: 320,
            height: 220,
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 23,
            padding: 35,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            alignContent: 'center',
            justifyContent: 'center'
        },
        buttonModal: {
            width: 153,
            height: 44,
            backgroundColor: Color[40], 
            transform: Color[40] === Color[912]? [{translateY: 0}]: [{translateY: 2}] ,
            borderRadius: 15,
            textAlign: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: {
                height: 5,
                width: 5
            },
            padding: 10,
        },
    });

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={()=> {
                setVisible(false);
        }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={{fontFamily:'M1c-Bold', fontSize: 32, paddingBottom: 5}} >{header}</Text>
                    <Text style={{fontFamily:'M1c-Regular', fontSize: 16, color: '#787676', paddingBottom: 15, justifyContent: 'center', alignItems: 'center'}}>{text}</Text>
                    <Pressable style={styles.buttonModal}
                        onPressIn={() => { 
                            //setBtnColor(Color[50]);
                        }} 
                        onPressOut={() => { 
                            //setBtnColor(Color[40]) 
                            setVisible(false);
                        }}
                    >
                        <Text style={{fontFamily:'M1c-Regular', fontSize:16, color:'#FFF', fontWeight: 500}}>Ok</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};