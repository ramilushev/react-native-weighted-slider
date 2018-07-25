import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import WeightedSlider from 'react-native-weighted-slider'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  state = {
    value: 5,
    minValue: 12,
    maxValue: 1234567
  }
  
  initialValue = 1000
  
  componentDidMount = () => {
    this.setState(() => ({ value: this.initialValue }))
  }
  
  onValueChange = value => this.setState({ value })
  
  increaseMin = () => this.setState(({ minValue }) => ({ minValue: minValue + 10 }))
  
  increaseMax = () => this.setState(({ maxValue }) => ({ maxValue: maxValue + 10 }))
  
  render() {
    const { value, minValue, maxValue } = this.state
        
    return (
      <View style={styles.container}>
        <Text>{`minValue ${minValue}`}</Text>
        <Text>{`maxValue ${maxValue}`}</Text>
        <Text style={styles.value}>{value}</Text>
        <WeightedSlider
          initialValue={this.initialValue}
          minValue={minValue}
          maxValue={maxValue}
          useLinearSteps={false}
          step={1}
          weight={1}
          quantize={5}
          onValueChange={this.onValueChange}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.increaseMin}>
            <Text>minValue + 10</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.increaseMax}>
            <Text>maxValue + 10</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    padding: 20
  },
  value: {
    textAlign: 'center',
    marginBottom: 50,
    fontSize: 40,
    color: 'teal'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  }
});
