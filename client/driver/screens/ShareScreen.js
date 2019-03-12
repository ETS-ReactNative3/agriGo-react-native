import React from "react";
import {
  ScrollView,
  AsyncStorage,
  StyleSheet,
  RefreshControl,
  Text,
  View
} from "react-native";
import {
  Card,
  CardItem,
  Button,
  Content,
  Body,
  Right,
  Left
} from "native-base";
import List from "../components/ListCard";
const localip = "192.168.0.105";

export default class ShareScreen extends React.Component {
  state = { request: [], isLoading: true, refreshing: false };

  async componentDidMount() {
    this.fetchData();
  }
  async fetchData() {
    this.setState({ refreshing: true });
    let token = await AsyncStorage.getItem("jwt");
    console.log(token);
    let req = await fetch(`http://${localip}:3000/driver/requests`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`
      }
    });

    let res = await req.json();
    console.log(JSON.stringify(res));
    this.setState({ request: res, isLoading: false, refreshing: false });
  }
  renderList() {
    let list = this.state.request.bookInfo.map(item => {
      <List />;
    });
    console.log(list);
    return list;
  }

  render() {
    const { isLoading, refreshing } = this.state;
    console.log(this.state);
    return (
      <View style={styles.container}>
        <ScrollView
          style={{ marginTop: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.fetchData.bind(this)}
            />
          }
        >
          {!isLoading ? (
            this.state.request.map((item, i) => (
              <List
                id={item._id}
                navigation={this.props.navigation}
                data={item.bookInfo}
                resData={item}
                key={i}
              />
            ))
          ) : (
            <Text>isLoading</Text>
          )}
        </ScrollView>
        {/* <View>
          <Button
            onPress={() => {
              this.props.navigation.navigate("AuthLoader");
              AsyncStorage.clear();
            }}
          >
            <Text>LOGOUT</Text>
          </Button>
          <Text>ShareScreen</Text>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff"
  }
});
