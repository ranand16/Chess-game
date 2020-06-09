import React from 'react';
import { Input } from 'reactstrap';
import io from 'socket.io-client'
import { uuid } from "uuidv4"
import './App.css'

let socket;
class App extends React.Component {
  constructor(props){
    super(props);
    console.log(props);
    this.state = {
      joinScreen: "join", // can be false, "create" as well
      gameScreen: false,
      userNameInput: "", // used in onchange handler and the final value
      roomNameInput: "", // used in onchange handler and the final value

      currentUserId: false, // room id for player after joining response
      currentRoomId: false, // user id for player after joining response
    }
  }

  componentDidMount(){
    socket = io('localhost:5000')
  }

  userNameChange = (e) => {
    if(e && e.target && e.target.value) {
      this.setState({ userNameInput: e.target.value })
    }
  }

  roomNameChange = (e) => {
    if(e && e.target && e.target.value) {
      this.setState({ roomNameInput: e.target.value })
    }
  }

  enterGame = (type) => { // create or join
    console.log(type)
    const { userNameInput, roomNameInput } = this.state
    if(userNameInput && roomNameInput){
      socket.emit("joinroom", { userName: userNameInput, roomName: roomNameInput }, type, (response)=>{
        console.log(response);
        if(response.status){
          let respData = response["data"]
          if(type === "join" && respData["room"] && respData["user"] && respData["room"]["id"] && respData["user"]["id"]){
            this.setState({ gameScreen: true, joinScreen: false, currentRoomId: respData["room"]["id"], currentUserId: respData["user"]["id"] })
          } else if(type === "join" && !respData["room"]){
            // error - this room doesnot exist
          } else {
            console.log("This was to create a room")
            this.setState({ gameScreen: true, joinScreen: false, currentRoomId: respData["room"]["id"], currentUserId: respData["user"]["id"] })
          }
        } else {
          console.error("There was a error ", response["data"])
        }
      })
    } else {
      console.error("Username and roomname input fields are mandatory.")
      console.log(userNameInput, roomNameInput)
    }
  }

  participate = () => {
    const { userNameInput, roomNameInput } = this.state;
    socket.emit('participate',{ userName: userNameInput, roomName: roomNameInput }, (response)=>{
      console.log(response);
      this.setState({ gameScreen: true, joinScreen: false })
    })
  }

  render (){
    const { joinScreen, gameScreen, currentRoomId, currentUserId } = this.state
    return (
      <div className="App">
        {joinScreen && <div id="joinScreen">
          <div className="form__group field">
            <Input placeholder="User name" id="userName" className={"form__field"} onChange={this.userNameChange} /><br/>
            <label htmlFor="userName" className="form__label">Full Name</label><br/>
          </div>
          <div className="form__group field">
            <Input placeholder="Room name" id="roomName" className={"form__field"} onChange={this.roomNameChange} /><br/>
            <label htmlFor="roomName" className="form__label">Room name</label><br/>
          </div>
          <button onClick={this.enterGame.bind(this, "create")}>Create</button>
          <button onClick={this.enterGame.bind(this, "join")}>Join</button>
        </div>}
        {gameScreen && <div id="gameScreen">
          <div id="gameLeftPane">This is left pane</div>
          <div id="gamePane">
            <div className={"gamePaneRow"}>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
              <div className={"gamePaneCell blackBackground"}>22</div>
              <div className={"gamePaneCell whiteBackground"}>22</div>
            </div>
          </div>
          <div id="gameRightPane">This is right pane</div>
        </div>}
      </div>  
    );
  }
}

export default App;
 
  // {
  //   "status": true,
  //   "data": {
  //     "room": {
  //       "id": "ec7c7f34-6020-4426-acc1-8ce27676e5c7",
  //       "name": "Sector 51",
  //       "spectators": [
  //         {
  //           "id": "5d393a3e-169c-4041-a29f-d5c66d8b10c3",
  //           "name": "Rishabh"
  //         },
  //         {
  //           "id": "44682458-b3e0-4c09-a548-3c6c7e3fc564",
  //           "name": "Rishabh"
  //         }
  //       ],
  //       "players": []
  //     },
  //     "user": {
  //       "id": "44682458-b3e0-4c09-a548-3c6c7e3fc564",
  //       "name": "Rishabh"
  //     }
  //   }
  // }