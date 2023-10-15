import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import Login from './screens/Login.js';
import SignUp from './screens/SignUp.js';
import Forgot from './screens/Forgot.js';
import Config from './screens/Config.js';
import Main from './screens/Main.js';
import nextAlarm from './components/nextAlarm.js';

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'M1c-Black': require('./assets/fonts/M_PLUS_Rounded_1c/MPLUSRounded1c-Black.ttf'),
        'M1c-Bold': require('./assets/fonts/M_PLUS_Rounded_1c/MPLUSRounded1c-Bold.ttf'),
        'M1c-Extrabold': require('./assets/fonts/M_PLUS_Rounded_1c/MPLUSRounded1c-ExtraBold.ttf'),
        'M1c-Light': require('./assets/fonts/M_PLUS_Rounded_1c/MPLUSRounded1c-Light.ttf'),
        'M1c-Medium': require('./assets/fonts/M_PLUS_Rounded_1c/MPLUSRounded1c-Medium.ttf'),
        'M1c-Regular': require('./assets/fonts/M_PLUS_Rounded_1c/MPLUSRounded1c-Regular.ttf'),
        'M1c-Thin': require('./assets/fonts/M_PLUS_Rounded_1c/MPLUSRounded1c-Thin.ttf'),
      });
      setFontLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return null; // You can render a loading screen or something here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Config" component={Config} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Forgot" component={Forgot} options={{ headerShown: false }} />
        <Stack.Screen name="NextAlarm" component={nextAlarm} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
