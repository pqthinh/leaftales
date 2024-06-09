import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppDrawer from './src/navigation/AppDrawer';
import { VoiceControlProvider } from './src/provider/VoiceProvider';
import { VoiceControlComponent } from './src/component/VoiceControl';

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
