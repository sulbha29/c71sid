import * as firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyBbd-8rFlgUgQ9ei73FuDJ1gvrIBCZeGFI",
  authDomain: "sidc71-410cb.firebaseapp.com",
  projectId: "sidc71-410cb",
  storageBucket: "sidc71-410cb.appspot.com",
  messagingSenderId: "1036274790564",
  appId: "1:1036274790564:web:cdca1d0c41fbbf15e83631"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()