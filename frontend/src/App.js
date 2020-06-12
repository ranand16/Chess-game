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
      // joinScreen: "join", // can be false, "create" as well
      joinScreen: false, // can be false, "create" as well
      gameScreen: true,
      userNameInput: "", // used in onchange handler and the final value
      roomNameInput: "", // used in onchange handler and the final value

      currentUserId: false, // room id for player after joining response
      currentRoomId: false, // user id for player after joining response

      onGoingMoveOne: false, // first click to select a cell for starting a move 
      onGoingMoveTwo: false, // second click to select a cell to end the move

      playerSide: true, // true for dark and false for white
      chessGameData: [
        ["rook_dark", "knight_dark", "bishop_dark", "queen_dark", "king_dark", "bishop_dark", "knight_dark", "rook_dark"],
        ["pawn_dark", "pawn_dark", "pawn_dark", "pawn_dark", "pawn_dark", "pawn_dark", "pawn_dark", "pawn_dark"],
        ["na", "na", "na", "na", "na", "na", "na", "na"],
        ["na", "na", "na", "na", "na", "na", "na", "na"],
        ["na", "na", "na", "na", "na", "na", "na", "na"],
        ["na", "na", "na", "na", "na", "na", "na", "na"],
        ["pawn_white", "pawn_white", "pawn_white", "pawn_white", "pawn_white", "pawn_white", "pawn_white", "pawn_white"],        
        ["rook_white", "knight_white", "bishop_white", "queen_white", "king_white", "bishop_white", "knight_white", "rook_white"],
      ],
      probableDestinations: []
    }
  }

  componentDidMount(){
    // socket = io('localhost:5000')
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

  clickCell = (i ,j, e) => {
    console.log(i, j)
    let classArray = darkClassArray;
    let clickedPlayer = null;
    const { onGoingMoveOne, onGoingMoveTwo, playerSide, chessGameData } = this.state;  
    if(!playerSide) classArray = whiteClassArray;
    clickedPlayer = chessGameData[i][j];
    console.log(onGoingMoveOne, onGoingMoveTwo)
    if(onGoingMoveOne && !onGoingMoveTwo){
      // start the second step
    } else if(onGoingMoveOne && onGoingMoveTwo){
      // complete the move
      this.setState({ onGoingMoveOne: false, onGoingMoveTwo: false })
    } else {
      // check if the clicked cell is not empty
      if(clickedPlayer && clickedPlayer==="na") return // you have clicked an empty cell 
      console.log(clickedPlayer)
      // start the first step of move
      // check type of selected player & highlight the possible destinations
      let probableDestinations = this.calculateDestinations(parseInt(i), parseInt(j), clickedPlayer, playerSide, classArray, chessGameData)
      // this.setState({ onGoingMoveOne: true, onGoingMoveTwo: false, probableDestinations })
      this.setState({ probableDestinations })
    }
  }

  calculateDestinations = (i, j, playerType, playerSide, classArray, chessGameData) => {
    console.log(i, j, playerType, classArray)
    let hightlightArray = [];
    switch(playerType){
      case classArray[0]: // rook
        // console.log(playerType)
      break;
      case classArray[1]: // knight
        console.log(playerType)
      break;
      case classArray[2]: // bishop
        console.log(playerType)
      break;
      case classArray[3]: // queen 
        console.log(playerType)
      break;
      case classArray[4]: // king
        console.log(playerType)
      break;
      case classArray[5]: // pawn
        if(playerSide){ // dark
          hightlightArray.push({ x:i+1, y:j, enemyCell: chessGameData[i+1][j]==="na"?false:true })
          if(i===1) hightlightArray.push({ x:i+2, y:j, enemyCell: chessGameData[i+2][j]==="na"?false:true });
        } else { // white
          hightlightArray.push({ x:i-1, y:j, enemyCell: chessGameData[i-1][j]==="na"?false:true });
          if(i===6) hightlightArray.push({ x:i-2, y:j, enemyCell: chessGameData[i-2][j]==="na"?false:true });
        }
      break;
      default:
      break;
    }
    return hightlightArray
  }

  enterGame = (type) => { // create or join
    console.log(type)
    const { userNameInput, roomNameInput, chessGameData, probableDestinations } = this.state
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
    const { joinScreen, gameScreen, chessGameData, probableDestinations, currentRoomId, currentUserId } = this.state
    // console.log(probableDestinations)
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
            {
              chessGameData.map((data, i)=>{
                return (
                  <div key={`${i}`} className={"gamePaneRow"}>
                    {data.map((eachData, j)=>{
                      let isProbableDestination = false
                      let isDanger = false
                      for(let d=0;d<probableDestinations.length;d++){
                        if(probableDestinations[d]["enemyCell"]){
                          isDanger = probableDestinations[d]["enemyCell"]?probableDestinations[d]["enemyCell"]:false
                        }
                        isProbableDestination = probableDestinations[d]["x"] === i && probableDestinations[d]["y"] === j
                        console.log(isProbableDestination, probableDestinations[d]["x"], i, probableDestinations[d]["y"], j)
                      }
                      let classNames = `gamePaneCell ${((i%2===0 && j%2===0) || (i%2!==0 && j%2!==0))?("whiteBackground"):("blackBackground")} ${isProbableDestination?"highlight":null} ${isDanger?"highlight_danger":""} ${chessGameData[i][j]}`;
                      return ( <div key={`${i}+${j}`} className={classNames} onClick={this.clickCell.bind(this,i,j)}></div> )
                    })}
                  </div>
                )
              })
            }
          </div>
          <div id="gameRightPane">This is right pane</div>
        </div>}
      </div>  
    );
  }
}

export default App;