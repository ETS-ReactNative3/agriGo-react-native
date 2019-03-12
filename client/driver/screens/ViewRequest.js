import React, { Component } from "react";
import { View, Text, AsyncStorage } from "react-native";
import {
  Container,
  Content,
  Card,
  CardItem,
  Button,
  Left,
  Right
} from "native-base";
const localip = "192.168.0.105";
export default class ViewScreen extends Component {
  state = { driverData: [], isLoading: false, userDetails: null };

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
    this.getUserData();
  }
  showUserInfo(data) {
    // return console.log(this.state.userDetails);
    if (this.state.userDetails !== null) {
      return (
        <View>
          <CardItem button>
            <Text>User Name:{data.bookedUser.username}</Text>
          </CardItem>
          <CardItem button>
            <Text>
              User Address:
              {this.state.userDetails.profileBio.address
                ? this.state.userDetails.profileBio.address
                : "empty"}
            </Text>
          </CardItem>
          <CardItem button>
            <Text>
              User Mobile No:
              {this.state.userDetails.profileBio.phoneNo !== null
                ? this.state.userDetails.profileBio.phoneNo
                : "empty"}
            </Text>
          </CardItem>
        </View>
      );
    }
  }

  async getUserData() {
    let token = await AsyncStorage.getItem("jwt");

    let userId = this.props.navigation.getParam("data", "null").bookedUser.id;
    console.log("from request " + userId);
    fetch(`http://${localip}:3000/driver/${userId}`, {
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
          this.setState({ ...this.state, userDetails: data });
        });
      })
      .catch(() => alert("Cannot send ID"));
  }

  render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam("itemId", "NO-ID");
    const data = navigation.getParam("data", "null");

    console.log("view Request Data", data.bookedUser.id);

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
            <CardItem>
              {data.decision ? this.showUserInfo(data) : null}
            </CardItem>
          </Card>
        </Content>
      </View>
    );
  }
}
