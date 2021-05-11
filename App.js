
import React from 'react';
import { StyleSheet, Text, View , Image} from 'react-native';
import Search from './screens/search'
import Transaction from './screens/transaction'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {createAppContainer} from 'react-navigation'
export default class App extends React.Component{
  render(){
    
 
  return (
   <AppContainer/>
  );
}
}


var AppNavigator = createBottomTabNavigator({
  Transaction:{screen:Transaction},
  Search:{screen:Search}
},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:()=>{
const routeName = navigation.state.routeName
if(routeName==='Transaction'){
return(
  <Image source={require('./assets/book.png')}
  style = {{width:30, height:30}}/>
)
}
else if(routeName==='Search'){
  return(
    <Image source={require('./assets/searchingbook.png')}
    style = {{width:30, height:30}}/>
  )
  }
    }
  })
})


const AppContainer = createAppContainer(AppNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

