import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  AsyncStorage,
  ToastAndroid,
  Dimensions,
} from 'react-native'

import axios from 'axios'
import config from './config';

const validUnderlineColor = null;
const invalidUnderlineColor = 'red';
const { width } = Dimensions.get('window');

class NonmemberSignin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client_Email : '',
      name : '',
    }

  }

  movePage(){
    let naviArr = this.props.navigator.getCurrentRoutes();
    if(naviArr[naviArr.length-3].id==='bid') {
      this.props.navigator.push({id : 'bidInfo'});
    } else {
      this.props.navigator.push({id : 'search'})
    }
  }

  async _handlePress() {
    console.log('i am here');
    try {
      let email = this.state.client_Email;
      let name = this.state.name;
      let response = await axios({
        url : config.serverUrl + '/client/signup/',
        method : 'post',
        data : {
          client_Email : email,
          client_Name : name,
          client_PW : 'codestates',
          billingInfo : '1234-1234-1234-1234',
          member : 0,
        }
      })
      console.log('response: ',response);
      await AsyncStorage.setItem('id_token','temp');
      await AsyncStorage.setItem('client_Email', email);
      ToastAndroid.show('비회원 로그인에 성공하였습니다', ToastAndroid.SHORT);
      this.props.naviView();
    } catch(err) {
      console.log('Nonmember signin error', err)
    }
    var id_token = await AsyncStorage.getItem('id_token');
    if(id_token) {
      this.movePage();
    } else {
      ToastAndroid.show('이메일을 다시 확인해주세요', ToastAndroid.SHORT);
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          Enjoy Hotel-Reverse
        </Text>
        <TextInput
          ref='1'
          onChangeText={ (text)=> this.setState({client_Email: text}) }
          keyboardType='email-address'
          returnKeyType='next'
          onSubmitEditing={()=> this.focusNextField('2')}
          style={styles.input} placeholder="이메일">
        </TextInput>
        <TextInput
          ref='2'
          onChangeText={ (text)=> this.setState({name: text}) }
          keyboardType='default'
          returnKeyType='done'
          style={styles.input}
          placeholder="이름">
        </TextInput>

        <View style={{marginTop: 20}}>
          <View style={styles.padding}>
            <TouchableHighlight onPress={()=>this._handlePress()} style={styles.submitBtn}>
              <Text style={styles.buttonText}>
                비회원 로그인
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    paddingTop: 80
  },
  input: {
    height: 50,
    marginTop: 30,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  },
  padding: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  submitBtn: {
    width: width-20,
    height: 56,
    overflow: 'hidden',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  heading: {
    fontSize: 30,
  },
});

export default NonmemberSignin;
