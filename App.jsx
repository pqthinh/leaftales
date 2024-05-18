import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppDrawer from './navigation/AppDrawer';
import { VoiceControlProvider } from './provider/VoiceProvider';
import { VoiceControlComponent } from './component/VoiceControl';

export default function App() {
  return (
    <VoiceControlProvider >
      <NavigationContainer>
        <AppDrawer />
      </NavigationContainer>
      <VoiceControlComponent />
    </VoiceControlProvider>
  );
}
