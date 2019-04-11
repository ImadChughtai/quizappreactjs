import * as firebase from 'firebase';


var config = {
    apiKey: "AIzaSyDEIrp6zKDhHc790ZVDpT2SOsx5GCLfdhg",
    authDomain: "react-quiz-application.firebaseapp.com",
    databaseURL: "https://react-quiz-application.firebaseio.com",
    projectId: "react-quiz-application",
    storageBucket: "react-quiz-application.appspot.com",
    messagingSenderId: "146572835693"
};
firebase.initializeApp(config);

export default firebase;