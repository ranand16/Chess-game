import React from 'react';
import { Input } from 'reactstrap';
import io from 'socket.io-client'
import { uuid } from "uuidv4"
import './App.css'

let socket;
let darkClassArray = ["rook_dark", "knight_dark", "bishop_dark", "queen_dark", "king_dark", "pawn_dark"];
let whiteClassArray = ["rook_white", "knight_white", "bishop_white", "queen_white", "king_white", "pawn_white"];
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

      onGoingMoveOne: false, // first click to select a cell for starting a move 
      onGoingMoveTwo: false, // second click to select a cell to end the move

      playerSide: true, // true for dark and false for white
      chessGameData: 
      [
        ["rook_dark", "knight_dark", "bishop_dark", "queen_dark", "king_dark", "bishop_dark", "knight_dark", "rook_dark"],
        ["pawn_dark", "pawn_dark", "pawn_dark", "pawn_dark", "pawn_dark", "pawn_dark", "pawn_dark", "pawn_dark"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["pawn_white", "pawn_white", "pawn_white", "pawn_white", "pawn_white", "pawn_white", "pawn_white", "pawn_white"],        
        ["rook_white", "knight_white", "bishop_white", "queen_white", "king_white", "bishop_white", "knight_white", "rook_white"],
      ]

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

  clickCell = (e) => {
    let classArray = darkClassArray;
    let clickedPlayer = null;
    const { onGoingMoveOne, onGoingMoveTwo, playerSide } = this.state;  
    if(!playerSide) classArray = whiteClassArray;
    let classnames = e.target.className
    let selectedClassArray = classnames.split(" ");
    let commonClassArray = selectedClassArray.filter(function(n) {
      return classArray.indexOf(n) !== -1;
    })
    if(commonClassArray.length<1) return // you have clicked an empty cell 
    clickedPlayer = commonClassArray[0];
    if(onGoingMoveOne && !onGoingMoveTwo){
      // start the second step
    } else if(onGoingMoveOne && onGoingMoveTwo){
      // complete the move
      this.setState({ onGoingMoveOne: false, onGoingMoveTwo: false })
    } else {
      // start the first step of move
      // this.setState({ onGoingMoveOne: true, onGoingMoveTwo: false })
      // check type of selected player & highlight the possible destinations
      console.log(classArray)
      switch(clickedPlayer){
        case classArray[0]: // rook
          console.log(clickedPlayer)

        break;
        case classArray[1]: // knight
          console.log(clickedPlayer)
        break;
        case classArray[2]: // bishop
          console.log(clickedPlayer)
        break;
        case classArray[3]: // queen 
          console.log(clickedPlayer)
        break;
        case classArray[4]: // king
          console.log(clickedPlayer)
        break;
        case classArray[5]: // pawn
          console.log(clickedPlayer)

        break;
        default:
        break;
      }

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
    const { joinScreen, gameScreen, chessGameData, currentRoomId, currentUserId } = this.state
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
              <div className={`gamePaneCell whiteBackground ${chessGameData[0][0]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[0][1]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[0][2]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[0][3]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[0][4]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[0][5]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[0][6]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[0][7]}`} onClick={this.clickCell}></div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={`gamePaneCell blackBackground ${chessGameData[1][0]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[1][1]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[1][2]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[1][3]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[1][4]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[1][5]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[1][6]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[1][7]}`} onClick={this.clickCell}></div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={`gamePaneCell whiteBackground ${chessGameData[2][0]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[2][1]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[2][2]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[2][3]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[2][4]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[2][5]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[2][6]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[2][7]}`} onClick={this.clickCell}></div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={`gamePaneCell blackBackground ${chessGameData[3][0]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[3][1]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[3][2]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[3][3]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[3][4]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[3][5]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[3][6]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[3][7]}`} onClick={this.clickCell}></div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={`gamePaneCell whiteBackground ${chessGameData[4][0]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[4][1]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[4][2]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[4][3]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[4][4]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[4][5]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[4][6]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[4][7]}`} onClick={this.clickCell}></div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={`gamePaneCell blackBackground ${chessGameData[5][0]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[5][1]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[5][2]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[5][3]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[5][4]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[5][5]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[5][6]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[5][7]}`} onClick={this.clickCell}></div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={`gamePaneCell whiteBackground ${chessGameData[6][0]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[6][1]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[6][2]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[6][3]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[6][4]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[6][5]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[6][6]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[6][7]}`} onClick={this.clickCell}></div>
            </div>
            <div className={"gamePaneRow"}>
              <div className={`gamePaneCell blackBackground ${chessGameData[7][0]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[7][1]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[7][2]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[7][3]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[7][4]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[7][5]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell blackBackground ${chessGameData[7][6]}`} onClick={this.clickCell}></div>
              <div className={`gamePaneCell whiteBackground ${chessGameData[7][7]}`} onClick={this.clickCell}></div>
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