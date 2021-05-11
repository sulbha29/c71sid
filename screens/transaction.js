import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import db from '../config'
import firebase from 'firebase'
export default class Transaction extends React.Component{
  constructor(){
    super()
    this.state={
    hasCameraPermissions: null,
    scanned: false,
    scanData:' ',
    buttonState:'normal',
    scanBookID:'',
    scanStudentID:'',
    transactionMessage:''
    }
  }

  getCameraPermissions=async(id)=>{
    const {status}=await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermissions:status === 'granted',
      buttonState:id,
      scanned:false
    })
  }
  

  barcodescanned=async({type,data})=>{
    const {buttonState}=this.state
    if(buttonState ==='bookID'){
   

    this.setState({
      scanned:true,
      scanBookID:data,
      buttonState:'normal'
    })
  }

  else if(buttonState ==='studentID'){
    this.setState({
      scanned:true,
      scanStudentID:data,
      buttonState:'normal'
    })
  }
}

handleTransaction = async()=>{
  var transactionMessage = null;
  db.collection("Books").doc(this.state.scanBookID).get()
  .then((doc)=>{
    var book = doc.data()
    if(book.Availability){
      this.initiateBookIssue()
      transactionMessage= "Book Issued"
    }
    else{
      this.initiateBookReturn()
      transactionMessage = "Book Returned"
    }
  })

  this.setState({
    transactionMessage : transactionMessage
  })
}




initiateBookIssue = async ()=>{
 
  db.collection("transaction").add({
    'studentID' : this.state.scanBookID,
    'bookID' : this.state.scanStudentID,
    'date' : firebase.firestore.Timestamp.now().toDate(),
    'transactionType' : "Issue"
  })

  db.collection("Books").doc(this.state.scanBookID).update({
    'Availability' : false
  })
  
  db.collection("Students").doc(this.state.scanStudentID).update({
    'NumberOfBooksIssued' : firebase.firestore.FieldValue.increment(1)
  })
Alert.alert("book issued")
  this.setState({
    scanBookID: '',
    scanStudentID: ''
  })
}

initiateBookReturn=async()=>{
  db.collection("transaction").add({
    'studentID' : this.state.scanBookID,
    'bookID' : this.state.scanStudentID,
    'date' : firebase.firestore.Timestamp.now().toDate(),
    'transactionType' : "Return"
  })

  db.collection("Books").doc(this.state.scanBookID).update({
    'Availability' : true
  })
  
  db.collection("Students").doc(this.state.scanStudentID).update({
    'NumberOfBooksIssued' : firebase.firestore.FieldValue.increment(-1)
  })
  Alert.alert("book returned")
  this.setState({
    scanBookID: '',
    scanStudentID: ''
  })
  }

  render(){
    const hasCameraPermissions=this.state.hasCameraPermissions
 
    const scanned = this.state.scanned
    const buttonState = this.state.buttonState

    if(buttonState!=='normal' && hasCameraPermissions){
      return(
        <BarCodeScanner onBarCodeScanned={scanned?undefined:this.barcodescanned}
        style = {StyleSheet.absoluteFillObject}
        />
      )
      

    }

    else if(buttonState==='normal'){




  return (
    <KeyboardAvoidingView style = {styles.container} behavior = 'padding' enabled>
      <View>
        <Image source = {require('../assets/booklogo.jpg')}
        style = {{width:200,height:200}}
        />
      </View>
      <View style = {styles.inputView}>
        <TextInput 
        style = {styles.inputBox}
        placeholder= 'Book ID'
        value = {this.state.scanBookID}
        onChangeText = {text=>this.setState({scanBookID:text})}
        />
        <TouchableOpacity style = {styles.scanButton} onPress = {()=>{this.getCameraPermissions('bookID')}}>
          <Text style = {styles.buttonText}>Scan</Text>
        </TouchableOpacity>
      </View>

      <View style = {styles.inputView} >
        <TextInput 
        style = {styles.inputBox}
        placeholder= 'Student ID'
        value = {this.state.scanStudentID}
        onChangeText = {text=>this.setState({scanStudentID:text})}
        />
        <TouchableOpacity style = {styles.scanButton} onPress = {()=>{this.getCameraPermissions('studentID')}}>
          <Text style = {styles.buttonText}>Scan</Text>
         
        </TouchableOpacity>
</View>
<Text style={styles.transactionAlert}>{this.state.transactionMessage}</Text>
        <TouchableOpacity
          style={styles.submitbutton}
          onPress={async()=>{
            var transactionMessage = await this.handleTransaction()
          }}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
     
       
      </KeyboardAvoidingView>
  );
  }
}
}

const styles = StyleSheet.create({ 
container: {
flex: 1, justifyContent: 'center', alignItems: 'center' },
displayText:{ fontSize: 15, textDecorationLine: 'underline' }, 
scanButton:{ backgroundColor: '#2196F3', padding: 10, margin: 10 }, 
buttonText:{ fontSize: 15 } ,
inputView:{ flexDirection: 'row', margin: 20 },
inputBox:{ width: 200, height: 40, borderWidth: 1.5, borderRightWidth: 0, fontSize: 20 },
scanButton:{ backgroundColor: '#66BB6A', width: 50, borderWidth: 1.5, borderLeftWidth: 0 },

submitbutton:{
  backgroundColor:'yellow',
  width:100,
  height:40,
  
},

submitText:{
  fontSize:25,
  color:'blue',
  fontWeight:'bold',
 
}
});



