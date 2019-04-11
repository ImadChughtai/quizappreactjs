import React, { Component } from 'react';
// import logo from './logo.svg';
import ButtonAppBar from './Navbar'
import './App.css';
import firebase from './firebase';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Givingquizdetails from './givingquizdetails'
import { random } from 'node-forge';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

var provider = new firebase.auth.FacebookAuthProvider();

class Mainquiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginSweet: false,
            logoutSweet: false,
            isLoggedin: false,
            userID: '',
            username: '',
            picture: '',
            createQuiz: false,
            quizName: '',
            quizNamewritten: false,
            questionNo: 1,
            question: '',
            optionone: '',
            optiontwo: '',
            optionthree: '',
            optionfour: '',
            correctoption: '',
            quizUniquekey: '',
            uniqueKeywritten: false,
            show: false,
            takequiz: false,
            quizToopenkey: '',
            wholequiz: null,
            takequizcondition: false,
            slicefirstindex: 0,
            slicesecondindex: 1,
            totalnumbers: 0,
            selectedValue: null,
            showResult: false,
            quizresultdate: '',
            quizresultname: '',
            quizresultpassorfail: '',
            quizresultpercentage: '',
            quizDescription: '',
            quizNamedescriptiondialog: false,
            dialogwhenCorrectansdoesnotmatch: false,
            quizNamebeforestartingquiz: '',
            quizDescriptionbeforestartingquiz: '',
            quizNameanddescriptionbeforestartingcondition: false,
            timeInput: '',
            minutes: '',
            seconds: 60,
            timeupForquiz: false,
            dialogAboutalreadygiventest: false,
            mycreatedQuizeslist: null,
            myattemptedQuizeslist: null,
            nestedListopen: false,
            secondnestedListopen: false,
            sidedivShowcondition: false,
            showsubmitWhenattempting: false,
            quizCompleted: false,
            questionsAttempted: 0,
            takingRemainingquiz: false,
            timerStopcondition: false,
            attemptingQuizName: '',
            showingCreatedandattemptquizes: false,
            showingAttemptquizesdiv: false
        }
        // this.secondsRemaining;
        // this.intervalHandle;
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this.tick = this.tick.bind(this);
    }

    // OWN TIMER FUNCTION

    timerFunc() {
        const { minutes, seconds } = this.state;

    }


    // COUNT DOWN TIMER WHEN CREATING QUIZ


    tick() {
        // var min = Math.floor(this.secondsRemaining / 60);
        // var sec = this.secondsRemaining - (min * 60);
        // console.log("MIN", min);
        // console.log("SEC", sec);
        // if (this.state.minutes != '') {
        const { seconds, minutes } = this.state;
        this.setState({
            seconds: seconds - 1
        })
        // if (seconds < 10) {
        //     this.setState({
        //         seconds: "0" + seconds,
        //     })
        // }
        if (seconds == 0) {
            this.setState({
                minutes: minutes - 1
            })
        }
        if (minutes < 10) {
            this.setState({
                value: "0" + minutes,
            })
        }
        if (minutes === 0 & minutes === 0) {
            clearInterval(this.intervalHandle);
            this.setState({
                timeupForquiz: true,
                quizCompleted: true
                // minutes: '0',
                // seconds: '00'
            }, () => {
                this.funcAftertimeup()
            })
        }
        // }
    }



    gettingMyquizesdata(uuid) {
        firebase.database().ref("users/" + uuid + "/Myquizes/").on("value", (snapshot) => {
            var datas = snapshot.val();
            var arrofmycreatedQuizeslist = [];
            // this.setState({
            //     quizNamebeforestartingquiz: data.quizName,
            //     quizDescriptionbeforestartingquiz: data.quizDescription,
            //     quizNameanddescriptionbeforestartingcondition: true,
            //     minutes: data.timeInput
            // })
            console.log("DATAAAAAAAAAAAAAAAAAA", datas)
            // var arr = [];
            for (var key in datas) {
                arrofmycreatedQuizeslist.push(datas[key])
            }
            this.setState({
                mycreatedQuizeslist: arrofmycreatedQuizeslist,
                // takequizcondition: true,
                // takequiz: false
            })
        })
    }

    gettingAttemptedquizesdata(uuid) {
        firebase.database().ref("users/" + uuid + "/Attemptedquizes/").on("value", (snapshot) => {
            var datastwo = snapshot.val();
            var arrofmyattemptedQuizeslist = [];
            // this.setState({
            //     quizNamebeforestartingquiz: data.quizName,
            //     quizDescriptionbeforestartingquiz: data.quizDescription,
            //     quizNameanddescriptionbeforestartingcondition: true,
            //     minutes: data.timeInput
            // })
            console.log("GOT DATA OF ATTEMPTED QUIZES", datastwo)
            // var arr = [];
            for (var key in datastwo) {
                arrofmyattemptedQuizeslist.push(datastwo[key])
            }
            this.setState({
                myattemptedQuizeslist: arrofmyattemptedQuizeslist
                // takequizcondition: true,
                // takequiz: false
            })
        })
    }

    // LOGIN FUNCTION WORKING WITH PROPS ON NAVBAR

    logIn() {
        console.log("CLICKED FROM CHILD");
        firebase.auth().signInWithPopup(provider).then((result) => {

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log("FACEBOOK SIGN IN RESULT", result)
            console.log("NAMEE", user.displayName);
            console.log("NAMEE", user.uid);
            console.log("PICTURE", result.user.providerData[0].photoURL)

            var obj = {
                name: user.displayName,
                // email: user.email,
                userID: user.uid,
                picture: result.user.providerData[0].photoURL
            }
            firebase.database().ref("users/" + user.uid + "/").update(obj).then(async () => {
                console.log("USER DOT UID FROM INSIDE", user.uid);

                // await firebase.database().ref("users/" + user.uid + "/Myquizes/").on("value", (snapshot) => {
                //     var datas = snapshot.val();
                //     var arrofmycreatedQuizeslist = [];
                //     // this.setState({
                //     //     quizNamebeforestartingquiz: data.quizName,
                //     //     quizDescriptionbeforestartingquiz: data.quizDescription,
                //     //     quizNameanddescriptionbeforestartingcondition: true,
                //     //     minutes: data.timeInput
                //     // })
                //     console.log("DATAAAAAAAAAAAAAAAAAA", datas)
                //     // var arr = [];
                //     for (var key in datas) {
                //         arrofmycreatedQuizeslist.push(datas[key])
                //     }
                //     this.setState({
                //         mycreatedQuizeslist: arrofmycreatedQuizeslist,
                //         // takequizcondition: true,
                //         // takequiz: false
                //     })
                // }).catch((e) => {
                //     console.log("ERROR GETTING MYQUIZESS", e)
                // })

                // await firebase.database().ref("users/" + user.uid + "/Attemptedquizes/").on("value", (snapshot) => {
                //     var datastwo = snapshot.val();
                //     var arrofmyattemptedQuizeslist = [];
                //     // this.setState({
                //     //     quizNamebeforestartingquiz: data.quizName,
                //     //     quizDescriptionbeforestartingquiz: data.quizDescription,
                //     //     quizNameanddescriptionbeforestartingcondition: true,
                //     //     minutes: data.timeInput
                //     // })
                //     console.log("GOT DATA OF ATTEMPTED QUIZES", datastwo)
                //     // var arr = [];
                //     for (var key in datastwo) {
                //         arrofmyattemptedQuizeslist.push(datastwo[key])
                //     }
                //     this.setState({
                //         myattemptedQuizeslist: arrofmyattemptedQuizeslist
                //         // takequizcondition: true,
                //         // takequiz: false
                //     })
                // }).catch((e) => {
                //     console.log("ERROR GETTING ATTEMPTED QUIZES", e)
                // })
                // condition: true,
                // show: true,
                // localStorage.setItem("profileImage", result.user.providerData[0].photoURL);
                // localStorage.setItem("userFacebookname",user.displayName);
                console.log("SAVED");
            }).catch((e) => {
                console.log("ERROR SAVING UPDATE TO TO DATA BASE")
            })








            this.setState({
                isLoggedin: true,
                userID: user.uid,
                username: user.displayName,
                loginSweet: true,
                picture: result.user.providerData[0].photoURL,
                sidedivShowcondition: true
            }, () => {
                const { userID } = this.state;
                this.gettingMyquizesdata(userID);
                this.gettingAttemptedquizesdata(userID);
            })
        }).catch(function (error) {

            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...

        });
    }


    // LOGOUT FUNCTION WORKING WITH PROPS ON NAVBAR

    logOut() {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            this.setState({
                loginSweet: false,
                logoutSweet: false,
                isLoggedin: false,
                userID: '',
                username: '',
                picture: '',
                createQuiz: false,
                quizName: '',
                quizNamewritten: false,
                questionNo: 1,
                question: '',
                optionone: '',
                optiontwo: '',
                optionthree: '',
                optionfour: '',
                correctoption: '',
                quizUniquekey: '',
                uniqueKeywritten: false,
                show: false,
                takequiz: false,
                quizToopenkey: '',
                wholequiz: null,
                takequizcondition: false,
                slicefirstindex: 0,
                slicesecondindex: 1,
                totalnumbers: 0,
                selectedValue: null,
                showResult: false,
                quizresultdate: '',
                quizresultname: '',
                quizresultpassorfail: '',
                quizresultpercentage: '',
                quizDescription: '',
                quizNamedescriptiondialog: false,
                dialogwhenCorrectansdoesnotmatch: false,
                minutes: '',
                seconds: '00',
                timeupForquiz: false,
                dialogAboutalreadygiventest: false,
                mycreatedQuizeslist: null,
                myattemptedQuizeslist: null,
                nestedListopen: false
            })

        }).catch(function (error) {
            // An error happened.
        });
    }

    // CREATE QUIZ BUTTON

    createQuizbtn() {
        this.setState({
            createQuiz: true
        })
    }

    // NEXT BUTTON WHEN MAKING QUIZ

    nextBtn() {
        const { userID, timeInput, quizName, quizDescription, questionNo, question, optionone, optiontwo, optionthree, optionfour, correctoption, quizUniquekey } = this.state;
        if (question != '' && optionone != '' && optiontwo != '' && optionthree != '' && optionfour != '' && correctoption != '') {
            if (correctoption === optionone || correctoption === optiontwo || correctoption === optionthree || correctoption === optionfour) {

                var obj = {
                    question,
                    optionone,
                    optiontwo,
                    optionthree,
                    optionfour,
                    correctoption,
                    quizName,
                    questionNo
                }

                firebase.database().ref("quizes/" + quizUniquekey + "/").push(obj).then((snapshot) => {
                    var abc = {
                        quizDescription,
                        quizName,
                        timeInput
                    }
                    firebase.database().ref("quizes/" + quizUniquekey + "/").update(abc);
                    var key = snapshot.key;
                    var objtwo = {
                        key
                    }
                    firebase.database().ref("quizes/" + quizUniquekey + "/" + key + "/").update(objtwo).then(() => {
                        // console.log("SUCCESFULLY SAVED IN QUIZES NODE");
                        var oobj = {
                            quizUniquekey,
                            quizDescription,
                            quizName,
                            timeInput
                        }
                        firebase.database().ref("users/" + userID + "/Myquizes/" + quizUniquekey + "/").update(oobj).then(() => {
                            this.setState({
                                questionNo: questionNo + 1,
                                question: '',
                                optionone: '',
                                optiontwo: '',
                                optionthree: '',
                                optionfour: '',
                                correctoption: ''
                            })
                        }).catch((e) => {
                            console.log("ERROR SAVING IN Users /  Myquizes");
                        })

                    }).catch(() => {
                        console.log("COULD NOT SUCCESFULLY SAVED IN QUIZES NODE");
                    })
                })



                // firebase.database().ref("users/" + userID + "/" + quizName + "/").push(obj).then((snapshot) => {
                //     var key = snapshot.key;
                //     var objtwo = {
                //         key
                //     }
                //     firebase.database().ref("users/" + userID + "/" + quizName + "/" + key + "/").update(objtwo).then(() => {
                //     }).catch((e) => {
                //         console.log("ERROR SAVING QUESTIONS");
                //     })

                // }).catch((e) => {
                //     console.log("Error Saving Question!")
                // })

            }
            else {
                this.setState({
                    dialogwhenCorrectansdoesnotmatch: true
                })
                // alert("CORRECT ANSWER DOES NOT MATCH WITH ANY OPTION. PLEASE WRITE CORRECTLY!")
            }
        }
        else {
            alert("FILL ALL INPUTS")
        }

    }


    // QUESTION HANDLE

    questionHandle(e) {
        this.setState({
            question: e.target.value
        })
    }


    // OPTION ONE HANDLE

    optiononeHandle(e) {
        this.setState({
            optionone: e.target.value
        })
    }


    // OPTION TWO HANDLE

    optiontwoHandle(e) {
        this.setState({
            optiontwo: e.target.value
        })
    }


    // OPTION THREE HANDLE

    optionthreeHandle(e) {
        this.setState({
            optionthree: e.target.value
        })
    }


    // OPTION FOUR HANDLE

    optionfourHandle(e) {
        this.setState({
            optionfour: e.target.value
        })
    }


    // CORRECT OPTION HANDLE

    correctoptionHandle(e) {
        this.setState({
            correctoption: e.target.value
        })
    }


    // QUIZ NAME HANDLE

    quiznameHandle(e) {
        this.setState({
            quizName: e.target.value
        })
    }


    // QUIZ DESCRIPTION HANDLE

    quizDescriptionhandle(e) {
        this.setState({
            quizDescription: e.target.value
        })
    }


    // QUIZ NAME BUTTON

    quizNamebtn() {
        const { quizName, quizDescription, timeInput } = this.state;
        if (quizName !== '' && quizDescription !== '' && timeInput !== '') {
            var text = "";
            var possible = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
            for (var i = 0; i < 8; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length))
            }
            console.log("TEXTTTT", text);
            if (text != "") {
                this.setState({
                    quizNamewritten: true,
                    quizUniquekey: text
                })
            }
        }
        else {
            this.setState({
                quizNamedescriptiondialog: true
            })
        }

    }


    // UNIQUE KEY HANDLE

    uniquekeyHandle(e) {
        this.setState({
            quizUniquekey: e.target.value
        })
    }


    // QUIZ CREATING KEY BUTTON

    quizKeybtn() {
        const { quizUniquekey } = this.state;
        if (quizUniquekey !== '') {
            this.setState({
                uniqueKeywritten: true,
                sidedivShowcondition: false
            })
        }
    }


    // SUBMIT BUTTON FOR QUIZES WHEN MAKING QUIZ

    submitBtn() {



        const { userID, quizName, quizDescription, timeInput, questionNo, question, optionone, optiontwo, optionthree, optionfour, correctoption, quizUniquekey } = this.state;
        if (question != '' && optionone != '' && optiontwo != '' && optionthree != '' && optionfour != '' && correctoption != '') {
            if (correctoption === optionone || correctoption === optiontwo || correctoption === optionthree || correctoption === optionfour) {

                this.setState({
                    questionNo: questionNo + 1
                }, () => {

                    var obj = {
                        question,
                        optionone,
                        optiontwo,
                        optionthree,
                        optionfour,
                        correctoption,
                        quizName,
                        questionNo
                    }

                    firebase.database().ref("quizes/" + quizUniquekey + "/").push(obj).then((snapshot) => {
                        var abc = {
                            quizDescription,
                            quizName,
                            timeInput
                        }
                        firebase.database().ref("quizes/" + quizUniquekey + "/").update(abc);
                        var key = snapshot.key;
                        var objtwo = {
                            key
                        }
                        firebase.database().ref("quizes/" + quizUniquekey + "/" + key + "/").update(objtwo).then(() => {
                            console.log("SUCCESFULLY SAVED IN QUIZES NODE");
                            this.setState({
                                createQuiz: false,
                                quizName: '',
                                quizNamewritten: false,
                                questionNo: 1,
                                question: '',
                                optionone: '',
                                optiontwo: '',
                                optionthree: '',
                                optionfour: '',
                                correctoption: '',
                                quizUniquekey: '',
                                uniqueKeywritten: false,
                                show: true,
                                sidedivShowcondition: true
                            })
                        }).catch(() => {
                            console.log("COULD NOT SUCCESFULLY SAVED IN QUIZES NODE");
                        })
                    })





                    // firebase.database().ref("users/" + userID + "/" + quizName + "/").push(obj).then((snapshot) => {
                    //     var key = snapshot.key;
                    //     var objtwo = {
                    //         key
                    //     }
                    //     firebase.database().ref("users/" + userID + "/" + quizName + "/" + key + "/").update(objtwo).then(() => {
                    //     }).catch((e) => {
                    //         console.log("ERROR SAVING QUESTIONS");
                    //     })

                    // }).catch((e) => {
                    //     console.log("Error Saving Question!")
                    // })
                })
            }
            else {
                this.setState({
                    dialogwhenCorrectansdoesnotmatch: true
                })
                // alert("CORRECT ANSWER DOES NOT MATCH WITH ANY OPTION. PLEASE WRITE CORRECTLY!")
            }
        }
        else {
            alert("FILL ALL INPUTS")
        }


        this.setState({
            createQuiz: false,
            quizName: '',
            quizNamewritten: false,
            questionNo: 1,
            question: '',
            optionone: '',
            optiontwo: '',
            optionthree: '',
            optionfour: '',
            correctoption: '',
            quizUniquekey: '',
            uniqueKeywritten: false,
            show: true,
            sidedivShowcondition: true
        })

    }


    // NOW TAKING QUIZ WORK

    // TAKE QUIZ BUTTON

    takeQuizbtn() {
        this.setState({
            takequiz: true,
            takequizcondition: true
        })

    }


    // QUIZ KEY INPUT HANDLE BUTTON

    keyinputHandle(e) {
        this.setState({
            quizToopenkey: e.target.value
        })
    }


    // SUBMIT KEY TO ENTER QUIZ

    submitKeytoenter() {

        const { quizToopenkey, userID, quizCompleted, submitKeytoenter, takequiz, quizNamebeforestartingquiz, quizDescriptionbeforestartingquiz } = this.state;
        if (quizToopenkey !== '') {
            // firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/").on("child_added", (snapshot) => {
            //     var datas = snapshot.key;
            //     console.log("KEYYYYYYY CHECK", datas);
            // if (quizToopenkey != datas) {
            // console.log("QUIZ KEY TO OPEN",quizToopenkey);
            firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/" + quizToopenkey + "/").on("value", (snapshots) => {
                var d = snapshots.val();
                // console.log("D CONSOLE", d);
                if (d == null) {

                    firebase.database().ref("quizes" + "/" + quizToopenkey + "/").on("value", (snapshot) => {
                        var data = snapshot.val();
                        this.setState({
                            quizNamebeforestartingquiz: data.quizName,
                            quizDescriptionbeforestartingquiz: data.quizDescription,
                            quizNameanddescriptionbeforestartingcondition: true,
                            minutes: data.timeInput - 1
                        })
                        console.log("DATAAAAAAAAAAAAAAAAAA", data)
                        var arr = [];
                        for (var key in data) {
                            arr.push(data[key])
                        }
                        this.setState({
                            wholequiz: arr,
                            takequizcondition: true,
                            takequiz: false,
                            sidedivShowcondition: true
                        })
                    })
                }

                else if (d != null && d.quizCompleted == false && this.state.quizCompleted == false && d.totalnumbers != this.state.totalnumbers) {
                    console.log("QUESTIONS ATTEMPTED", d.questionsAttempted);
                    console.log("TOTAL NUMBERS", d.totalnumbers);
                    firebase.database().ref("quizes/" + quizToopenkey + "/").on("value", (snap) => {
                        var z = snap.val();
                        console.log("SNAP", z);
                        var arr = [];
                        for (var key in z) {
                            arr.push(z[key])
                        }
                        var initialIndex = d.questionsAttempted;
                        var finalIndex = arr.length - 3;
                        console.log("initialIndex", initialIndex);
                        console.log("finalIndex", finalIndex);
                        // console.log("")
                        var newarr = arr.slice(initialIndex, finalIndex);
                        // console.log("arr", newarr);
                        this.setState({
                            wholequiz: newarr,
                            takequizcondition: true,
                            sidedivShowcondition: true,
                            takequiz: false,
                            questionsAttempted: d.questionsAttempted,
                            attemptingQuizName: d.attemptedquizname,
                            totalnumbers: d.totalnumbers,
                            sidedivShowcondition: false,
                            takingRemainingquiz: true,
                            minutes: d.minutes,
                            timerStopcondition: false
                        }, () => {
                            const { timerStopcondition } = this.state;
                            var intervalHandle = setInterval(() => {
                                const { seconds, minutes } = this.state;
                                this.setState({
                                    seconds: seconds - 1
                                })
                                // if (seconds < 10) {
                                //     this.setState({
                                //         seconds: "0" + seconds,
                                //     })
                                // }
                                if (seconds == 0) {
                                    this.setState({
                                        minutes: minutes - 1,
                                        seconds: 60
                                    })
                                }
                                // if (minutes < 10) {
                                //     this.setState({
                                //         value: "0" + minutes,
                                //     })
                                // }
                                if (timerStopcondition == true) {
                                    clearInterval(intervalHandle);
                                    // this.setState({
                                    //     seconds: 60
                                    // })
                                }
                                if (minutes === 0 & seconds === 0) {
                                    clearInterval(intervalHandle);
                                    this.setState({
                                        timeupForquiz: true,
                                        quizCompleted: true,
                                        timerStopcondition: true,
                                        minutes: '',
                                        seconds: 60
                                    }, () => {
                                        this.funcAftertimeup()
                                    })
                                }
                                // let time = this.state.minutes;
                                // this.secondsRemaining = time * 60;
                            }, 1000);
                        })
                    })
                }
                // else if(d.quizCompleted == true){
                //     this.setState({
                //         dialogAboutalreadygiventest: true
                //     })
                // }
                // if (d.quizCompleted == false) {

                // }
            })


            // firebase.database().ref("quizes" + "/" + quizToopenkey + "/").on("value", (snapshot) => {
            //     var data = snapshot.val();
            //     this.setState({
            //         quizNamebeforestartingquiz: data.quizName,
            //         quizDescriptionbeforestartingquiz: data.quizDescription,
            //         quizNameanddescriptionbeforestartingcondition: true,
            //         minutes: data.timeInput
            //     })
            //     console.log("DATAAAAAAAAAAAAAAAAAA", data)
            //     var arr = [];
            //     for (var key in data) {
            //         arr.push(data[key])
            //     }
            //     this.setState({
            //         wholequiz: arr,
            //         takequizcondition: true,
            //         takequiz: false
            //     })
            // })
            // }
            // else {
            //     this.setState({
            //         dialogAboutalreadygiventest: true
            //     })
            // }
            // })
        }
        else {
            alert("Please Write Key First!")
        }

    }

    // NEXT QUESTION BUTTON WHEN TAKING QUIZ

    nextquestionBtn(correctans, attemptedquizname, currentIndex) {
        const { slicefirstindex, takingRemainingquiz, minutes, quizCompleted, timeupForquiz, quizToopenkey, questionsAttempted, slicesecondindex, totalnumbers, selectedValue, wholequiz, userID } = this.state;
        console.log("LENGTH", wholequiz.length);
        firebase.database().ref("quizes/" + quizToopenkey + "/").on("value", (s) => {
            var pqr = s.val();
            var ar = [];
            for (var key in pqr) {
                ar.push(pqr[key])
            }
            var quizTotalquestions = ar.length - 3
            console.log("LENGTH OF QUESTION THAT ARE IN QUIZ", quizTotalquestions);
            if (takingRemainingquiz == false) {
                var mnop = wholequiz.length - 3;
                var t = wholequiz.length - 3
            }
            else if (takingRemainingquiz == true) {
                var mnop = wholequiz.length
            }
            console.log("MNOP", mnop);
            if (selectedValue === correctans && slicesecondindex < mnop) {
                console.log("FIRST IF CHALA")
                this.setState({
                    slicefirstindex: slicefirstindex + 1,
                    slicesecondindex: slicesecondindex + 1,
                    totalnumbers: totalnumbers + 1,
                    questionsAttempted: questionsAttempted + 1,
                }, () => {
                    const { questionsAttempted, totalnumbers, quizCompleted, minutes } = this.state;
                    console.log("QUESTIONS ATTEMPTED", questionsAttempted)
                    var ooobj = {
                        questionsAttempted,
                        quizCompleted,
                        totalnumbers,
                        minutes,
                        quizTotalquestions,
                        attemptedquizname
                    }
                    firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/" + quizToopenkey + "/").update(ooobj);
                })
            }
            else if (selectedValue == null) {
                alert("SELECT ANY OPTION FIRST!")
            }
            else if (selectedValue !== correctans && slicesecondindex < mnop) {
                console.log("SECOND IF CHALA");
                console.log("SLICE SECOND INDEX", slicesecondindex);
                this.setState({
                    slicefirstindex: slicefirstindex + 1,
                    slicesecondindex: slicesecondindex + 1,
                    questionsAttempted: questionsAttempted + 1
                }, () => {
                    const { questionsAttempted, quizCompleted, totalnumbers, minutes } = this.state
                    var ooobj = {
                        questionsAttempted,
                        quizCompleted,
                        totalnumbers,
                        minutes,
                        quizTotalquestions,
                        attemptedquizname
                    }
                    firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/" + quizToopenkey + "/").update(ooobj);
                }
                )
            }
            else if (selectedValue === correctans && slicesecondindex == mnop) {
                console.log("THIRD IF CHALA");
                this.setState({
                    totalnumbers: totalnumbers + 1,
                    quizCompleted: true,
                    questionsAttempted: questionsAttempted + 1
                }, () => {
                    const { questionsAttempted, quizCompleted, totalnumbers } = this.state;
                    var totalNum = wholequiz.length - 3;
                    var numbersgot = totalnumbers;
                    var percentage = numbersgot / totalNum * 100;
                    var result = '';
                    if (percentage >= 70) {
                        var result = 'Passed';
                    }
                    else {
                        var result = 'Fail'
                    }
                    var date = new Date().toDateString();
                    var attemptedOn = date;
                    var obj = {
                        attemptedquizname,
                        result,
                        attemptedOn,
                        percentage,
                        quizToopenkey,
                        questionsAttempted,
                        quizCompleted,
                        totalnumbers
                    }
                    console.log("QUIZ TO OPEN KEEEY", quizToopenkey)
                    firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").update(obj).then((snapshot) => {
                        // var keyforattemptedquiz = snapshot.key;
                        // var keyobj = {
                        //     key: keyforattemptedquiz
                        // }
                        // firebase.database().ref("users/" + userID + "/Attemptedquizes/" + keyforattemptedquiz + "/").update(keyobj);
                        this.setState({
                            showResult: true
                        }, () => {
                            firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").on("value", (snapshottwo) => {
                                var data = snapshottwo.val();
                                console.log("QUIZ SHOW KARNAY K LIYE SNAPSHOT DOT VAL", data);
                                this.setState({
                                    quizresultdate: data.attemptedOn,
                                    quizresultname: data.attemptedquizname,
                                    quizresultpassorfail: data.result,
                                    quizresultpercentage: data.percentage,
                                    takequizcondition: false
                                })
                            })
                        })
                    }).catch((e) => {
                        console.log("Sorry Quiz RESULT COULD NOT BE SAVED!")
                    })
                    // var obj = {
                    //     totalnumbers,

                    // }
                    // firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/")
                    // var totalNum = wholequiz.length;
                    // var numbersgot = totalnumbers
                    // var percentage = numbersgot / totalNum * 100;
                    // console.log("percentage", percentage)
                })
                // alert("NO MORE QUESTIONS")
            }
            // else if (selectedValue !== correctans && slicesecondindex == wholequiz.length) {
            //     console.log("THIRD IF CHALA");
            //     this.setState({
            //         quizCompleted: true
            //     }, () => {
            //         var totalNum = wholequiz.length;
            //         var numbersgot = totalnumbers
            //         var percentage = numbersgot / totalNum * 100;
            //         // console.log("percentage", percentage)
            //     })
            //     // alert("NO MORE QUESTIONS")
            // }
            else {
                this.setState({
                    quizCompleted: true
                }, () => {
                    var totalNum = wholequiz.length - 3;
                    var numbersgot = totalnumbers
                    var percentage = numbersgot / totalNum * 100;
                    var result = '';
                    if (percentage >= 70) {
                        var result = 'passed';
                    }
                    else {
                        var result = 'fail'
                    }
                    var date = new Date().toDateString();
                    var attemptedOn = date;
                    var obj = {
                        attemptedquizname,
                        result,
                        attemptedOn,
                        percentage
                    }
                    firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").update(obj).then((snapshot) => {
                        // var keyforattemptedquiz = snapshot.key;
                        // var keyobj = {
                        //     key: keyforattemptedquiz
                        // }
                        // firebase.database().ref("users/" + userID + "/Attemptedquizes/" + keyforattemptedquiz + "/").update(keyobj);
                        this.setState({
                            showResult: true
                        }, () => {
                            firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").on("value", (snapshottwo) => {
                                var data = snapshottwo.val();
                                console.log("QUIZ SHOW KARNAY K LIYE SNAPSHOT DOT VAL", data);
                                this.setState({
                                    quizresultdate: data.attemptedOn,
                                    quizresultname: data.attemptedquizname,
                                    quizresultpassorfail: data.result,
                                    quizresultpercentage: data.percentage,
                                    takequizcondition: false
                                })
                            })
                        })
                    }).catch((e) => {
                        console.log("Sorry Quiz RESULT COULD NOT BE SAVED!")
                    })
                    // var obj = {
                    //     totalnumbers,

                    // }
                    // firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/")
                })
            }
            // if (timeupForquiz == true) {
            //     this.setState({
            //         timeupForquiz: false
            //     })
            // }
            var x = mnop - 1;
            if (slicesecondindex == x) {
                this.setState({
                    showsubmitWhenattempting: true
                })
            }
        })
    }




    // SUBMIT BUTTON ON LAST QUESTION OF ATTEMPTING QUIZ

    submitquestionBtn(correctans, attemptedquizname, currentIndex) {
        const { slicefirstindex, takingRemainingquiz, timeupForquiz, questionsAttempted, quizToopenkey, slicesecondindex, totalnumbers, selectedValue, wholequiz, userID } = this.state;
        console.log("LENGTH", wholequiz.length);
        // var mnop = wholequiz.length - 3;
        firebase.database().ref("quizes/" + quizToopenkey + "/").on("value", (s) => {
            var pqr = s.val();
            var ar = [];
            for (var key in pqr) {
                ar.push(pqr[key])
            }
            var quizTotalquestions = ar.length - 3
            console.log("LENGTH OF QUESTION THAT ARE IN QUIZ", quizTotalquestions);
            this.setState({
                minutes: '',
                seconds: 60
            })
            if (takingRemainingquiz == false) {
                var mnop = wholequiz.length - 3;
            }
            else if (takingRemainingquiz == true) {
                var mnop = wholequiz.length
            }
            console.log("MNOP", mnop)
            if (selectedValue === correctans && slicesecondindex < mnop) {
                console.log(" SUBMIT BUTTON KA FIRST IF CHALA")
                this.setState({
                    slicefirstindex: slicefirstindex + 1,
                    slicesecondindex: slicesecondindex + 1,
                    totalnumbers: totalnumbers + 1,
                    questionsAttempted: questionsAttempted + 1
                }, () => {
                    const { questionsAttempted, totalnumbers, quizCompleted } = this.state
                    var ooobj = {
                        questionsAttempted,
                        quizCompleted,
                        totalnumbers
                    }
                    firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/" + quizToopenkey + "/").update(ooobj);
                })
            }
            else if (selectedValue == null) {
                alert("SELECT ANY OPTION FIRST!")
            }
            else if (selectedValue !== correctans && slicesecondindex < mnop) {
                console.log("SUBMIT BUTTON KA SECOND IF CHALA");
                console.log("SUBMIT BUTTON KA SLICE SECOND INDEX", slicesecondindex);
                this.setState({
                    slicefirstindex: slicefirstindex + 1,
                    slicesecondindex: slicesecondindex + 1,
                    questionsAttempted: questionsAttempted + 1,
                    quizCompleted: true
                }, () => {
                    const { questionsAttempted, quizCompleted, totalnumbers } = this.state
                    var ooobj = {
                        questionsAttempted,
                        quizCompleted,
                        totalnumbers
                    }
                    firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/" + quizToopenkey + "/").update(ooobj);
                })
            }
            else if (selectedValue === correctans && slicesecondindex == mnop) {
                console.log("THIRD IF CHALA");
                this.setState({
                    totalnumbers: totalnumbers + 1,
                    quizCompleted: true,
                    questionsAttempted: questionsAttempted + 1
                }, () => {
                    const { questionsAttempted, quizCompleted, totalnumbers } = this.state;
                    // var totalNum = mnop;
                    var totalNum = questionsAttempted;
                    // if (takingRemainingquiz == false) {
                    //     var totalNum = wholequiz.length - 3;
                    // }
                    // else if (takingRemainingquiz == true) {
                    //     var totalNum = wholequiz.length
                    // }
                    console.log("TTTOOOOTALLLL NUMMM", totalNum);
                    var numbersgot = totalnumbers;
                    var percentage = numbersgot / totalNum * 100;
                    var result = '';
                    if (percentage >= 70) {
                        var result = 'passed';
                    }
                    else {
                        var result = 'fail'
                    }
                    var date = new Date().toDateString();
                    var attemptedOn = date;
                    var obj = {
                        attemptedquizname,
                        result,
                        attemptedOn,
                        percentage,
                        quizToopenkey,
                        questionsAttempted,
                        quizCompleted,
                        totalnumbers
                    }
                    console.log("QUIZ TO OPEN KEEEY", quizToopenkey)
                    firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").update(obj).then((snapshot) => {
                        // var keyforattemptedquiz = snapshot.key;
                        // var keyobj = {
                        //     key: keyforattemptedquiz
                        // }
                        // firebase.database().ref("users/" + userID + "/Attemptedquizes/" + keyforattemptedquiz + "/").update(keyobj);
                        this.setState({
                            showResult: true
                        }, () => {
                            firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").on("value", (snapshottwo) => {
                                var data = snapshottwo.val();
                                console.log("QUIZ SHOW KARNAY K LIYE SNAPSHOT DOT VAL", data);
                                this.setState({
                                    quizresultdate: data.attemptedOn,
                                    quizresultname: data.attemptedquizname,
                                    quizresultpassorfail: data.result,
                                    quizresultpercentage: data.percentage,
                                    takequizcondition: false
                                })
                            })
                        })
                    }).catch((e) => {
                        console.log("Sorry Quiz RESULT COULD NOT BE SAVED!")
                    })
                    // var obj = {
                    //     totalnumbers,

                    // }
                    // firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/")
                    // var totalNum = wholequiz.length;
                    // var numbersgot = totalnumbers
                    // var percentage = numbersgot / totalNum * 100;
                    // console.log("percentage", percentage)
                })
                // alert("NO MORE QUESTIONS")
            }
            // else if (selectedValue !== correctans && slicesecondindex == wholequiz.length) {
            //     console.log("THIRD IF CHALA");
            //     this.setState({
            //         quizCompleted: true
            //     }, () => {
            //         var totalNum = wholequiz.length;
            //         var numbersgot = totalnumbers
            //         var percentage = numbersgot / totalNum * 100;
            //         // console.log("percentage", percentage)
            //     })
            //     // alert("NO MORE QUESTIONS")
            // }
            else {
                this.setState({
                    quizCompleted: true
                }, () => {
                    const { quizCompleted } = this.state;
                    var totalNum = quizTotalquestions;
                    var numbersgot = totalnumbers
                    var percentage = numbersgot / totalNum * 100;
                    var result = '';
                    if (percentage >= 70) {
                        var result = 'passed';
                    }
                    else {
                        var result = 'fail'
                    }
                    var date = new Date().toDateString();
                    var attemptedOn = date;
                    var obj = {
                        attemptedquizname,
                        result,
                        attemptedOn,
                        percentage,
                        quizCompleted
                    }
                    firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").update(obj).then((snapshot) => {
                        // var keyforattemptedquiz = snapshot.key;
                        // var keyobj = {
                        //     key: keyforattemptedquiz
                        // }
                        // firebase.database().ref("users/" + userID + "/Attemptedquizes/" + keyforattemptedquiz + "/").update(keyobj);
                        this.setState({
                            showResult: true
                        }, () => {
                            firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").on("value", (snapshottwo) => {
                                var data = snapshottwo.val();
                                console.log("QUIZ SHOW KARNAY K LIYE SNAPSHOT DOT VAL", data);
                                this.setState({
                                    quizresultdate: data.attemptedOn,
                                    quizresultname: data.attemptedquizname,
                                    quizresultpassorfail: data.result,
                                    quizresultpercentage: data.percentage,
                                    takequizcondition: false
                                })
                            })
                        })
                    }).catch((e) => {
                        console.log("Sorry Quiz RESULT COULD NOT BE SAVED!")
                    })
                    // var obj = {
                    //     totalnumbers,

                    // }
                    // firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/")
                })
            }
            // if (timeupForquiz == true) {
            //     this.setState({
            //         timeupForquiz: false
            //     })
            // }
        })
    }




    //  FUNCTION AFTER TIME UP

    funcAftertimeup() {
        const { wholequiz, attemptingQuizName, takingRemainingquiz, quizCompleted, questionsAttempted, totalnumbers, quizNamebeforestartingquiz, quizToopenkey, userID } = this.state;
        if (wholequiz != null) {
            firebase.database().ref("quizes/" + quizToopenkey + "/").on("value", (s) => {
                var pqr = s.val();
                var ar = [];
                for (var key in pqr) {
                    ar.push(pqr[key])
                }
                var quizTotalquestions = ar.length - 3
                if (takingRemainingquiz == false) {
                    var mnop = wholequiz.length - 3;
                }
                else if (takingRemainingquiz == true) {
                    var mnop = wholequiz.length
                }
                this.setState({
                    minutes: '',
                    seconds: '00',
                    quizCompleted: true
                }, () => {

                    var totalNum = quizTotalquestions;
                    var numbersgot = totalnumbers;
                    var percentage = numbersgot / totalNum * 100;
                    var result = '';
                    if (percentage >= 70) {
                        var result = 'passed';
                    }
                    else {
                        var result = 'fail'
                    }
                    var date = new Date().toDateString();
                    var attemptedOn = date;
                    if (attemptingQuizName == '') {
                        var obj = {
                            attemptedquizname: quizNamebeforestartingquiz,
                            result,
                            attemptedOn,
                            percentage,
                            quizCompleted
                        }
                    }
                    else if (attemptingQuizName != '') {
                        console.log("attemptingQuizName", attemptingQuizName)
                        var obj = {
                            attemptedquizname: attemptingQuizName,
                            result,
                            attemptedOn,
                            percentage,
                            quizCompleted
                        }
                    }

                    firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").update(obj).then((snapshot) => {
                        // var keyforattemptedquiz = snapshot.key;
                        // var keyobj = {
                        //     key: keyforattemptedquiz
                        // }
                        // firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").update(keyobj);
                        this.setState({
                            showResult: true
                        }, () => {
                            firebase.database().ref("users/" + userID + "/Attemptedquizes/" + quizToopenkey + "/").on("value", (snapshottwo) => {
                                var data = snapshottwo.val();
                                console.log("QUIZ SHOW KARNAY K LIYE SNAPSHOT DOT VAL", data);
                                this.setState({
                                    quizresultdate: data.attemptedOn,
                                    quizresultname: data.attemptedquizname,
                                    quizresultpassorfail: data.result,
                                    quizresultpercentage: data.percentage,
                                    takequizcondition: false
                                })
                            })
                        })
                    }).catch((e) => {
                        console.log("Sorry Quiz RESULT COULD NOT BE SAVED!")
                    })

                })
                // var obj = {
                //     totalnumbers,

                // }
                // firebase.database().ref("users/" + userID + "/" + "Attemptedquizes/")
                // var totalNum = wholequiz.length;
                // var numbersgot = totalnumbers
                // var percentage = numbersgot / totalNum * 100;
                // console.log("percentage", percentage)
            })
        }

    }




    // HANDLE RADIO BUTTON

    handleRadiobtn = event => {
        this.setState({ selectedValue: event.target.value });
    };


    // QUIZ RESULT SHOW HONAY K BAAD GO BACK KA FUNCTION

    goBack() {

        this.setState({
            loginSweet: false,
            logoutSweet: false,
            // isLoggedin: true,
            // userID: '1QDMd0cpSMeGPUOBnfTzU8Fm0Ww2',
            // username: 'Muhammad Imad',
            // picture: 'https://graph.facebook.com/1905792756204207/picture',
            createQuiz: false,
            quizName: '',
            quizNamewritten: false,
            questionNo: 1,
            question: '',
            optionone: '',
            optiontwo: '',
            optionthree: '',
            optionfour: '',
            correctoption: '',
            quizUniquekey: '',
            uniqueKeywritten: false,
            show: false,
            takequiz: false,
            quizToopenkey: '',
            wholequiz: null,
            takequizcondition: false,
            slicefirstindex: 0,
            slicesecondindex: 1,
            totalnumbers: 0,
            selectedValue: null,
            showResult: false,
            quizresultdate: '',
            quizresultname: '',
            quizresultpassorfail: '',
            quizresultpercentage: '',
            quizDescription: '',
            quizNamedescriptiondialog: false,
            dialogwhenCorrectansdoesnotmatch: false,
            quizNamebeforestartingquiz: '',
            quizDescriptionbeforestartingquiz: '',
            quizNameanddescriptionbeforestartingcondition: false,
            timeInput: '',
            minutes: '',
            seconds: 60,
            timeupForquiz: false,
            dialogAboutalreadygiventest: false,
            // mycreatedQuizeslist: null,
            // myattemptedQuizeslist: null,
            nestedListopen: false,
            secondnestedListopen: false,
            sidedivShowcondition: true,
            showsubmitWhenattempting: false,
            quizCompleted: false,
            timerStopcondition: true,
            questionsAttempted: 0,
            showingCreatedandattemptquizes: false,
            showingAttemptquizesdiv: false
        })

    }


    // Quiz Name And Description Dialog Close FUNCTION

    quizNamedescriptiondialogclose = () => {
        const { quizCompleted } = this.state;
        if (quizCompleted == false) {
            this.setState({
                quizNamedescriptiondialog: false
            })
        }
    }


    // DIALOG WHEN CORRECT ANSWER  DOES NOT MATCH WITH ANY OPTION

    dialogwhenCorrectansdoesnotmatchClose = () => {
        this.setState({
            dialogwhenCorrectansdoesnotmatch: false
        })
    }


    // STARTING QUIZ BUTTON AFTER SHOWING NAME AND DESCRIPTION

    startQuizaftershowingname() {
        this.setState({
            quizNameanddescriptionbeforestartingcondition: false,
            sidedivShowcondition: false,
            seconds: 60
        })
        const { timerStopcondition } = this.state;
        var intervalHandle = setInterval(() => {
            const { seconds, minutes } = this.state;
            this.setState({
                seconds: seconds - 1
            })
            // if (seconds < 10) {
            //     this.setState({
            //         seconds: "0" + seconds,
            //     })
            // }
            if (seconds == 0) {
                this.setState({
                    minutes: minutes - 1,
                    seconds: 60
                })
            }
            // if (minutes < 10) {
            //     this.setState({
            //         value: "0" + minutes,
            //     })
            // }
            if (timerStopcondition == true) {
                clearInterval(intervalHandle);
                // this.setState({
                //     seconds: 60
                // })
            }
            if (minutes === 0 & seconds === 0) {
                clearInterval(intervalHandle);
                this.setState({
                    timeupForquiz: true,
                    quizCompleted: true,
                    timerStopcondition: true,
                    minutes: '',
                    seconds: 60
                }, () => {
                    this.funcAftertimeup()
                })
            }
            // let time = this.state.minutes;
            // this.secondsRemaining = time * 60;
        }, 1000);
    }



    timeInputhandle(e) {
        this.setState({
            timeInput: e.target.value
        }, () => {
            console.log("TIIIIME CHNAGE")
        })
    }



    // DIALOG ABOUT ALREADY GIVEN TEST WHEN ENTERING KEY

    dialogaboutalreadygiventestFunc = () => {
        // if (this.state.quizCompleted == false) {
        this.setState({
            dialogAboutalreadygiventest: false
        })
        // }
    }



    // NESTED LIST HANDLE FUNC

    nestedlisthandleClick = () => {
        this.setState(state => ({ nestedListopen: !this.state.nestedListopen }));
    };

    // SECOND NESTED LIST OPEN FUNC

    secondnestedlisthandleClick = () => {
        this.setState(state => ({ secondnestedListopen: !this.state.secondnestedListopen }));
    }


    // SHOWING MY QUIZES FROM SIDE DIV

    showMycreatedquizes(name, description, key, time) {
        this.setState({
            loginSweet: false,
            logoutSweet: false,
            createQuiz: false,
            quizName: '',
            quizNamewritten: false,
            questionNo: 1,
            question: '',
            optionone: '',
            optiontwo: '',
            optionthree: '',
            optionfour: '',
            correctoption: '',
            quizUniquekey: '',
            uniqueKeywritten: false,
            show: false,
            takequiz: false,
            quizToopenkey: '',
            wholequiz: null,
            takequizcondition: false,
            slicefirstindex: 0,
            slicesecondindex: 1,
            totalnumbers: 0,
            selectedValue: null,
            showResult: false,
            quizresultdate: '',
            quizresultname: '',
            quizresultpassorfail: '',
            quizresultpercentage: '',
            quizDescription: '',
            quizNamedescriptiondialog: false,
            dialogwhenCorrectansdoesnotmatch: false,
            quizNamebeforestartingquiz: '',
            quizDescriptionbeforestartingquiz: '',
            quizNameanddescriptionbeforestartingcondition: false,
            dialogAboutalreadygiventest: false,
            sidedivShowcondition: true,
            showsubmitWhenattempting: false,
            quizCompleted: false,
            questionsAttempted: 0,
            showingCreatedandattemptquizes: true,
            showingAttemptquizesdiv: false,
            showingalreadycreatedquizname: name,
            showingalreadycreatedquiztime: time,
            showingalreadycreatedquizkey: key,
            showingalreadycreatedquizdescription: description
        })
    }


    // SHOWING MY ATTEMPTED QUIZES FROM SIDE  DIV

    showMyattemptedquiz(name, date, result, percentage) {
        this.setState({
            loginSweet: false,
            logoutSweet: false,
            createQuiz: false,
            quizName: '',
            quizNamewritten: false,
            questionNo: 1,
            question: '',
            optionone: '',
            optiontwo: '',
            optionthree: '',
            optionfour: '',
            correctoption: '',
            quizUniquekey: '',
            uniqueKeywritten: false,
            show: false,
            takequiz: false,
            quizToopenkey: '',
            wholequiz: null,
            takequizcondition: false,
            slicefirstindex: 0,
            slicesecondindex: 1,
            totalnumbers: 0,
            selectedValue: null,
            showResult: false,
            quizresultdate: '',
            quizresultname: '',
            quizresultpassorfail: '',
            quizresultpercentage: '',
            quizDescription: '',
            quizNamedescriptiondialog: false,
            dialogwhenCorrectansdoesnotmatch: false,
            quizNamebeforestartingquiz: '',
            quizDescriptionbeforestartingquiz: '',
            quizNameanddescriptionbeforestartingcondition: false,
            dialogAboutalreadygiventest: false,
            sidedivShowcondition: true,
            showsubmitWhenattempting: false,
            questionsAttempted: 0,
            showingAttemptquizesdiv: true,
            showingCreatedandattemptquizes: false,
            showingalreadyattemptedquizname: name,
            showingalreadyattemptedquizdate: date,
            showingalreadyattemptedquizresult: result,
            showingalreadyattemptedquizpercentage: percentage
        })
    }


    //GO BACK BUTTON WHEN SHOWING ALREADY CREATED ATTEMPTED QUIZ

    goBackforcreatedandattemptedquizes() {
        this.setState({
            loginSweet: false,
            logoutSweet: false,
            createQuiz: false,
            quizName: '',
            quizNamewritten: false,
            questionNo: 1,
            question: '',
            optionone: '',
            optiontwo: '',
            optionthree: '',
            optionfour: '',
            correctoption: '',
            quizUniquekey: '',
            uniqueKeywritten: false,
            show: false,
            takequiz: false,
            quizToopenkey: '',
            wholequiz: null,
            takequizcondition: false,
            slicefirstindex: 0,
            slicesecondindex: 1,
            totalnumbers: 0,
            selectedValue: null,
            showResult: false,
            quizresultdate: '',
            quizresultname: '',
            quizresultpassorfail: '',
            quizresultpercentage: '',
            quizDescription: '',
            quizNamedescriptiondialog: false,
            dialogwhenCorrectansdoesnotmatch: false,
            quizNamebeforestartingquiz: '',
            quizDescriptionbeforestartingquiz: '',
            quizNameanddescriptionbeforestartingcondition: false,
            dialogAboutalreadygiventest: false,
            // mycreatedQuizeslist: null,
            // myattemptedQuizeslist: null,
            nestedListopen: false,
            secondnestedListopen: false,
            sidedivShowcondition: true,
            showsubmitWhenattempting: false,
            quizCompleted: false,
            questionsAttempted: 0,
            showingCreatedandattemptquizes: false,
            showingAttemptquizesdiv: false
        })
    }

    render() {
        const { isLoggedin, showingAttemptquizesdiv, showingalreadyattemptedquizname, showingalreadyattemptedquizpercentage, showingalreadyattemptedquizdate, showingalreadyattemptedquizresult, showingalreadycreatedquizname, showingalreadycreatedquiztime, showingalreadycreatedquizkey, showingalreadycreatedquizdescription, showingCreatedandattemptquizes, sidedivShowcondition, showsubmitWhenattempting, nestedListopen, myattemptedQuizeslist, mycreatedQuizeslist, dialogAboutalreadygiventest, picture, createQuiz, takequiz, takequizcondition, quizToopenkey, question, optionone, optiontwo, optionthree, optionfour, correctoption, quizName, quizNamewritten, uniqueKeywritten, quizUniquekey, username, wholequiz, slicefirstindex, slicesecondindex, selectedValue, totalnumbers, quizCompleted, quizresultdate, quizresultname, quizresultpassorfail, quizresultpercentage, showResult, quizDescription, quizNamedescriptiondialog, dialogwhenCorrectansdoesnotmatch, quizNamebeforestartingquiz, quizDescriptionbeforestartingquiz, quizNameanddescriptionbeforestartingcondition, quizTimepick, minutes, seconds, timeupForquiz } = this.state;
        return (
            <div>
                <ButtonAppBar loginFunc={this.logIn} isLoggedin={isLoggedin} logoutFunc={this.logOut} picture={picture} />

                {isLoggedin == true && sidedivShowcondition == true && <div className="sidediv">
                    <List
                        component="nav"
                        subheader={<ListSubheader component="div" style={{ fontWeight: 'bold', color: '#282c34' }}>QUIZES CREATED</ListSubheader>}
                    // className={classes.root}
                    >
                        <ListItem button className="sideListheading" onClick={this.nestedlisthandleClick}>
                            {/* <ListItemIcon>
            <InboxIcon />
        </ListItemIcon> */}
                            <ListItemText inset primary="CREATED QUIZES" />
                            {this.state.open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        {mycreatedQuizeslist != null && mycreatedQuizeslist.map((data, i) => {
                            return <div key={i}>
                                <Collapse in={nestedListopen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItem button onClick={() => { this.showMycreatedquizes(data.quizName, data.quizDescription, data.quizUniquekey, data.timeInput) }}>
                                            <ListItemIcon>
                                                <StarBorder />
                                            </ListItemIcon>
                                            <ListItemText inset style={{ fontWeight: 'bold' }} primary={data.quizName} />
                                        </ListItem>
                                    </List>
                                </Collapse>
                            </div>
                        })
                        }
                    </List>

                    <List
                        component="nav"
                        subheader={<ListSubheader component="div" style={{ fontWeight: 'bold', color: '#282c34' }}>QUIZES ATTEMPTED</ListSubheader>}
                    // className={classes.root}
                    >
                        <ListItem button className="sideListheading" onClick={this.secondnestedlisthandleClick}>
                            {/* <ListItemIcon>
        <InboxIcon />
    </ListItemIcon> */}
                            <ListItemText inset primary="ATTEMPTED QUIZES" />
                            {this.state.open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        {myattemptedQuizeslist != null && myattemptedQuizeslist.map((data, i) => {
                            return <div key={i}>

                                <Collapse in={this.state.secondnestedListopen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItem button onClick={() => { this.showMyattemptedquiz(data.attemptedquizname, data.attemptedOn, data.result, data.percentage) }}>
                                            <ListItemIcon>
                                                <StarBorder />
                                            </ListItemIcon>
                                            <ListItemText inset style={{ fontWeight: 'bold' }} primary={data.attemptedquizname} />
                                        </ListItem>
                                    </List>
                                </Collapse>
                            </div>
                        })
                        }
                    </List>


                </div>}




                {/* {SHOWTING PREVIOUSLY CREATED QUIZES } */}

                {(isLoggedin == true && showingCreatedandattemptquizes == true) && <div className="showingalredycreatedandatteptedquiz">
                    <h2>QUIZ NAME: {showingalreadycreatedquizname}</h2>
                    <h2>QUIZ DESCRIPTION: {showingalreadycreatedquizdescription}</h2>
                    <h2>QUIZ KEY: {showingalreadycreatedquizkey}</h2>
                    <h2>TIME ALLOWED: {showingalreadycreatedquiztime} Minutes</h2>
                    <Button variant="contained" className="gobackhomebtn" color="primary" onClick={() => this.goBackforcreatedandattemptedquizes()}>BACK</Button>
                </div>}




                {/* {SHOWTING PREVIOUSLY ATTEMPTED QUIZES } */}

                {(isLoggedin == true && showingAttemptquizesdiv == true) && <div className="showingalredycreatedandatteptedquiz">
                    <h2>QUIZ NAME: {showingalreadyattemptedquizname}</h2>
                    <h2>PERCENTAGE: {showingalreadyattemptedquizpercentage}</h2>
                    <h2>RESULT: {showingalreadyattemptedquizresult}</h2>
                    <h2>DATE ATTEMPTED: {showingalreadyattemptedquizdate}</h2>
                    <Button variant="contained" className="gobackhomebtn" color="primary" onClick={() => this.goBackforcreatedandattemptedquizes()}>BACK</Button>
                </div>}




                {/* {VERY FIRST PAGE BEFORE LOGGEDIN} */}

                {isLoggedin == false && <div className="loginfirstdiv">
                    <h1>PLEASE LOGIN FIRST!</h1>
                    <p><span style={{ fontWeight: 'bold' }}>ABOUT: </span>THIS QUIZ APPLICATION IS DEVELOPED BY AN I.T STUDENT MUHAMMAD IMAD CHUGHTAI.</p><br />
                    <br />How to use:<br />
                    <ul>
                        <li>Login From Facebook</li>
                        <li>Select CREATE QUIZ/ENTER QUIZ</li>
                    </ul>
                    <br />Features:<br />
                    <ul>
                        <li>You can create quizes.</li>
                        <li>You can attempt quizes.</li>
                        <li>Auto generates unique key for quizes.</li>
                        <li>Need a unique key for entring quizes.</li>
                        <li>Timer</li>
                        <li>If window is closed because of power failure or something else, user can start quiz from where it was left</li>
                    </ul>
                </div>}




                {/* {BUTTONS DIV FOR CHOSSING CREATE QUIZ OR ENTER QUIZ} */}

                {(isLoggedin == true && showingCreatedandattemptquizes == false && showingAttemptquizesdiv == false && showResult == false && createQuiz == false && username !== '' && takequizcondition == false) && <div className="takecreatediv">
                    <h1>Hey {username}!</h1><br />
                    {/* <h2>CREATE QUIZ</h2> */}
                    <Button variant="contained" className="createquizbtn" color="primary" onClick={() => this.createQuizbtn()}>CREATE QUIZ</Button><br />
                    <h2>OR</h2><br />
                    <Button variant="contained" color="primary" className="takequizbtn" onClick={() => this.takeQuizbtn()}>ENTER QUIZ</Button>
                </div>}




                {/* {WRINTING QUIZ NAME AND DESCRIPTION WHEN CREATING QUIZ} */}

                {(createQuiz == true && quizNamewritten == false) && <div className="quiznamediv">
                    <h1>WRITE QUIZ NAME</h1>

                    <TextField
                        required
                        id="outlined-name"
                        label="QUIZ NAME"
                        className="questioninputcls"
                        value={quizName}
                        onChange={(e) => this.quiznameHandle(e)}
                        margin="normal"
                        variant="outlined"
                    /><br /><br />

                    <TextField
                        required
                        id="outlined-name"
                        label="SHORT DESCRIPTION"
                        className="questioninputcls"
                        value={quizDescription}
                        onChange={(e) => this.quizDescriptionhandle(e)}
                        margin="normal"
                        variant="outlined"
                    /><br /><br />

                    {/* <TextField
                        id="time"
                        label="TIME FOR QUIZ"
                        type="time"
                        className="without_ampm"
                        // value={quizTimepick}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    /> */}
                    <label className="quizTimelabel">QUIZ TIME IN MINUTES: </label>
                    <input type="number" min="1" maxLength="2" onChange={(e) => { this.timeInputhandle(e) }} className="without_ampm" />
                    <br /><br />
                    <Button variant="contained" color="primary" className="nextquesbtn" onClick={() => this.quizNamebtn()}>NEXT</Button>
                </div>}




                {/* {SHOWING UNIQUE KEY WHEN CREATING QUIZ} */}

                {(quizNamewritten == true && uniqueKeywritten == false) && <div className="quiznamediv">
                    <h1 className="headingclassofkeyforuiz">UNIQUE KEY FOR QUIZ</h1>

                    <TextField
                        id="outlined-read-only-input"
                        label="QUIZ KEY"
                        defaultValue={quizUniquekey}
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                        className="uniquekeycls"
                    />



                    {/* <TextField
                        required
                        id="outlined-name"
                        label="UNIQUE KEY"
                        className="questioninputcls"
                        value={quizUniquekey}
                        onChange={(e) => this.uniquekeyHandle(e)}
                        margin="normal"
                        variant="outlined"
                    /> */}
                    <br /><br />
                    <Button variant="contained" color="primary" className="nextquesbtn" onClick={() => this.quizKeybtn()}>NEXT</Button>
                </div>}




                {/* {WRITING QUESTIONS WHEN CREATING QUIZ} */}

                {
                    (createQuiz == true && sidedivShowcondition == false && quizNamewritten == true && uniqueKeywritten == true) && <div className="createquizdiv">
                        {/* <form> */}
                        <h1>  Question: {this.state.questionNo} </h1>

                        <TextField
                            id="outlined-name"
                            label="Question"
                            className="questioninputcls"
                            value={question}
                            onChange={(e) => this.questionHandle(e)}
                            margin="normal"
                            variant="outlined"
                        /><br />

                        <TextField
                            id="outlined-name"
                            label="Option 1"
                            className="optioninputcls"
                            value={optionone}
                            onChange={(e) => this.optiononeHandle(e)}
                            margin="normal"
                            variant="outlined"
                        /><br />

                        <TextField
                            id="outlined-name"
                            label="Option 2"
                            className="optioninputcls"
                            value={optiontwo}
                            onChange={(e) => this.optiontwoHandle(e)}
                            margin="normal"
                            variant="outlined"
                        /><br />

                        <TextField
                            id="outlined-name"
                            label="Option 3"
                            className="optioninputcls"
                            value={optionthree}
                            onChange={(e) => this.optionthreeHandle(e)}
                            margin="normal"
                            variant="outlined"
                        /><br />

                        <TextField
                            id="outlined-name"
                            label="Option 4"
                            className="optioninputcls"
                            value={optionfour}
                            onChange={(e) => this.optionfourHandle(e)}
                            margin="normal"
                            variant="outlined"
                        /><br />

                        <TextField
                            id="outlined-name"
                            placeholder="WRITE CORRECT ANS"
                            label="Correct Option"
                            className="optioninputcls"
                            value={correctoption}
                            onChange={(e) => this.correctoptionHandle(e)}
                            margin="normal"
                            variant="outlined"
                        /><br /><br />
                        <Button variant="contained" className="nextquesbtnwhensidedivoff" color="primary" onClick={() => this.nextBtn()}>NEXT</Button>
                        <Button variant="contained" className="submitquesbtn" color="primary" onClick={() => this.submitBtn()}>SUBMIT</Button>
                        {/* </form> */}

                    </div>
                }




                {/* {SWEET ALERTS} */}

                <SweetAlert
                    show={this.state.loginSweet}
                    title="CONGRATS!"
                    text="SUCCESFULLY LOGGED IN!"
                    onConfirm={() => this.setState({ loginSweet: false })}
                />

                <SweetAlert
                    show={this.state.logoutSweet}
                    title="LOGGED OUT!"
                    // text="SUCCESFULLY LOGGEDIN"
                    onConfirm={() => this.setState({ logoutSweet: false })}
                />

                <SweetAlert
                    show={this.state.show}
                    title="CONGRATS!"
                    text="QUIZ CREATED SUCCESFULLY!"
                    onConfirm={() => this.setState({ show: false })}
                />




                {/* {WRITING QUIZ KEY WHEN ENTRING QUIZ} */}

                {(isLoggedin == true && takequiz == true) && <div className="writequizkeycls">
                    <h1>WRITE QUIZ KEY</h1>
                    <TextField
                        className="keyinputtoenterquiz"
                        id="outlined-name"
                        label="QUIZ KEY"
                        value={quizToopenkey}
                        onChange={(e) => this.keyinputHandle(e)}
                        margin="normal"
                        variant="outlined"
                    /><br /><br />
                    <Button variant="contained" className="quizkeysubmitbtn" color="primary" onClick={() => this.submitKeytoenter()}>SUBMIT</Button>
                </div>}




                {/* {SHOWING QUIZ INFORMATION BEFORE STARTING QUIZ} */}

                {(quizNamebeforestartingquiz != '' && quizDescriptionbeforestartingquiz != '' && quizNameanddescriptionbeforestartingcondition == true) && <div className="showingQuizinfodiv">
                    <h1>QUIZ NAME: {quizNamebeforestartingquiz}</h1>
                    <h2>QUIZ DESCRIPTION: {quizDescriptionbeforestartingquiz}</h2>
                    <Button variant="contained" className="nextquesbtn" color="primary" onClick={() => this.startQuizaftershowingname()}>START</Button>
                </div>}




                {/* {SHOWING QUIZ QUESTION TO ATTEMPT} */}

                <div>
                    {(takequizcondition == true && wholequiz != null && quizNameanddescriptionbeforestartingcondition == false) && <div className="timequizdiv">
                        REMAINING TIME {minutes} : {seconds}</div>}
                    {(takequizcondition == true && wholequiz != null && quizNameanddescriptionbeforestartingcondition == false) && wholequiz.slice(slicefirstindex, slicesecondindex).map((data, i) => {
                        return <div className="createquizdiv" key={i}>
                            <div className="xy">
                                <h1 className="honeofquizname"> QUIZ NAME: {data.quizName}</h1>
                                {/* <h1 className="timeofquiztaking"> Time: </h1> */}
                            </div>
                            <h1>  Question: {data.questionNo} </h1>

                            <TextField
                                className="takingquizquestiontxt"
                                id="standard-multiline-flexible"
                                label="Question"
                                multiline
                                rowsMax="6"
                                value={data.question}
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />


                            <br /><br />

                            <FormControlLabel
                                value={data.optionone}
                                control={<Radio color="primary" onChange={this.handleRadiobtn} value={data.optionone} checked={selectedValue === data.optionone} />}
                                label={data.optionone}
                            /><br /><br />
                            <FormControlLabel
                                value={data.optiontwo}
                                control={<Radio color="primary" onChange={this.handleRadiobtn} value={data.optiontwo} checked={selectedValue === data.optiontwo} />}
                                label={data.optiontwo}
                            /><br /><br />
                            <FormControlLabel
                                value={data.optionthree}
                                control={<Radio color="primary" onChange={this.handleRadiobtn} value={data.optionthree} checked={selectedValue === data.optionthree} />}
                                label={data.optionthree}
                            /><br /><br />
                            <FormControlLabel
                                value={data.optionfour}
                                control={<Radio color="primary" onChange={this.handleRadiobtn} value={data.optionfour} checked={selectedValue === data.optionfour} />}
                                label={data.optionfour}
                            /><br /><br />
                            {/* <h2>NUMBERS:{totalnumbers}</h2> */}
                            {showsubmitWhenattempting == false && <Button variant="contained" className="nextquesbtn" color="primary" onClick={() => this.nextquestionBtn(data.correctoption, data.quizName, i)}>NEXT</Button>}
                            {showsubmitWhenattempting == true && <Button variant="contained" className="submitquesbtnwhenattempting" color="primary" onClick={() => this.submitquestionBtn(data.correctoption, data.quizName, i)}>SUBMIT</Button>}
                        </div>
                    })}
                </div>




                {/* {SHOWING RESULT AFTER QUIZ COMPLETION} */}

                {(showResult == true && quizCompleted == true && quizresultdate != '' && quizresultname != '' && quizresultpassorfail != '') && <div className="createquizdiv">
                    <h1>Quiz Name: {quizresultname}</h1><h2>Result: {quizresultpassorfail}</h2><h2>Your Percentage: {quizresultpercentage}</h2>
                    <Button variant="contained" className="gobackhomebtn" color="primary" onClick={() => this.goBack()}>Go Back To Home Page</Button>
                </div>}




                {/* {DIALOG SHOW WHEN NAME OR DESCRIPTION NOT WRITTEN WHILE MAKING QUIZ} */}

                <Dialog
                    open={quizNamedescriptiondialog}
                    onClose={this.quizNamedescriptiondialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"SORRY!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            PLEASE FIRST WRITE QUIZ NAME AND DESCRIPTION!
            </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.quizNamedescriptiondialogclose} color="primary" autoFocus>
                            Okay
            </Button>
                    </DialogActions>
                </Dialog>



                {/* {DIALOG WHEN COORECT ANSWER DOES NOT MATCH WITH ANY OPTION} */}

                <Dialog
                    open={dialogwhenCorrectansdoesnotmatch}
                    onClose={this.dialogwhenCorrectansdoesnotmatchClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"NO MATCH FOUND!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            CORRECT OPTION DOES NOT MATCH WITH ANY OPTIONS.
            </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.dialogwhenCorrectansdoesnotmatchClose} color="primary" autoFocus>
                            Okay
            </Button>
                    </DialogActions>
                </Dialog>



                <Dialog
                    open={dialogAboutalreadygiventest}
                    onClose={this.dialogaboutalreadygiventestFunc}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"ACCESS DENIED"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You have already given this quiz.
            </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.dialogaboutalreadygiventestFunc} color="primary" autoFocus>
                            Okay
            </Button>
                    </DialogActions>
                </Dialog>

                {/* <input type="time" className="without_ampm" /> */}
            </div >
        );
    }
}

export default Mainquiz;