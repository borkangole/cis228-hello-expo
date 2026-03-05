import { useState, useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [name, setName] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const previewOpacity = useRef(new Animated.Value(0)).current;
  const logoSpin = useRef(new Animated.Value(0)).current;

  // Entry animations on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo slow spin loop
    Animated.loop(
      Animated.timing(logoSpin, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Show preview with fade when name changes
  useEffect(() => {
    if (name.trim()) {
      Animated.timing(previewOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(previewOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [name]);

  const spin = logoSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const onPressHello = () => {
    const trimmed = name.trim();
    Alert.alert(
      "👋 Hello!",
      trimmed
        ? `Hello, ${trimmed}! Welcome to CIS 228!`
        : "Please type your name first!"
    );
  };

  return (
    <View style={styles.container}>

      {/* Header - slides in from top */}
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.emoji}>🚀</Text>
        <Text style={styles.title}>Hello Expo!</Text>
        <Text style={styles.subtitle}>My First React Native App</Text>
      </Animated.View>

      {/* Logo card - scales in */}
      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Animated.Image
          style={[styles.logo, { transform: [{ rotate: spin }] }]}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
        <Text style={styles.cardLabel}>Powered by React Native</Text>
      </Animated.View>

      {/* Input section - fades in */}
      <Animated.View
        style={[styles.inputSection, { opacity: fadeAnim }]}
      >
        <Text style={styles.label}>👤 Enter your name:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mhel"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </Animated.View>

      {/* Button - press animation */}
      <Animated.View
        style={[
          styles.buttonWrap,
          { transform: [{ scale: buttonScale }], opacity: fadeAnim },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={onPressHello}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>👋 Say Hello</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Preview - fades in when name is typed */}
      <Animated.View
        style={[styles.previewBox, { opacity: previewOpacity }]}
      >
        <Text style={styles.previewText}>Hello, {name.trim()}! 🎉</Text>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  header: {
    alignItems: "center",
    gap: 4,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#f1f5f9",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 10,
    width: "100%",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardLabel: {
    color: "#94a3b8",
    fontSize: 13,
    letterSpacing: 1,
  },
  inputSection: {
    width: "100%",
    gap: 8,
  },
  label: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "white",
  },
  buttonWrap: {
    width: "100%",
  },
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  previewBox: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
    width: "100%",
  },
  previewText: {
    color: "#a5b4fc",
    fontSize: 16,
    fontWeight: "600",
  },
});