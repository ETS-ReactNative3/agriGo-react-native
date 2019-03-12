import React, { Component } from "react";
import { View, Text } from "react-native";
import {
  Container,
  Content,
  Card,
  CardItem,
  Button,
  Left,
  Right
} from "native-base";
import { AsyncStorage } from "react-native";
const localip = "192.168.0.105";

export default class ViewScreen extends Component {
  state = { driverData: [], isLoading: false, driverDetails: null };

  async fetchData() {
    let token = await AsyncStorage.getItem("jwt");
    console.log(token);
    let req = await fetch("https://agrigo.herokuapp.com/user/requests", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`
      }
    });

    let res = await req.json();
    this.setState({ driverData: res, isLoading: false });
  }

  componentDidMount() {
    this.getDriverData();
  }

  showDriverInfo(data) {
    if (this.state.driverDetails !== null) {
      return (
        <View>
          <CardItem button>
            <Text>Driver Name:{data.acceptedDriver.username}</Text>
          </CardItem>
          <CardItem button>
            <Text>
              Driver Address:
              {this.state.driverDetails.profileBio.address
                ? this.state.driverDetails.profileBio.address
                : "empty"}
            </Text>
          </CardItem>
          <CardItem button>
            <Text>
              Driver Mobile No:
              {this.state.driverDetails.profileBio.phoneNo !== null
                ? this.state.driverDetails.profileBio.phoneNo
                : "empty"}
            </Text>
          </CardItem>
        </View>
      );
    }
  }

  async getDriverData() {
    let token = await AsyncStorage.getItem("jwt");
    let driverId = this.props.navigation.getParam("data", "null").acceptedDriver
      .id._id;
    console.log("from request " + driverId);
    fetch(`http://${localip}:3000/user/${driverId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`
      }
    })
      .then(res => {
        res.json().then(data => {
          console.log("ok driver data recieved " + res);
          this.setState({ ...this.state, driverDetails: data });
        });
      })
      .catch(() => alert("Cannot send ID"));
  }

  render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam("itemId", "NO-ID");
    const data = navigation.getParam("data", "null");

    return (
      <View style={{ flex: 1 }}>
        <Content>
          <Card>
            <CardItem button>
              <Left>
                <Text>Machinery:{data.MachineryName}</Text>
              </Left>
            </CardItem>
            <CardItem button>
              <Text>Date:{new Date(data.startTimestamp).toDateString()}</Text>
            </CardItem>
            <CardItem button>
              <Text>Status:{data.decision ? "approved" : "pending"}</Text>
            </CardItem>
            {data.decision ? this.showDriverInfo(data) : null}
          </Card>
        </Content>
      </View>
    );
  }
}
