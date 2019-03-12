import React from "react";
import Book from "../components/bookingForm";
import Map from "../components/Map";
import {
  View,
  HeaderBarItem,
  StatusBar,
  AsyncStorage,
  Dimensions,
  navi,
  TouchableOpacity
} from "react-native";
import {
  Container,
  Text,
  Button,
  Content,
  Input,
  Form,
  Picker,
  DatePicker,
  Item
} from "native-base";

import io from "socket.io-client";
console.ignoredYellowBox = ["Remote debugger"];
const localip = "192.168.0.105";
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);
const { screenHeight, screenWidth } = Dimensions.get("window");
const LATITUDE = 12.9778894;
const LONGITUDE = 77.644986;
export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.activeSocket = false;
    this.state = {
      currentLocation: null,
      inputFocus: 0,
      selected: "key1",
      value: {
        acre: "null",
        PhoneNo: "null",
        date: ""
      }
    };
    this.onValueChangeAcre = this.onValueChangeAcre.bind(this);
    this.handleConfirmRide = this.handleConfirmRide.bind(this);
    this.continueSumbit = this.continueSumbit.bind(this);
    this.onValueChangePhoneNo = this.onValueChangePhoneNo.bind(this);
    this.setDate = this.setDate.bind(this);
  }
  async continueSumbit({ latitude, longitude }) {
    const data = {
      date: this.state.value.date,
      startLocation: { lat: latitude, long: longitude },
      MachineryName: this.state.selected,
      PhoneNo: this.state.value.PhoneNo,
      Acre: this.state.value.acre
    };
    console.log("Continueing with data", data);
    let token = await AsyncStorage.getItem("jwt");
    try {
      let response = await fetch(`http://${localip}:3000/user/book`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`
        },
        body: JSON.stringify(data)
      });
      let responseJson = await response.json();
      console.log(responseJson.message);
      return responseJson.message;
    } catch (error) {
      console.error(error);
    }
  }

  getLocationHandler = async () => {
    await navigator.geolocation.getCurrentPosition(pos => {
      this.continueSumbit(pos.coords);
      // this.setState({...this.state,currentLocation:pos.coords})
    });
  };
  async handleConfirmRide() {
    //  alert("book clicked");
    console.log("trying to book");
    await this.getLocationHandler();
    // await this.continueSumbit({ latitude: 122, longitude: 1233 });
    // return console.log(this.state.currentLocation);
  }

  async sendUserId() {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${localip}:3000/user/getuser`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`
      }
    })
      .then(res => console.log("ok"))
      .catch(() => alert("Cannot send ID"));
  }

  async updateSocketId(socketId) {
    let token = await AsyncStorage.getItem("jwt");
    try {
      let response = await fetch(`http://${localip}:3000/user/updateSocket`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`
        },
        body: JSON.stringify({ userSocketId: socketId })
      });
      let responseJson = await response.json();
      console.log(responseJson.message);
      return responseJson.message;
    } catch (error) {
      console.error(error);
    }
  }

  connectSocket() {
    this.socket = io(`http://${localip}:3000`);
    this.socket.on("connect", () => {
      this.activeSocket = true;
      console.log(
        "Connected with id: " + this.socket.id + " sending to server"
      );
      this.socket.emit("client", "Hi from clint");
      this.updateSocketId(this.socket.id);
      // this.socket.on('track-driver',(location)=>{
      //   console.log('track-driver',location);
      // })
      this.socket.emit("new-socket", this.socket.id);
    });
    this.socket.on("disconnect", function() {
      this.activeSocket = false;
      console.log("user disconnected");
    });
  }

  onValueChange(value) {
    this.setState({
      // selected: value
      ...this.state,
      selected: value
    });
  }

  onValueChangeAcre(e) {
    let state = { ...this.state };
    state.value.acre = e;

    this.setState({ state });
  }

  onValueChangePhoneNo(e) {
    let state = { ...this.state };
    state.value.PhoneNo = e;
    this.setState({ state });
  }
  setDate(newDate) {
    let state = { ...this.state };
    state.value.date = newDate;
    this.setState({ state });
  }
  render() {
    console.log(this.state);

    const { width, height } = Dimensions.get("window");
    console.log("Socket is " + this.activeSocket);
    if (!this.activeSocket || true) {
      this.sendUserId();
      this.connectSocket();
      console.log("Trying to reconnect");
    }
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <StatusBar backgroundColor="red" />

        <Map socket={this.socket} />
        <View
          style={{
            position: "absolute",
            top: "85%",
            width: 350,
            backgroundColor: "#f7b733",
            zIndex: 4,
            elevation: 3
          }}
        />
        {/* {Map MapSearch} */}
        <View
          style={{
            backgroundColor: "#fff",
            width: width - 40,
            height: 200,
            borderRadius: 10,
            margin: 20,
            marginTop: 55,
            position: "absolute",
            zIndex: 1,
            elevation: 15
          }}
        >
          <View>
            <Item>
              <Form>
                <Picker
                  note
                  mode="dropdown"
                  style={{ width: 320 }}
                  selectedValue={this.state.selected}
                  onValueChange={this.onValueChange.bind(this)}
                >
                  <Picker.Item label="Select Machinery" value="null" />
                  <Picker.Item label="Tractor" value="Tractor" />
                  <Picker.Item label="Harvester" value="Harvester" />
                  <Picker.Item label="Rice Planter" value="Rice Planter" />
                  <Picker.Item label="Plougher" value="Plougher" />
                  <Picker.Item label="Ground Leveler" value="Ground Leveler" />
                </Picker>
              </Form>
            </Item>
            <Item>
              <Input
                onChangeText={this.onValueChangeAcre}
                keyboardType="number-pad"
                placeholder="Enter Acre"
              />
            </Item>
            <Item>
              <Content>
                <DatePicker
                  defaultDate={Date.now()}
                  minimumDate={Date.now()}
                  maximumDate={new Date(2020, 1, 1)}
                  locale={"en"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText="Select date"
                  textStyle={{ color: "#f7b733" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={this.setDate}
                  disabled={false}
                />
              </Content>
            </Item>
            <Item>
              <Input
                onChangeText={this.onValueChangePhoneNo}
                keyboardType="number-pad"
                placeholder="Enter PhoneNo"
              />
            </Item>
          </View>
        </View>
        <View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={this.handleConfirmRide}
              style={{
                marginTop: 20,
                padding: 15,
                alignItems: "center",
                zIndex: 10,
                position: "absolute",

                Bottom: 20,
                top: 238,

                backgroundColor: "#f7b733"
              }}
            >
              <Text style={{ color: "white" }}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* {end} */}
      </View>
    );
  }
}
