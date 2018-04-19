import React from 'react';
import {
    AppRegistry,
    asset,
    Pano,
    Text,
    View,
    VrButton
} from 'react-vr';
import {StyleSheet} from 'react-native';
import {Animated} from 'react-vr'
const styles = StyleSheet.create({
    blue:{
        color: '#0cc',
    //   fontWeight: 'bold',
      fontSize:1,
      backgroundColor: '#ccc',
      layoutOrigin: [0.5, 0.5],
      transform: [
          { translate: [0, 0, -6]},
        //   {rotateY:80}
        ],
      paddingLeft: 0.2,
      paddingRight: 0.2,
      textAlignVertical: 'center',
      textAlign: 'center',
    } 
})
export default class reactVR extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bounceValue: new Animated.Value(0),
            backgroundColor:'rgba(181, 228, 249, 0.68)',
            backImg:'chess-world.jpg'
        }
    }
    render() {
        return (
           <View>
            <Pano source = { asset(this.state.backImg) }/> 
            <Text style={styles.blue} 
             onEnter={() => {
                 console.log('enter')
                 this._an1();
                }}
            onExit={() => {
                console.log('exit')
                this._an2();
            }}
            // onMove={() => console.log('move')}
            // onInput={() => console.log('input')}
            onClick={() => {
                console.log('hhhh')
                // this._an1();
            }}
            onPress={() => {
                console.log('哈哈哈')
            }}
            >1213</Text>
            <Animated.Image
                source={{uri:'http://i.imgur.com/XMKOH81.jpg'}}
                style={{
                    flex:1,
                    width:1,
                    height:1,
                    transform:[
                        {scale:this.state.bounceValue},
                        { translate: [0, 0, -6]},
                    ]
                }}
            />
            <VrButton style={{
                backgroundColor: this.state.backgroundColor,  
                width:0.5,
                height:0.5,
                borderRadius:0.5,
                paddingLeft: 0,
                paddingRight: 0,
                layoutOrigin: [0.5, 0.5],
                transform: [
                    { translate: [1.5,2.2, 3] },
                    {rotateY: 180}
                ],
            }}
            onEnter={() => {
                this.setState({backgroundColor:'#7fbdd8'})
            }}
            onExit={() => {
                this.setState({backgroundColor:'rgba(181, 228, 249, 0.68)'})
            }}
            onClick={() => {
                console.log('qwe');
                this.setState({backImg:'chess-world2.jpg'})
            }}>
            <Text style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 0.2,
                width:0.5,
                height:0.5,
                borderRadius:0.5,
                paddingLeft: 0,
                paddingRight: 0,
            }}>ONE</Text>
            </VrButton>
            
            </View>
        );
    }
    componentDidMount() {
        this._an2();                    
    }
    _an2() {
        this.state.bounceValue.setValue( 1.5);                         
         Animated.spring(
            this.state.bounceValue,           
            {
                toValue: 0.8,                    
                friction:  10 ,                    
            }
        ).start();   
    }
    _an1() {
        Animated.timing(
          this.state.bounceValue,
          {
            toValue: 1,
            duration: 500,
          }
        ).start();
      }
};

AppRegistry.registerComponent('reactVR', () => reactVR);