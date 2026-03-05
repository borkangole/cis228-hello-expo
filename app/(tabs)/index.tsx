import { useState, useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState<string[]>([]);
  const [todoInput, setTodoInput] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const previewOpacity = useRef(new Animated.Value(0)).current;
  const logoSpin = useRef(new Animated.Value(0)).current;
  const counterScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, tension: 40, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(logoSpin, { toValue: 1, duration: 4000, useNativeDriver: true })
    ).start();
  }, []);

  useEffect(() => {
    if (name.trim()) {
      Animated.timing(previewOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.timing(previewOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [name]);

  const spin = logoSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  const onPressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const onPressHello = () => {
    const trimmed = name.trim();
    Alert.alert("👋 Hello!", trimmed ? `Hello, ${trimmed}! Welcome to CIS 228!` : "Please type your name first!");
  };

  // Level 1: Reset
  const onReset = () => setName("");

  // Level 2: Counter with bounce animation
  const animateCounter = () => {
    Animated.sequence([
      Animated.spring(counterScale, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(counterScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };
  const increment = () => { setCount((c) => c + 1); animateCounter(); };
  const decrement = () => { if (count > 0) { setCount((c) => c - 1); animateCounter(); } };

  // Level 3: To-Do List
  const addTodo = () => {
    if (todoInput.trim()) {
      setTodos((prev) => [...prev, todoInput.trim()]);
      setTodoInput("");
    }
  };
  const removeTodo = (index: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.emoji}>🚀</Text>
        <Text style={styles.title}>Hello Expo!</Text>
        <Text style={styles.subtitle}>My First React Native App</Text>
      </Animated.View>

      {/* Logo Card */}
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Animated.Image
          style={[styles.logo, { transform: [{ rotate: spin }] }]}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
        <Text style={styles.cardLabel}>Powered by React Native</Text>
      </Animated.View>

      {/* Input + Buttons */}
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.label}>Enter your name:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mhel"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        {/* Level 1: Two buttons side by side */}
        <View style={styles.buttonRow}>
          <Animated.View style={[{ flex: 1 }, { transform: [{ scale: buttonScale }] }]}>
            <TouchableOpacity style={styles.button} onPress={onPressHello} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1}>
              <Text style={styles.buttonText}>👋 Say Hello</Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity style={styles.resetButton} onPress={onReset}>
            <Text style={styles.resetButtonText}>🔄 Reset</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Preview */}
      <Animated.View style={[styles.previewBox, { opacity: previewOpacity }]}>
        <Text style={styles.previewText}>Hello, {name.trim()}! 🎉</Text>
      </Animated.View>

      {/* Level 2: Counter */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}> Counter</Text>
        <Animated.Text style={[styles.counterNumber, { transform: [{ scale: counterScale }] }]}>
          {count}
        </Animated.Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.counterBtn} onPress={decrement}>
            <Text style={styles.counterBtnText}>➖</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.counterBtn, styles.counterBtnGreen]} onPress={increment}>
            <Text style={styles.counterBtnText}>➕</Text>
          </TouchableOpacity>
        </View>
       {count === 0 && <Text style={styles.counterHint}>{"Can't go below 0!"}</Text>}
      </Animated.View>

      {/* Level 3: To-Do List */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Mini To-Do List</Text>
        <View style={styles.todoInputRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Add a task..."
            placeholderTextColor="#94a3b8"
            value={todoInput}
            onChangeText={setTodoInput}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
            <Text style={styles.addBtnText}>➕</Text>
          </TouchableOpacity>
        </View>

        {todos.length === 0 ? (
          <Text style={styles.emptyText}>No tasks yet. Add one above! </Text>
        ) : (
          todos.map((item, index) => (
            <View key={index} style={styles.todoItem}>
              <Text style={styles.todoText}>• {item}</Text>
              <TouchableOpacity onPress={() => removeTodo(index)}>
                <Text style={styles.todoDelete}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </Animated.View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#0f172a",
    padding: 24,
    paddingTop: 60,
    alignItems: "center",
    gap: 20,
    paddingBottom: 40,
  },
  header: { alignItems: "center", gap: 4 },
  emoji: { fontSize: 48 },
  title: { fontSize: 38, fontWeight: "900", color: "#f1f5f9", letterSpacing: 1 },
  subtitle: { fontSize: 14, color: "#64748b", letterSpacing: 2, textTransform: "uppercase" },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    gap: 12,
    width: "100%",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: { width: 100, height: 100, borderRadius: 50 },
  cardLabel: { color: "#94a3b8", fontSize: 13, letterSpacing: 1 },
  section: { width: "100%", gap: 10 },
  sectionTitle: { color: "#f1f5f9", fontSize: 18, fontWeight: "700" },
  label: { color: "#e2e8f0", fontSize: 15, fontWeight: "600" },
  input: {
    width: "100%",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "white",
    marginBottom: 4,
  },
  buttonRow: { flexDirection: "row", gap: 10, width: "100%" },
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
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
  resetButton: {
    backgroundColor: "#334155",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: { color: "#94a3b8", fontSize: 16, fontWeight: "600" },
  previewBox: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
    width: "100%",
  },
  previewText: { color: "#a5b4fc", fontSize: 16, fontWeight: "600" },
  counterNumber: { fontSize: 64, fontWeight: "900", color: "#6366f1" },
  counterBtn: {
    flex: 1,
    backgroundColor: "#334155",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  counterBtnGreen: { backgroundColor: "#1e3a5f" },
  counterBtnText: { fontSize: 22 },
  counterHint: { color: "#ef4444", fontSize: 12 },
  todoInputRow: { flexDirection: "row", gap: 10, width: "100%", alignItems: "center" },
  addBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { fontSize: 18 },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: "100%",
  },
  todoText: { color: "#e2e8f0", fontSize: 15, flex: 1 },
  todoDelete: { color: "#ef4444", fontSize: 16, fontWeight: "700", paddingLeft: 10 },
  emptyText: { color: "#475569", fontSize: 13, fontStyle: "italic" },
});