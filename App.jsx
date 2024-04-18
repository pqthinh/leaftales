import React, { useEffect, useState } from "react";
import { View } from "react-native";

import BookScreen from "./view/BookScreen";
import ControlScreen from "./view/ControlScreen";
import HomeScreen from "./view/HomeScreen";
import Speech2Text from "./view/Speech2Text";

export default function App() {
  return (
    <>
      {/* <HomeScreen/>
      <ControlScreen /> */}
      <BookScreen />
      {/* <Speech2Text /> */}
    </>
  );
}
