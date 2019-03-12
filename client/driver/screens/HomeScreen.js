import React from "react";
import Book from "../components/bookingForm";
import Map from "../components/Map";
import RequestModal from "../drivercomponents/RequestModal";
import {
  View,
  HeaderBarItem,
  StatusBar,
  AsyncStorage,
  ToastAndroid
} from "react-native";
import { Container, Text, Button, Content, Input, Item } from "native-base";
import MapSearch from "../components/mapSearch";
import io from "socket.io-client";
console.ignoredYellowBox = ["Remote debugger"];
const localip = "192.168.0.105";
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.activeSocket = false;
    this.state = {
      requestModal: false,
      bookInfo: [],
      currentReqId: "0",
      tempBookInfo: null
    };
  }

  async processResponse(action) {
    this.setState({ ...this.state, requestModal: false });

    console.log("processing response");
    const data = {
      decision: action.toString()
    };
    let token = await AsyncStorage.getItem("jwt");
    // Serialize and post the data
    const json = JSON.stringify(data);
    fetch(
      `http://${localip}:3000/driver/${this.state.currentReqId}/decision `,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `JWT ${token}`
        },
        body: json
      }
    )
      .then(response => response.json())
      .then(res => {
        console.log(res);
        ToastAndroid.show(res.message, ToastAndroid.LONG);
        this.setState({
          ...this.state,
          bookInfo: [...this.state.bookInfo, this.state.tempBookInfo],
          tempBookInfo: null
        });
      })
      .catch(error => {
        console.log(error);
      })
      .done();
  }

  async sendUserId() {
    let token = await AsyncStorage.getItem("jwt");
    fetch(`http://${localip}:3000/driver/getuser`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`
      }
    })
      .then(res => {})
      .catch(() => alert("Cannot send ID"));
  }

  async updateSocketId(socketId) {
    let token = await AsyncStorage.getItem("jwt");
    try {
      let response = await fetch(`http://${localip}:3000/driver/updateSocket`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`
        },
        body: JSON.stringify({ driverSocketId: socketId })
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
        "Connected with id: " +
          this.socket.id +
          " sending fetch to /updateSocket"
      );
      this.updateSocketId(this.socket.id);
      this.socket.on("new-booking", data => {
        console.log("new booking data: ", data);
        this.setState({
          ...this.state,
          requestModal: true,
          currentReqId: data.bookingData._id,
          tempBookInfo: data.bookingData
        });
      });
    });
    this.socket.on("server", data => {
      this.socket.emit("client", "Hi");
      console.log(data);
    });
    this.socket.on("disconnect", function() {
      this.activeSocket = false;
      console.log("driver disconnected");
    });
  }

  render() {
    if (!this.activeSocket) {
      this.sendUserId();
      this.connectSocket();
      console.log("Connectng from render");
    }
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="red" />
        <Map socket={this.socket} />
        {this.state.requestModal ? (
          <RequestModal
            onResponse={action => {
              console.log("on response recived action " + action);
              this.processResponse(action);
            }}
            requestId={this.state.currentReqId}
          />
        ) : null}
      </View>
    );
  }
}
