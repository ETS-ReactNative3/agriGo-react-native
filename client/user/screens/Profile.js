import React from "react";
import {
  ScrollView,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";
import {
  Label,
  Icon,
  Item,
  Input,
  Content,
  Textarea,
  Button,
  Card,
  CardItem,
  List,
  ListItem,
  Body,
  Thumbnail
} from "native-base";
import { ImagePicker } from "expo";

const localip = "192.168.0.105";
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: "",
        address: "",
        phoneNo: "",
        image:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
      },
      progress: Dimensions.get("window").width - 100
    };
    this.onValueChangeName = this.onValueChangeName.bind(this);
    this.onValueChangeAddress = this.onValueChangeAddress.bind(this);
    this.onValueChangeNumber = this.onValueChangeNumber.bind(this);
    this._pickImage = this._pickImage.bind(this);
    this._handleAdd = this._handleNext.bind(this);
  }

  onClickNext() {
    this.props.navigation.navigate("Home");
  }

  onValueChangeName(e) {
    let state = { ...this.state };
    state.value.name = e;

    this.setState({ state });
  }
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    console.log(result);

    if (!result.cancelled) {
      let state = { ...this.state };
      state.value.image = result.uri;
      this.setState({ state });
    }
  };

  onValueChangeAddress(e) {
    let state = { ...this.state };
    state.value.address = e;
    this.setState({ state });
  }

  onValueChangeNumber(e) {
    let state = { ...this.state };
    state.value.phoneNo = e;
    this.setState({ state });
  }

  _handleNext = async value => {
    let token = await AsyncStorage.getItem("jwt");
    const data = {
      name: this.state.value.name,
      address: this.state.value.address,
      phoneNo: this.state.value.phoneNo
    };
    console.log(data);
    const json = JSON.stringify(data);
    fetch(`http://${localip}:3000/user/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `JWT ${token}`
      },
      body: json
    })
      .then(response => response.json())
      .then(res => {
        if (res.error) {
          alert(res.error);
        } else {
          alert(res.message);

          // Redirect to home screen
          // this.props.navigation.navigate("Home");
        }
      })
      .catch(e => {
        console.log("errororo", e);
        alert("There was an error logging in.");
      })
      .done();
  };

  render() {
    const progress = this.state.progress;

    return (
      <View style={styles.container}>
        {/* <Button onPress={()=>{this.props.navigation.navigate("AuthLoader");AsyncStorage.clear();}} title="logout" /> */}
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <TouchableHighlight onPress={this._pickImage}>
            <Thumbnail
              style={{ width: 120, height: 120, borderRadius: 100 }}
              size={50}
              source={{
                uri: this.state.value.image
              }}
            />
          </TouchableHighlight>
          <View style={{ marginTop: 5 }}>
            <Text style={{ fontSize: 25 }}>Stark</Text>
          </View>
        </View>
        <View>
          <View
            style={{
              height: 7,
              borderRadius: 20,
              marginTop: 0,
              width: 320,
              backgroundColor: "#ffa700"
            }}
          />
          {/* <Text style={{ textAlign: "left" }}>10%</Text> */}
        </View>
        <ScrollView style={{ flex: 2, marginTop: 50 }}>
          <View style={{ flex: 1 }}>
            <Card>
              <List>
                <ListItem>
                  <Item>
                    <Input
                      onChangeText={this.onValueChangeName}
                      placeholder="Name"
                    />
                  </Item>
                </ListItem>
                <ListItem>
                  <Item>
                    <Input
                      onChangeText={this.onValueChangeAddress}
                      placeholder="Enter Address"
                    />
                  </Item>
                </ListItem>
                <ListItem>
                  <Item>
                    <Input
                      keyboardType="number-pad"
                      maxLength={10}
                      onChangeText={this.onValueChangeNumber}
                      placeholder="Enter PhoneNo"
                    />
                  </Item>
                </ListItem>
              </List>
            </Card>
          </View>
        </ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            onPress={this._handleNext}
            style={{
              flex: 1,
              marginHorizontal: 5,
              backgroundColor: "#ffa700",
              height: 40,
              elevation: 3,
              marginVertical: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              marginHorizontal: 5,
              backgroundColor: "#ffa700",
              height: 40,
              elevation: 3,
              marginVertical: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  }
});
