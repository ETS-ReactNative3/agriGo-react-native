import React from "react";
import {
  ScrollView,
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from "react-native";
import {
  Label,
  Icon,
  Item,
  Textarea,
  Input,
  Form,
  Container
} from "native-base";
import { LinearGradient } from "expo";
const localip = "192.168.0.105";
export default class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        username: "dr",
        password: "dr"
      },
      authMode: "login"
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.onValueChangePassword = this.onValueChangePassword.bind(this);
    this._handleAdd = this._handleAdd.bind(this);
  }

  handleAuthMode(mode) {
    this.setState({ authMode: mode });
  }

  handleSignUp() {
    if (this.state.authMode == "signup") {
      this._handleSignUp();
    } else {
      this.handleAuthMode("signup"); //to add new input field
    }
  }

  handleLogIn() {
    if (this.state.authMode == "login") {
      this._handleAdd();
    } else {
      this.handleAuthMode("login");
    }
  }

  onValueChange(e) {
    // let acre = e.toString();
    let state = { ...this.state };
    state.value.username = e;
    this.setState({ state });
  }

  onValueChangePassword(e) {
    let state = { ...this.state };
    state.value.password = e;
    this.setState({ state });
  }

  _handleSignUp = value => {
    // const value = this.refs.form.getValue();
    // If the form is valid...
    console.log("trying to register");
    const data = {
      username: this.state.value.username,
      password: this.state.value.password
    };
    console.log(data);
    // Serialize and post the data
    const json = JSON.stringify(data);
    fetch(`http://${localip}:3000/api/driver/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    })
      .then(response => response.json())
      .then(() => {
        alert("Success! You may now log in.");
        // Redirect to home screen
        // this.props.navigation.navigate("Profile");
      })
      .catch(error => {
        console.log(error);
      })
      .done();
  };

  _handleAdd = value => {
    // const value = this.refs.form.getValue();
    // If the form is valid...

    const data = {
      username: this.state.value.username,
      password: this.state.value.password
    };
    console.log(data);

    // Serialize and post the data
    const json = JSON.stringify(data);
    // https://agrigo.herokuapp.com/api/user/login
    fetch(`http://${localip}:3000/api/driver/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    })
      .then(response => response.json())
      .then(res => {
        if (res.error) {
          alert(res.error);
        } else {
          AsyncStorage.setItem("jwt", res.token);
          alert(`Success! You may now access protected content.`);
          // Redirect to home screen
          this.props.navigation.navigate("HomeScreen");
        }
      })
      .catch(() => {
        alert("There was an error logging in.");
      })
      .done();
  };

  render() {
    return (
      <LinearGradient colors={["#fc4a1a", "#f7b733"]} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.deliverideStyle}>
            <Text
              style={{
                fontSize: 80,
                fontFamily: "Billabong",
                color: "white",
                paddingBottom: 0,
                height: 100
              }}
            >
              AgriGo
            </Text>
            <Text style={{ color: "white", fontSize: 12, marginTop: 20 }}>
              Agriculture Get's On
            </Text>
          </View>
          <View style={{ flex: 4 }}>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 15
              }}
            >
              <Item regular>
                <Input
                  style={styles.inputStyle}
                  onChangeText={this.onValueChange.bind(this)}
                  placeholder="Username"
                  placeholderTextColor="white"
                  textContentType="username"
                  // value="UR HOME"
                />
              </Item>
              <Item style={{ marginTop: 20 }} regular>
                <Input
                  onChangeText={this.onValueChangePassword.bind(this)}
                  placeholder="Password"
                  style={styles.inputStyle}
                  placeholderTextColor="white"
                  textContentType="password"
                  secureTextEntry={true}
                  // value="mrK"
                />
              </Item>
              {this.state.authMode == "signup" ? (
                <Item style={{ marginTop: 20, marginBottom: 20 }} regular>
                  <Input
                    onChangeText={this.onValueChange.bind(this)}
                    placeholder="Confirm Password"
                    style={styles.inputStyle}
                    placeholderTextColor="white"
                    textContentType="password"
                    secureTextEntry={true}
                  />
                </Item>
              ) : null}
            </View>
          </View>
          <View style={{ flex: 3, margin: 20 }}>
            <TouchableOpacity
              onPress={this.handleLogIn.bind(this)}
              style={{
                backgroundColor: "white",
                height: 40,
                elevation: 3,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>Login</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 17 }}>
              <TouchableOpacity
                onPress={this.handleSignUp.bind(this)}
                style={{
                  backgroundColor: "white",
                  height: 40,
                  elevation: 3,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    margin: 20,
    backgroundColor: "#fff"
  },
  inputStyles: {
    fontFamily: "monserrat-m",
    margin: 5
  },
  deliverideStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 4
  },
  generalCenter: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  inputStyle: {
    color: "white",
    borderWidth: 1,
    borderColor: "white"
  },
  testBorder: {
    borderColor: "blue",
    borderWidth: 2
  }
});
