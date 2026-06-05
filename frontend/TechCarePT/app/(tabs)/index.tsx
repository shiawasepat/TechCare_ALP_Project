import React, { useEffect } from 'react';
import MitraLogin from "./mitra/login"; // Your existing import
import messaging from '@react-native-firebase/messaging';


//runs even if the app is closed.
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export default function Index() {
  
  //FETCH THE TOKEN ON LOAD
  useEffect(() => {
    requestUserPermission();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      try {
        const token = await messaging().getToken();
        console.log('🔥 MITRA FCM TOKEN 🔥:', token);
      } catch (error) {
        console.log('Failed to get token:', error);
      }
    }
  }

  
  return <MitraLogin />;
}