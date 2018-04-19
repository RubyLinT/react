'use strict';
import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  VrButton,
  NativeModules,
} from 'react-vr';
const CubeModule = NativeModules.CubeModule;
class CubeSample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {btnColor: 'white', cubeColor: 'yellow'};
    CubeModule.changeCubeColor(this.state.cubeColor);
  }
  render() {
    return (
      <View
        style={{
          transform:[{translate: [0, 0, -3]}],
          layoutOrigin: [0.5, 0, 0],
          alignItems: 'center',
        }}>
        <Pano source={asset('chess-world.jpg')}/>
        <VrButton
          style={{
            backgroundColor: this.state.btnColor,
            borderRadius: 0.05,
            margin: 0.05,
          }}
          onEnter={()=>{this.setState({btnColor: this.state.cubeColor})}}
          onExit={()=>{this.setState({btnColor: 'white'})}}
          onClick={()=>{
            let hexColor = Math.floor(Math.random()*0xffffff).toString(16);
            hexColor = '#'+(('000000'+hexColor).slice(-6));
            this.setState({cubeColor: hexColor, btnColor: hexColor});
            CubeModule.changeCubeColor(hexColor);
          }}
          onClickSound={asset('freesound__146721__fins__menu-click.wav')}
          onEnterSound={asset('freesound__278205__ianstargem__switch-flip-1.wav')}
        >
          <Text style={{
            fontSize: 0.15,
            paddingTop: 0.025,
            paddingBottom: 0.025,
            paddingLeft: 0.05,
            paddingRight: 0.05,
            textAlign:'center',
            textAlignVertical:'center',
          }}>
            button
          </Text>
        </VrButton>
      </View>
    );
  }
};

AppRegistry.registerComponent('CubeSample', () => CubeSample);


