import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Text,
  View,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import config from './config';

const { width } = Dimensions.get('window');

const validUnderlineColor = null;
const invalidUnderlineColor = 'red';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name : '',
      client_email : '',
      password : '',
      password_confirmation : '',
      errors : [],
      underlineColor1 : validUnderlineColor,
      underlineColor2 : validUnderlineColor,
      underlineColor3 : validUnderlineColor,
      underlineColor4 : validUnderlineColor,
    }
  }

  focusNextField(nextField) {
    this.refs[nextField].focus();
  }

  passwordCheck() {
    if(this.state.password.length <= 7) {
      this.validateInput(3)
      ToastAndroid.show('비밀번호는 8자리이상 입력해주세요', ToastAndroid.LONG);
      return false;
    } else if(this.state.password !== this.state.password_confirmation) {
      this.validateInput(3);
      this.validateInput(4);
      ToastAndroid.show('비밀번호가 서로 동일하지 않습니다', ToastAndroid.LONG);
      return false;
    } else if(this.state.client_email.indexOf('@') === -1) {
      this.validateInput(1)
      ToastAndroid.show('이메일 형식이 올바르지 않습니다', ToastAndroid.LONG);
      return false;
    } else {
      return true;
    }
  }

  onValueChange(key: string, value: string) {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  }

  async _handlePress() {
    let result = this.passwordCheck();
    if(result) {
      try {
        let name = this.state.name;
        let email = this.state.client_email;
        let password = this.state.password;
        let response = await axios({
          url: config.serverUrl + '/client/signup/',
          method : 'post',
          data : {
            client_Email : email,
            client_PW : password,
            client_Name : name,
            billingInfo : '1234-1234-1234-1234',
            member : 1,
          }
        });
        console.log('response : ', response);
        let id_token = await response.body;
        console.log('id token : ', id_token);
        ToastAndroid.show('회원가입을 축하드립니다', ToastAndroid.SHORT)
        this.props.navigator.pop();
      } catch(error) {
        let errors = error.data.errors;
        let errorsArray = [];
        // let errorMessage = errors[0].message
        for (let key in errors) {
          if(errors[key].length > 1) {
            errors[key].message.map(error => errorsArray.push(`${key} ${error}`));
          } else {
            errorsArray.push(`${key} ${errors[key].message}`);
          }
        }
        this.setState({errors : errorsArray});
        console.log('fail to regitster in front : ', errorsArray);
      }
    }
  }

  validateInput(fieldIdx) {
      this.onValueChange('underlineColor'+fieldIdx, invalidUnderlineColor);
  }

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          Join us now!
        </Text>
        <TextInput
          ref='1'
          onChangeText={ (text)=> this.setState({client_email : text})}
          keyboardType='email-address'
          returnKeyType='next'
          onSubmitEditing={()=> this.focusNextField('2')}
          underlineColorAndroid={this.state.underlineColor1}
          style = {styles.input} placeholder='Email'
          autoFucus = {true}>
        </TextInput>
        <TextInput
          ref='2'
          onChangeText={ (text)=> this.setState({name: text}) }
          keyboardType='default'
          returnKeyType='next'
          onSubmitEditing={()=> this.focusNextField('3')}
          underlineColorAndroid={this.state.underlineColor2}
          style={styles.input} placeholder='Name'>
        </TextInput>
        <TextInput
          ref='3'
          onChangeText={ (text)=> this.setState({password: text}) }
          keyboardType='numbers-and-punctuation'
          returnKeyType='next'
          onSubmitEditing={()=> this.focusNextField('4')}
          underlineColorAndroid={this.state.underlineColor3}
          style={styles.input} placeholder='Password'
          secureTextEntry={true}>
        </TextInput>
        <TextInput
          ref='4'
          onChangeText={ (text)=> this.setState({password_confirmation: text}) }
          keyboardType='numbers-and-punctuation'
          returnKeyType='done'
          underlineColorAndroid={this.state.underlineColor4}
          style={styles.input} placeholder='Confirm Password'
          secureTextEntry={true}>
        </TextInput>

        <TouchableHighlight style={[styles.submitBtn]} onPress={() => this._handlePress()}>
          <Text style={styles.submitBtnText}>
            Register
          </Text>
        </TouchableHighlight>

        <Errors errors={this.state.errors}/>

    </View>
  )}
}

const Errors = (props) => {
  return (
    <View>
      {props.errors.map((error, i) => <Text key={i} style={styles.error}> {error} </Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'flex-start',
    alignItems : 'center',
    padding : 10,
    paddingTop : 80,
  },
  input : {
    height : 50,
    marginTop : 10,
    padding : 4,
    fontSize : 18,
    borderWidth : 1,
    borderColor : '#48bbec',
  },
  submitBtn: {
    width: width - 20,
    height: 56,
    overflow: 'hidden',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  submitBtnText: {
    fontSize: 22,
    color: 'white',
  },
  heading : {
    fontSize : 30,
  },
  error : {
    color : 'red',
    paddingTop : 10,
  },
});

export default Register;
