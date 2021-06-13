import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import Game from "src/Game";

const App: React.FC = () => {
  const classes = styles();

  const [isRunning, setIsRunning] = useState(false);

  const handleStartButtonPress = () => {
    setIsRunning(true);
  };

  return (
    <View style={classes.container}>
      <Game isRunning={isRunning} />
      {!isRunning && (
        <Button
          onPress={handleStartButtonPress}
          title="Start"
          color="#841584"
          accessibilityLabel="Start"
        />
      )}
    </View>
  );
};

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: "#000",
    },
  });

export default App;
