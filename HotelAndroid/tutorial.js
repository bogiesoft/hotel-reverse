import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet,
  ViewPagerAndroid,
} from 'react-native'

let pages = [];
let button ;

class ToturialPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      animationsAreEnabled: true,
      scrollEnabled: true,
      progress: {
        offset: 0,
        position: 0
      },
    }
  }

  onPageScroll(e) {
    this.setState({progress: e.nativeEvent}) // offset : place, position : key value of page
  }

  // onPageScrollStateChanged (state : ViewPagerScrollState) {
  //   console.log('onPageScrollStateChanged :', state)
  //   this.setState({scrollState: state}); // state : idle, dagging, settling
  // }

  async _handlePress (where) {
    await AsyncStorage.setItem('tutorial','true')
    this.props.navigator.push({id : where});
  }

  loadPage(i) {
    if(i===0) {
      pages.push(
        <View key={0} collapsable={false}>
          <Image
            style={styles.image}
            source={require('./assets/bg_1.jpg')}
          />
        </View>
      )
    } else if (i===1){
      pages.push(
        <View key={1} collapsable={false}>
          <Image
            style={styles.image}
            source={require('./assets/bg_2.jpg')}
          />
        </View>
      )
    } else if (i===2){
      pages.push(
        <View key={2} collapsable={false}>
          <Image
            style={styles.image}
            source={require('./assets/bg_3.jpg')}
          />
        </View>
      )
    } else if (i===3){
      pages.push(
        <View key={3} collapsable={false}>
          <Image
            style={styles.image}
            source={require('./assets/bg_4.jpg')}
          />
        </View>
      )
    } else if (i===4){
      pages.push(
        <View key={4} collapsable={false}>
          <Image
            style={styles.image}
            source={require('./assets/bg_5.jpg')}
          />
        </View>
      )
    }
  }

  showButton() {
    if(this.state.progress.position === 4) {
      button = (<TouchableHighlight
          onPress = {()=>this._handlePress('search')}
          >
          <Text style={styles.text}>호텔리버스 시작하기 ➜</Text>
        </TouchableHighlight>)
    }
  }

  componentWillMount() {
    for(let i=0; i<5; i++) {
      this.loadPage(i)
    }
  }

  render() {
    this.showButton();
    return (
      <View style = {styles.container}>
        <ViewPagerAndroid
          style={styles.viewPager}
          initialPage={0}
          onPageScroll = {this.onPageScroll.bind(this)}
          scrollEnabled = {this.state.scrollEnabled}
          pageMargin = {0}
          ref = {(viewPager) => {this.viewPager = viewPager;}}>
        {pages}
        </ViewPagerAndroid>
        {button}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex : 1,
    resizeMode : 'cover',
    width : null,
    height : null,
  },
  viewPager: {
    flex: 1,
  },
  text: {
    flex : 1,
    fontSize : 20,
    textAlign : 'center',
    fontWeight : 'bold',
    fontFamily : 'sans-serif',
  }
});

export default ToturialPage;
