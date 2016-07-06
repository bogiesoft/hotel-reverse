import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  BackAndroid,
  DrawerLayoutAndroid,
  View,
  StyleSheet,
  AsyncStorage,
  ListView,
  RecyclerViewBackedScrollView,
  TouchableHighlight,
  Text,
} from 'react-native';
import ToolbarAndroid from 'ToolbarAndroid';


import NonmemberSignin from './nonmemberSignin';
import SplashPage from './splash';
import TutorialPage from './tutorial';
import HotelSearch from './hotelSearch';
import HotelBid from './hotelBid';
import GetLatestBidInfo from './getLatestBidInfo';
import ThanksALot from './thanksALot';
import HotelSignin from './hotelSignin';
import Register from './register';
import MyPage from './myPage';

import { GoogleSignin } from 'react-native-google-signin';

let _navigator;
let _toolBar;

class HotelAndroid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flag : false,
      searchData: {
        mainArea_Name : '',
        checkIn_Date : '체크인 날짜 선택',
        checkOut_Date : '체크아웃 날짜 선택',
        room_Number: 1
      },
      bidData: {
        hotel_Rate : 3,
        subArea_Name : '강남',
        bid_Price : 35000
      },
    };

    this._googleSignOut = this._googleSignOut.bind(this);
    this.flagStateChanged = this.flagStateChanged.bind(this);
    this.searchStateChanged = this.searchStateChanged.bind(this);
    this.bidStateChanged = this.bidStateChanged.bind(this);
    this.navigatorRenderScene = this.navigatorRenderScene.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.renderMenuItem = this.renderMenuItem.bind(this);
    this._pressRow = this._pressRow.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.addBackPressEventListener = this.addBackPressEventListener.bind(this);
  }

  flagStateChanged(flag) {
    this.setState({
      flag : flag,
    })
  }

  searchStateChanged(mainArea_Name, checkIn_Date, checkOut_Date, room_Number) {
    let searchData = {

      mainArea_Name : mainArea_Name,
      checkIn_Date : checkIn_Date,
      checkOut_Date : checkOut_Date,
      room_Number: room_Number
    };
    this.setState({
      searchData : searchData,
    });
  }

  bidStateChanged(hotel_Rate, subArea_Name, bid_Price) {
    let bidData = {
      hotel_Rate : hotel_Rate,
      subArea_Name : subArea_Name,
      bid_Price : bid_Price,
    };
    this.setState({
      bidData: bidData,
    });
  }

  _googleSignOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({client_Email: null});
    })
    .done();
  }

  async _signOut() {
    try {
      await AsyncStorage.removeItem('id_token');
      await AsyncStorage.removeItem('client_Email');
      let check = await AsyncStorage.getItem('googlesignin')
      if (check === 'true') {
        this._googleSignOut();
        await AsyncStorage.removeItem('googlesignin');
      }
    } catch(error) {
      console.log('signout error : ', error);
    }
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
    case 'splash':
      return (<SplashPage navigator={navigator} />);
    case 'search':
      return (<HotelSearch navigator={navigator} onChange={this.searchStateChanged} onFlagChange={this.flagStateChanged} />);
    case 'bid':
      return (<HotelBid navigator={navigator} onChange={this.bidStateChanged} searchData={this.state.searchData}/>);
    case 'signin':
      return (<HotelSignin navigator={navigator} naviView={this.changeNaviView()}/>);
    case 'nonmembersignin':
      return (<NonmemberSignin navigator={navigator} naviView={this.changeNaviView()}/>);
    case 'register':
      return (<Register navigator={navigator}/>);
    case 'bidInfo':
      return (<GetLatestBidInfo navigator={navigator} searchData={this.state.searchData} bidData={this.state.bidData} />);
    case 'thanks':
      return (<ThanksALot navigator={navigator}/>);
    case 'tutorial':
      return (<TutorialPage navigator={navigator}/>);
    case 'mypage':
      return (<MyPage navigator={navigator} />);
    }
  }

  openDrawer() {
    this._drawer.openDrawer();
  }

  closeDrawer() {
    this._drawer.closeDrawer();
  }

  renderMenuItem(item) {
    if (_navigator.getCurrentRoutes()[_navigator.getCurrentRoutes().length-1].id !== item) {
      _navigator.push({id: item});
    }
    this.closeDrawer();
  }

  _pressRow(rowData: string) {
    switch (rowData) {
    case '결제 내역':
      this.renderMenuItem('mypage');
      break;
    case '로그아웃':
      this._signOut();
      this.changeNaviView();
      this.closeDrawer();
      break;
    case '회원가입':
      this.renderMenuItem('register');
      break;
    case '로그인':
      this.renderMenuItem('signin');
      break;
    }
  }

  async changeNaviView() {
    let token = await AsyncStorage.getItem('id_token');
    let dataSource;
    if(token) {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      dataSource = ds.cloneWithRows(['결제 내역', '로그아웃']);
    } else {
      let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      dataSource = ds.cloneWithRows(['회원가입', '로그인']);
    }
    this.setState({navigationView:(<ListView
      dataSource={dataSource}
      renderRow={this._renderRow}
      renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
      renderSeparator={this._renderSeperator}
    />)});
  }

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        webClientId: '370846469277-4eql800grbcgsf82s312bd7dhp2gtieu.apps.googleusercontent.com',
        offlineAccess: true
      });
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  async componentWillMount() {
    let token = await AsyncStorage.getItem('id_token')
    if(token === 'temp') {
      AsyncStorage.removeItem('id_token');
    }
    this._setupGoogleSignin();
    this.changeNaviView();
    this.addBackPressEventListener();
  }

  _renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
  }

  render() {
    if (this.state.flag) {
          _toolBar = <ToolbarAndroid
            navIcon={require('./assets/img/ic_menu_white_24dp.png')}
            onIconClicked={() => this.openDrawer() }
            style={styles.toolbar}
            title="Hotel Reverse"
            titleColor='white' />
        }
    return (
      <DrawerLayoutAndroid
        ref={(ref) => this._drawer = ref}
        drawerWidth={300}
        onDrawerOpen={() => this.isDrawerOpen = true}
        onDrawerClose={() => this.isDrawerOpen = false}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => this.state.navigationView}>
        {_toolBar}
        <Navigator
          initialRoute={{id: 'splash'}}
          renderScene={this.navigatorRenderScene}
          configureScene={() => Navigator.SceneConfigs.FadeAndroid}/>
      </DrawerLayoutAndroid>
    );
  }

  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    return (
      <TouchableHighlight onPress={() => {
          this._pressRow(rowData);
          highlightRow(sectionID, rowID);
        }}>
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>
              {rowData}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  addBackPressEventListener() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.isDrawerOpen) {
        this.closeDrawer();
        return true;
      }

      if (_navigator.getCurrentRoutes().length === 2) {
        return false;
      }

      _navigator.pop();
      return true;
    });
  }
}

const styles = StyleSheet.create({
  navView: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  drawerBtn: {
    padding: 25,
    height: 30,
    overflow: 'hidden',
    borderColor: 'grey',
    borderWidth: 2,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerBtnText: {
    fontSize: 25,
    color: 'black',
  },
  toolbar: {
    backgroundColor: 'red',
    height: 56,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F6F6F6',
  },
  text: {
    flex: 1,
    fontSize: 18,
  },
});

AppRegistry.registerComponent('HotelAndroid', () => HotelAndroid);
