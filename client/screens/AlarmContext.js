import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useNavigation } from '@react-navigation/native';

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


    useEffect(() => {
        const interval = setInterval(() => {
            // setCurrentTime(new Date());
            // console.log(props);
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
            let alarmHour = 1;
            let alarmMinutes = 22;
            const triggerTime = new Date();
            triggerTime.setHours(alarmHour);
            triggerTime.setMinutes(alarmMinutes);
            // triggerTime.setSeconds(0);

            console.log("current: ", currDate.getHours(), ":", currDate.getMinutes());
    
            if (currDate.getHours() === triggerTime.getHours() && currDate.getMinutes() === triggerTime.getMinutes()) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Recordatorio de pastilla',
                        body: '¡Es hora de tomar tu medicamento!',
                    },
                    trigger: {
                        seconds: 0, 
                    },
                });
                
                console.log(alarmHour, alarmMinutes);
                navigation.navigate('Alarm',{hour:alarmHour, minutes:alarmMinutes});
            }else{
                // navigation.navigate("Config");
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
