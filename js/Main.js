'use strict';

import React, { Component } from 'react';
import { StyleSheet, PixelRatio, Dimensions, View, Text } from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroPolyline,
  ViroMaterials,
  ViroSphere,
  ViroNode,
  ViroSpotLight,
} from 'react-viro';

export default class Main extends Component {
  constructor() {
    super();

    // Set initial state here
    this.state = {
      text: '',
      x: 0,
      y: 0,
      z: 0,
      camCoords: [],
      position: [],
      coords: [],
      lines: [],
      painting: false,
    };
    this.cameraRef = React.createRef();
    this.sphereRef = React.createRef();
    // bind 'this' to functions
    // this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
    this._onClickState = this._onClickState.bind(this);
  }

  componentDidMount() {
    setInterval(() => {
      this.cameraRef.current
        .getCameraOrientationAsync()
        .then(orientation => {
          this.setState(prevState => ({
            x: orientation.forward[0] * 10,
            y: orientation.forward[1] * 10,
            z: orientation.forward[2] * 10,
            camCoords: orientation.forward,
          }));
          if (this.state.painting) {
            if (this.state.coords.length) {
              this.setState(prevState => ({
                coords: [
                  ...prevState.coords,
                  [this.state.x, this.state.y, this.state.z],
                ],
              }));
            } else {
              this.setState(prevState => ({
                coords: [[this.state.x, this.state.y, this.state.z]],
                position: [this.state.x, this.state.y, this.state.z],
              }));
            }
          }
        })
        .catch(error => console.error(error));
    }, 10); // 100 ms
  }
  _onClickState(stateValue, position, source) {
    switch (stateValue) {
      case 1:
        this.setState(prev => ({
          painting: true,
          coords: [[prev.x, prev.y, prev.z]],
        }));
        break;
      case 2:
        this.setState(prevState => {
          return {
            painting: false,
            lines: [
              ...prevState.lines,
              {
                points: [...prevState.coords],
                position: [prevState.x, prevState.y, prevState.z],
              },
            ],
            coords: [],
          };
        });
        break;
      case 3:
        break;
      default:
    }
  }

  render() {
    return (
      <ViroARScene
        ref={this.cameraRef}
        // onTrackingUpdated={this._onTrackingUpdated}
        onClickState={this._onClickState}
      >
        <ViroText
          text={`position ${this.state.position}`}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          style={styles.helloWorldTextStyle}
        />
        <ViroSphere
          ref={this.sphereRef}
          heightSegmentCount={10}
          widthSegmentCount={10}
          radius={0.25}
          position={[this.state.x, this.state.y, this.state.z]}
          transformBehaviors={'billboardY'}
        />
        {this.state.coords.length ? (
          <ViroPolyline
            points={this.state.coords}
            thickness={0.4}
            // position={this.state.position}
            // position={[0, 0, -5]}
            // materials={'rainbow'}
            // transformBehaviors={'billboardY'}
          />
        ) : (
          <ViroText text={''} />
        )}
        {this.state.lines.map(line => {
          return (
            <ViroPolyline
              key={line.points[0]}
              points={line.points}
              // position={line.position}
              // position={this.state.position}
              // position={[0, 0, -5]}
              // transformBehaviors={'billboardY'}
              thickness={0.4}
            />
          );
        })}
      </ViroARScene>
    );
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 10,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

ViroMaterials.createMaterials({
  rainbow: {
    shininess: 2.0,
    lightingModel: 'Lambert',
    diffuseTexture: require('./res/rainbow_texture.jpg'),
  },
});

module.exports = Main;