import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { AlarmData } from '../util/alarmData';

const AlarmContext = createContext();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        priority: Notifications.AndroidNotificationPriority.HIGH, //Android
    }),
});

export const AlarmProvider = ({ children, route  }) => {
    const [alarms, setAlarms] = useState([]);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const navigation = useNavigation();
    const [sound, setSound] = React.useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [stopShowing, setStopShowing] = useState();


    useEffect(() => {
        const interval = setInterval(() => {
            scheduleNotification(new Date());
        }, 1000);
        return () => clearInterval(interval); // Limpieza al desmontar el componente
    }, []);

    /* */
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("\tsetNotification: ", notification);
            // navigation.navigate('Alarm');
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
            console.log("\n\n",AlarmData,"\n\n");
            console.log(AlarmData.hour, ":", AlarmData.minutes);
            let alarmHour = AlarmData.hour;
            let alarmMinutes = AlarmData.minutes;
            const triggerTime = new Date();
            triggerTime.setHours(alarmHour);
            triggerTime.setMinutes(alarmMinutes);
            console.log("current: ", currDate.getHours(), ":", currDate.getMinutes());
        
            if (AlarmData.active == true && currDate.getHours() === triggerTime.getHours() && currDate.getMinutes() === triggerTime.getMinutes()) {
                global.AlarmData.active = false;
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Recordatorio de pastilla',
                        body: '¡Es hora de tomar tu medicamento!',
                    },  
                    trigger: {
                        seconds: 0, 
                    },
                });
                navigation.navigate('Alarm',{hour:alarmHour, minutes:alarmMinutes, sound:sound});
            }
        };
        

    return (
        <AlarmContext.Provider value={{ alarms, setAlarms }}>
            {children}
        </AlarmContext.Provider>
    );
};

export const useAlarms = () => {
    const context = useContext(AlarmContext);
    if (!context) {
        throw new Error('useAlarms must be used within an AlarmProvider');
    }
    return context;
};
