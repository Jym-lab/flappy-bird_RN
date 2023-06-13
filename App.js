import {Modal, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import entities from './entities';
import Physics from './physics';
import {ImageBackground} from 'react-native';
import axios from 'axios';

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [board, setBoard] = useState([]);
  useEffect(() => {
    setRunning(false);
  }, []);
  useEffect(() => {
    if (modalVisible) {
      fetchScores();
    }
  }, [modalVisible]);

  const fetchScores = async () => {
    const url = 'http://34.64.60.65/get_scores.php'; // 서버 URL 수정
    try {
      const response = await axios.get(url);
      setBoard(response.data.scores);
    } catch (error) {
      console.error(`데이터를 가져오는 중 오류가 발생했습니다: ${error}`);
    }
  };
  const renderScores = () => {
    return board.map(board => (
      <View key={board.rank} style={{flexDirection: 'row'}}>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'black',
            fontSize: 30,
            marginHorizontal: 30,
            marginVertical: 10,
          }}>
          {board.rank}위
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 30,
            marginHorizontal: 30,
            marginVertical: 10,
          }}>
          {board.score}점
        </Text>
      </View>
    ));
  };
  return (
    <ImageBackground
      source={require('./img/test.png')}
      style={{flex: 1, elevation: -1}}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 40,
          fontWeight: 'bold',
          margin: 20,
          color: 'white',
        }}>
        {currentPoints}
      </Text>
      <GameEngine
        ref={ref => {
          setGameEngine(ref);
        }}
        systems={[Physics]}
        entities={entities()}
        running={running}
        onEvent={e => {
          switch (e.type) {
            case 'game_over':
              setRunning(false);
              gameEngine.stop();
              break;
            case 'new_point':
              setCurrentPoints(currentPoints + 1);
              break;
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <StatusBar style="auto" hidden={true} />
      </GameEngine>
      {!running ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 3,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'black',
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
            onPress={() => {
              setCurrentPoints(0);
              setRunning(true);
              gameEngine.swap(entities());
            }}>
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 30}}>
              START GAME
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'black',
              paddingHorizontal: 30,
              paddingVertical: 10,
              marginTop: 20,
            }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 30}}>
              SCORE BOARD
            </Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
                Score Board
              </Text>
              {renderScores()}
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                  marginTop: 20,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text
                  style={{fontWeight: 'bold', color: 'white', fontSize: 30}}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      ) : null}
    </ImageBackground>
  );
}
