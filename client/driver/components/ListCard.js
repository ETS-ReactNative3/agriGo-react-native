import React, { Component } from "react";
import { View, Text, RefreshControl } from "react-native";
import {
  Container,
  Content,
  Card,
  CardItem,
  Button,
  Left,
  Right
} from "native-base";

export default class List extends Component {
  render() {
    console.log("prop data", JSON.stringify(this.props.data));
    return (
      <View style={{ height: 80 }}>
        <Content>
          <Card>
            <CardItem button onPress={() => alert("This is Card Body")}>
              <Left>
                <Text>Machinery:{this.props.data.MachineryName}</Text>
              </Left>

              <Right>
                <Button
                  onPress={() =>
                    this.props.navigation.navigate("ViewScreen", {
                      itemId: this.props.id,
                      data: this.props.data
                    })
                  }
                  style={{ padding: 10, backgroundColor: "#f7b733" }}
                >
                  <Text style={{ color: "white" }}>View Request</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </View>
    );
  }
}
