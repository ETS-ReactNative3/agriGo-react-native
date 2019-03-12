import React from "react";
import { Platform, TouchableOpacity, View, Image } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator
} from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import LoadingScreen from "../screens/LoadingScreen";
import { createSwitchNavigator } from "react-navigation";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import ShareScreen from "../screens/ShareScreen";
import Profile from "../screens/Profile";
import ViewScreen from "../screens/ViewRequest";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import RideComplete from "../screens/RideComplete.js";

const profileScreen = createStackNavigator({
  Profile: Profile
});
const ViewNavigator = createStackNavigator({
  ShareScreen: ShareScreen,
  ViewScreen: ViewScreen
});

const AppTabNavigator = createBottomTabNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Entypo color="#f7b733" size={24} name="user" />;
        }
      }
    },
    HomeScreen: {
      screen: HomeScreen,
      //Nav options for Home
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return (
            <Image
              style={{ width: 60, height: 60, marginBottom: 40 }}
              source={require("../assets/images/logo.png")}
            />
          );
        }
      }
    },
    ShareScreen: {
      screen: ShareScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return <Entypo color="#f7b733" size={24} name="info" />;
        }
      }
    }
  },
  //options
  {
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      labelStyle: {
        fontSize: 12
      },
      tabStyle: {
        width: 100
      },
      style: {
        height: 60,
        backgroundColor: "white",
        border: "none",
        elevation: 2
      }
    }
  }
);

const AppStackNavigator = createStackNavigator({
  AppTabNavigator: {
    screen: AppTabNavigator,

    navigationOptions: ({ navigation }) => ({
      // title: "AgriGo",
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{ paddingHorizontal: 10 }}>
            <Icon name="md-menu" size={24} />
          </View>
        </TouchableOpacity>
      ),
      title: "Find your ride",
      headerTintColor: "#fff",
      header: null,
      headerStyle: {
        backgroundColor: "#f7b733"
      }
    })
  },
  ViewScreen: {
    screen: ViewScreen
  }
});

const AppDrawerNavigator = createDrawerNavigator({
  Home: AppStackNavigator
});

const AuthStackNavigator = createStackNavigator(
  {
    // Welcome: WelcomeScreen,
    SignIn: SignInScreen,
    SignUp: SignUpScreen
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: true
    }
  }
);

export default createSwitchNavigator({
  AuthLoader: LoadingScreen,
  Auth: AuthStackNavigator,
  // Profile: profileScreen,
  App: AppDrawerNavigator
});
