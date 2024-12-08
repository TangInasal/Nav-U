
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your images
import homeIcon from './home.png';
import notificationIcon from './notification.png';
import shareIcon from './share.png';

// Stack Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// SignUp Screen
const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      await AsyncStorage.setItem(email, password);
      Alert.alert('Success', 'Account created! You can now sign in.');
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error(error);
    }
  };

  return (
    <View style={styles.background}>
      <Image source={require('./NavUdark.png')} style={styles.logo} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Create an Account</Text>
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

// SignIn Screen
const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const storedPassword = await AsyncStorage.getItem(email);
      if (storedPassword === password) {
        Alert.alert('Success', 'Welcome!');
        navigation.navigate('TabNavigation');
      } else {
        Alert.alert('Error', 'Invalid email or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error(error);
    }
  };

  return (
    <View style={styles.background}>
      <Image source={require('./NavUdark.png')} style={styles.logo} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

// Map Screen (Example Placeholder)
const MapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campus Map</Text>
      <Text>Map will be displayed here.</Text>
    </View>
  );
};

// Notifications Screen with Tabs
function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState('Notifications');

  return (
    <View style={styles.notificationsContainer}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Chats' && styles.activeTab]}
          onPress={() => setActiveTab('Chats')}
        >
          <Text style={[styles.tabText, activeTab === 'Chats' && styles.activeTabText]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Notifications' && styles.activeTab]}
          onPress={() => setActiveTab('Notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'Notifications' && styles.activeTabText]}>Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'Notifications' ? (
        <View style={styles.contentContainer}>
          <Image
            source={require('./notification-illustration.png')} // Replace with actual path
            style={styles.image}
          />
          <Text style={styles.notificationText}>Notifications will appear here</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.notificationText}>Chats will appear here</Text>
        </View>
      )}
    </View>
  );
}

// Bottom Tab Screens
function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}

function ShareScreen() {
  return (
    <View>
      <Text>Share Screen</Text>
    </View>
  );
}

// Bottom Tab Navigator
function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Notifications') {
            iconName = notificationIcon;
          } else if (route.name === 'Home') {
            iconName = homeIcon;
          } else if (route.name === 'Share') {
            iconName = shareIcon;
          }
          return <Image source={iconName} style={{ width: size, height: size }} />;
        },
      })}
    >
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F8F8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#007BFF',
  },
  tabText: {
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 16,
    color: '#666',
  },
});
