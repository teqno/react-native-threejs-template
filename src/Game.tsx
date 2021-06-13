import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";
import React, { useEffect } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import * as THREE from "three";
import { ObjectLoader } from "three";

const textureFile =
  "https://threejsfundamentals.org/threejs/resources/images/star.png";

interface OwnProps {
  isRunning: boolean;
}

const scene = new THREE.Scene();

let objects: {
  [key: string]: THREE.Object3D | undefined;
} = {};

let isMovingLeft = false;
let isMovingRight = false;

const vertices = [
  // front
  { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0] }, // 0
  { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0] }, // 1
  { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1] }, // 2
  { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1] }, // 3
  // right
  { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0] }, // 4
  { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0] }, // 5
  { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1] }, // 6
  { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1] }, // 7
  // back
  { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0] }, // 8
  { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0] }, // 9
  { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1] }, // 10
  { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1] }, // 11
  // left
  { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0] }, // 12
  { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0] }, // 13
  { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1] }, // 14
  { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1] }, // 15
  // top
  { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0] }, // 16
  { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0] }, // 17
  { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1] }, // 18
  { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1] }, // 19
  // bottom
  { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0] }, // 20
  { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0] }, // 21
  { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1] }, // 22
  { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1] }, // 23
];

const Game: React.FC<OwnProps> = ({ isRunning }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const classes = styles({ isRunning, windowWidth, windowHeight });

  useEffect(() => {
    if (isRunning) {
      const geometry = new THREE.BoxGeometry();
      objects.player = makeInstance(
        geometry,
        0x44aa88,
        new THREE.Vector3(0, 1, 0)
      );
    } else {
      objects.player = undefined;
    }
  }, [isRunning]);

  const makeInstance = (
    geometry: THREE.ShapeGeometry,
    color: string | number | THREE.Color | undefined,
    position: THREE.Vector3,
    texture?: THREE.Texture
  ): THREE.Object3D => {
    const material = new THREE.MeshPhongMaterial({
      color,
      map: texture ?? null,
    });

    const object = new THREE.Mesh(geometry, material);
    scene.add(object);

    object.position.fromArray(position.toArray());

    return object;
  };

  const moveObjectLeft = (object: THREE.Object3D) => {
    object.position.x -= 0.1;
  };

  const moveObjectRight = (object: THREE.Object3D) => {
    object.position.x += 0.1;
  };

  const handleEvents = (isMovingLeft: boolean, isMovingRight: boolean) => {
    if (!objects.player) {
      return;
    }

    if (isMovingLeft && !isMovingRight) {
      moveObjectLeft(objects.player);
    } else if (!isMovingLeft && isMovingRight) {
      moveObjectRight(objects.player);
    }
  };

  const onGLContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    // 1. Scene
    // L17

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );

    // 3. Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const positions = [];
    const normals = [];
    const uvs = [];
    for (const vertex of vertices) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }

    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(positions),
        positionNumComponents
      )
    );
    geometry.setAttribute(
      "normal",
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
    );
    geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)
    );

    geometry.setIndex([
      0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7, 8, 9, 10, 10, 9, 11, 12, 13, 14, 14,
      13, 15, 16, 17, 18, 18, 17, 19, 20, 21, 22, 22, 21, 23,
    ]);

    const loader = new TextureLoader();
    const texture = loader.load(textureFile);

    objects = {
      obj1: makeInstance(
        geometry,
        0x44aa88,
        new THREE.Vector3(0, 0, 0),
        texture
      ),
    };

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    camera.position.z = 5;

    const animate = (time: number) => {
      handleEvents(isMovingLeft, isMovingRight);

      time *= 0.001;

      Object.values(objects).forEach((object, ndx) => {
        if (!object) {
          return;
        }

        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        object.rotation.x = rot;
        object.rotation.y = rot;
      });

      renderer.render(scene, camera);
      gl.endFrameEXP();

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const handleLeftButtonPress = () => {
    isMovingLeft = true;
  };

  const handleLeftButtonRelease = () => {
    isMovingLeft = false;
  };

  const handleRightButtonPress = () => {
    isMovingRight = true;
  };

  const handleRightButtonRelease = () => {
    isMovingRight = false;
  };

  return (
    <View>
      <GLView style={classes.glView} onContextCreate={onGLContextCreate} />
      {isRunning && (
        <View style={classes.controlsContainer}>
          <Pressable
            onPressIn={handleLeftButtonPress}
            onPressOut={handleLeftButtonRelease}
            style={classes.controlButton}
          >
            <Text style={classes.controlButtonText}>Left</Text>
          </Pressable>
          <Pressable
            onPressIn={handleRightButtonPress}
            onPressOut={handleRightButtonRelease}
            style={classes.controlButton}
          >
            <Text style={styles({}).controlButtonText}>Right</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = ({ windowWidth, windowHeight, isRunning }: any) =>
  StyleSheet.create({
    glView: {
      width: isRunning ? windowWidth : windowWidth * 0.8,
      height: isRunning ? windowHeight : windowHeight * 0.8,
    },
    controlsContainer: {
      position: "absolute",
      width: "100%",
      left: 0,
      bottom: 0,
      flexWrap: "nowrap",
      flexDirection: "row",
    },
    controlButton: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 100,
      paddingHorizontal: 32,
      flexGrow: 1,
      // Debug positioning
      backgroundColor: "#F00",
      borderColor: "#0FF",
      borderWidth: 1,
    },
    controlButtonText: {
      color: "#FFF",
    },
  });

export default Game;
