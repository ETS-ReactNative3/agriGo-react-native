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
    return (
      <View style={{ height: 80 }}>
        <Content>
          <Card>
            <CardItem button>
              <Left>
                <Text>Machinery:{this.props.data.MachineryName}</Text>
              </Left>

              <Right>
                <Button
                  onPress={() => {
                    if (this.props.data !== undefined) {
                      this.props.navigation.navigate("ViewScreen", {
                        itemId: this.props.id,
                        data: this.props.data
                      });
                    }
                  }}
                  style={{ padding: 10, backgroundColor: "#ffa700" }}
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
