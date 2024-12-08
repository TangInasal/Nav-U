import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';

// import Animated, {
//   useAnimatedg
// } from 'react-native-reanimated';

// Import your images
import homeIcon from './assets/home.png';
import notificationIcon from './assets/notification.png';
import shareIcon from './assets/share.png';

// Stack Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const { width, height } = Dimensions.get('window'); // for map

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
      <Image source={require('./assets/NavUdark.png')} style={styles.logo} />
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
        navigation.navigate('TabNavigation');  // Navigate to TabNavigation instead of HomeScreen
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
      <Image source={require('./assets/NavUdark.png')} style={styles.logo} />
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

// Home Screen
const HomeScreen = () => {
  const [scale, setScale] = useState(1); // For zoom functionality
  const bottomSheetRef = useRef(); // Reference for BottomSheet

  // Zoom Handler
  const onZoomEvent = (event) => {
    setScale(event.nativeEvent.scale);
  };

  const onZoomStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setScale(1); // Reset zoom scale after interaction
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Map Background with Zoom Functionality */}
      <PinchGestureHandler onGestureEvent={onZoomEvent} onHandlerStateChange={onZoomStateChange}>
        <View style={styles.mapContainer}>
          <Image
            source={require('./assets/map4.png')} // Update this with the correct path to "map.jpg"
            style={[styles.mapImage, { transform: [{ scale }] }]}
          />
        </View>
      </PinchGestureHandler>

      {/* Pull-Up Drawer */}
      <BottomSheet ref={bottomSheetRef} height={height / 2} draggable={true}>
        <View style={styles.drawerContainer}>
          <Text style={styles.drawerTitle}>Share Location</Text>

          {/* Share with Friends Button */}
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share with Friends</Text>
          </TouchableOpacity>

          {/* Find Friends Button */}
          <TouchableOpacity style={styles.findButton}>
            <Text style={styles.findButtonText}>Find Friends</Text>
          </TouchableOpacity>

          {/* List of Friends */}
          <View style={styles.friendList}>
            {['John', 'Mae', 'July'].map((friend, index) => (
              <View key={index} style={styles.friendItem}>
                <Image
                  source={require('./assets/user.png')} // Replace with the correct path
                  style={styles.friendAvatar}
                />
                <Text style={styles.friendName}>{friend}</Text>
              </View>
            ))}
          </View>
        </View>
      </BottomSheet>

      {/* Drawer Trigger Button */}
      <TouchableOpacity
        style={styles.triggerButton}
        onPress={() => bottomSheetRef.current.show()}
      >
        <Text style={styles.triggerText}>Share Location</Text>
      </TouchableOpacity>
    </View>
  );
};

// const avatarColors = ['#4CAF50', '#E91E63', '#3F51B5']; // Colors for avatars

// Notifications Screen
const NotificationsScreen = () => {
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
            source={require('./assets/notification-illustration.png')} // Replace with actual path
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
};

// const ShareScreen = () => {
//   return (
//     <View>
//       <Text>Settings</Text>
//     </View>
//   );
// };

// Bottom Tab Navigator
const TabNavigation = () => {
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
          } else if (route.name === 'Settings') {
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
};

// App Component to handle navigation
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  React.useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'TabNavigation' : 'SignIn'}>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F8F8F0', // Ivory White Background Color
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40, // Add some space at the top for the logo
  },
  container: {
    width: '85%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // Background color for the container itself (not full screen)
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 60, // Increased space to accommodate logo change
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
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 16,
    color: '#666',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#22277A', // Title color adjusted for contrast
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
  },
  button: {
    width: '40%',
    height: 45, // Slightly smaller button
    backgroundColor: '#007BFF', // Blue color for buttons
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#007BFF',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50, // Move it below the status bar
    left: 20,
    backgroundColor: '#E0A800',
    padding: 10,
    borderRadius: 25,
    zIndex: 1, // Ensure it's above other elements
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    position: 'absolute',
    top: 80, // Adjust to position the logo lower
    alignSelf: 'center',
    width: 200,  // Increased size of the logo
    height: 200, // Increased size of the logo
    resizeMode: 'contain',
  },
    mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: '#FFC107',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  findButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 25,
  },
  findButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  friendList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  friendItem: {
    alignItems: 'center',
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  friendName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  triggerButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 25,
  },
  triggerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes the image circular
    marginBottom: 5,
    resizeMode: 'cover', // Ensures the image fits well within the circular frame
  },
  

})
