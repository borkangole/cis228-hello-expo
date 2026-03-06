import { useState, useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SUBJECT_ICONS = ["📐", "🔬", "📖", "🌍", "🎨", "💻", "🎵", "⚽"];
const SUBJECT_COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
];

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState<{ text: string; done: boolean }[]>([]);
  const [todoInput, setTodoInput] = useState("");
  const [subjects, setSubjects] = useState([
    { name: "Data Mining", icon: "⛏️", color: "#6366f1", tasks: 0 },
    { name: "Bus. Process Mgmt", icon: "🏢", color: "#10b981", tasks: 0 },
    { name: "Quant. Methods", icon: "📊", color: "#f59e0b", tasks: 0 },
    { name: "IS Strategy", icon: "♟️", color: "#ef4444", tasks: 0 },
    { name: "Prof. Issues in IS", icon: "⚖️", color: "#8b5cf6", tasks: 0 },
    { name: "Enterprise Systems", icon: "🖥️", color: "#06b6d4", tasks: 0 },
    { name: "Thesis Writing IS 1", icon: "📝", color: "#f97316", tasks: 0 },
    { name: "CIS 228", icon: "📱", color: "#ec4899", tasks: 0 },
  ]);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(0);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const logoSpin = useRef(new Animated.Value(0)).current;
  const counterScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const previewOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, tension: 40, useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.timing(logoSpin, { toValue: 1, duration: 4000, useNativeDriver: true })
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(previewOpacity, {
      toValue: name.trim() ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [name]);

  const spin = logoSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  const onPressHello = () => {
    const trimmed = name.trim();
    Alert.alert("👋 Hello!", trimmed ? `Hello, ${trimmed}! Welcome to CIS 228!` : "Please type your name first!");
  };

  const animateCounter = () => {
    Animated.sequence([
      Animated.spring(counterScale, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(counterScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const addTodo = () => {
    if (todoInput.trim()) {
      setTodos((prev) => [...prev, { text: todoInput.trim(), done: false }]);
      setTodoInput("");
    }
  };

  const toggleTodo = (index: number) => {
    setTodos((prev) =>
      prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t))
    );
  };

  const removeTodo = (index: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
  };

  const addSubject = () => {
    if (newSubjectName.trim()) {
      setSubjects((prev) => [
        ...prev,
        {
          name: newSubjectName.trim(),
          icon: SUBJECT_ICONS[selectedIcon],
          color: SUBJECT_COLORS[selectedIcon],
          tasks: 0,
        },
      ]);
      setNewSubjectName("");
      setShowAddSubject(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.title}>{name.trim() || "Student"} 👋</Text>
          </View>
          <Animated.Text style={[styles.avatarEmoji, { transform: [{ rotate: spin }] }]}>🚀</Animated.Text>
        </View>
        <Text style={styles.subtitle}>MY FIRST REACT NATIVE APP • CIS 228</Text>
      </Animated.View>

      {/* ✅ Logo Card — mission requirement */}
      <Animated.View style={[styles.card, styles.logoCard, { opacity: fadeAnim }]}>
        <Animated.Image
          style={[styles.logo, { transform: [{ rotate: spin }] }]}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
        <View>
          <Text style={styles.logoTitle}>React Native</Text>
          <Text style={styles.cardLabel}>Powered by Expo • CIS 228</Text>
        </View>
      </Animated.View>

      {/* Name Input Card */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.label}>Enter your name:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mhel"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <View style={styles.buttonRow}>
          <Animated.View style={[{ flex: 1 }, { transform: [{ scale: buttonScale }] }]}>
            <TouchableOpacity
              style={styles.button}
              onPress={onPressHello}
              onPressIn={() => Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start()}
              activeOpacity={1}
            >
              <Text style={styles.buttonText}>👋 Say Hello</Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity style={styles.resetButton} onPress={() => setName("")}>
            <Text style={styles.resetButtonText}>🔄 Reset</Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.previewBox, { opacity: previewOpacity }]}>
          <Text style={styles.previewText}>Hello, {name.trim()}! 🎉</Text>
        </Animated.View>
      </Animated.View>

      {/* Subjects Grid */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>My Subjects</Text>
          <TouchableOpacity
            style={styles.addSubjectBtn}
            onPress={() => setShowAddSubject(!showAddSubject)}
          >
            <Text style={styles.addSubjectBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {showAddSubject && (
          <View style={styles.addSubjectPanel}>
            <TextInput
              style={styles.input}
              placeholder="Subject name..."
              placeholderTextColor="#94a3b8"
              value={newSubjectName}
              onChangeText={setNewSubjectName}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {SUBJECT_ICONS.map((icon, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.iconPicker, selectedIcon === i && { borderColor: SUBJECT_COLORS[i], borderWidth: 2 }]}
                    onPress={() => setSelectedIcon(i)}
                  >
                    <Text style={{ fontSize: 20 }}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.button} onPress={addSubject}>
              <Text style={styles.buttonText}>➕ Add Subject</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.grid}>
          {subjects.map((subject, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.subjectCard, { borderTopColor: subject.color, borderTopWidth: 3 }]}
              onPress={() => Alert.alert(subject.icon + " " + subject.name, `You have ${subject.tasks} task(s) for this subject!`)}
            >
              <Text style={styles.subjectIcon}>{subject.icon}</Text>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectTasks}>📝 {subject.tasks} tasks</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Counter */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}> Counter</Text>
        <Animated.Text style={[styles.counterNumber, { transform: [{ scale: counterScale }] }]}>
          {count}
        </Animated.Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.counterBtn} onPress={() => { if (count > 0) { setCount((c) => c - 1); animateCounter(); } }}>
            <Text style={styles.counterBtnText}>➖</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.counterBtn, styles.counterBtnBlue]} onPress={() => { setCount((c) => c + 1); animateCounter(); }}>
            <Text style={styles.counterBtnText}>➕</Text>
          </TouchableOpacity>
        </View>
        {count === 0 && <Text style={styles.counterHint}>{"Can't go below 0!"}</Text>}
      </Animated.View>

      {/* To-Do List */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}> To-Do List</Text>
        <View style={styles.todoInputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
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
            <TouchableOpacity key={index} style={styles.todoItem} onPress={() => toggleTodo(index)}>
              <Text style={styles.todoCheck}>{item.done ? "✅" : "⬜"}</Text>
              <Text style={[styles.todoText, item.done && styles.todoDone]}>
                {item.text}
              </Text>
              <TouchableOpacity onPress={() => removeTodo(index)}>
                <Text style={styles.todoDelete}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
        {todos.length > 0 && (
          <Text style={styles.todoProgress}>
            {todos.filter((t) => t.done).length}/{todos.length} completed 🎯
          </Text>
        )}
      </Animated.View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#0f172a",
    padding: 20,
    paddingTop: 60,
    gap: 16,
    paddingBottom: 40,
  },
  header: { gap: 6, marginBottom: 4 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 16, color: "#64748b" },
  title: { fontSize: 28, fontWeight: "900", color: "#f1f5f9" },
  avatarEmoji: { fontSize: 44 },
  subtitle: { fontSize: 11, color: "#334155", letterSpacing: 2, textTransform: "uppercase" },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 18,
    gap: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  logoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  logoTitle: {
    color: "#f1f5f9",
    fontSize: 18,
    fontWeight: "800",
  },
  cardLabel: {
    color: "#64748b",
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { color: "#f1f5f9", fontSize: 17, fontWeight: "700" },
  label: { color: "#e2e8f0", fontSize: 14, fontWeight: "600" },
  input: {
    width: "100%",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "white",
  },
  buttonRow: { flexDirection: "row", gap: 10 },
  button: {
    flex: 1,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 15, fontWeight: "700" },
  resetButton: {
    backgroundColor: "#334155",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: { color: "#94a3b8", fontSize: 14, fontWeight: "600" },
  previewBox: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  previewText: { color: "#a5b4fc", fontSize: 15, fontWeight: "600" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  subjectCard: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 14,
    width: "47%",
    gap: 4,
  },
  subjectIcon: { fontSize: 28 },
  subjectName: { color: "#f1f5f9", fontSize: 13, fontWeight: "700" },
  subjectTasks: { color: "#64748b", fontSize: 11 },
  addSubjectBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addSubjectBtnText: { color: "white", fontSize: 13, fontWeight: "700" },
  addSubjectPanel: { gap: 8 },
  iconPicker: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  counterNumber: { fontSize: 64, fontWeight: "900", color: "#6366f1", textAlign: "center" },
  counterBtn: {
    flex: 1,
    backgroundColor: "#334155",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  counterBtnBlue: { backgroundColor: "#1e3a5f" },
  counterBtnText: { fontSize: 22 },
  counterHint: { color: "#ef4444", fontSize: 12, textAlign: "center" },
  todoInputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  addBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { fontSize: 18 },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  todoCheck: { fontSize: 16 },
  todoText: { color: "#e2e8f0", fontSize: 14, flex: 1 },
  todoDone: { color: "#475569", textDecorationLine: "line-through" },
  todoDelete: { color: "#ef4444", fontSize: 15, fontWeight: "700" },
  todoProgress: { color: "#6366f1", fontSize: 13, fontWeight: "600", textAlign: "center" },
  emptyText: { color: "#475569", fontSize: 13, fontStyle: "italic", textAlign: "center" },
});