import React from 'react';
import { Input, Button } from 'reactstrap';
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
      playerSide: null, // true for dark and false for white
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
      probableDestinations: [],
      clcikedPlayeri: null, // i value after selecting a player
      clcikedPlayerj: null, // j value after selecting a player,
      players: ["",""], // players playing 
      spectators: ["",""] // people spectating 
    }
  }

  componentDidMount(){
    socket = io('localhost:5000')
    socket.on('updateState', (res)=>{
      this.setState({ players: res["room"]["players"] })
      console.log(res)
    })
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
    let playerType = "dark";
    let clickedPlayer = null;
    const { onGoingMoveOne, onGoingMoveTwo, playerSide, probableDestinations, chessGameData, clcikedPlayeri, clcikedPlayerj } = this.state;  
    if(playerSide && playerSide !== "dark") { classArray = whiteClassArray; playerType="white" }
    clickedPlayer = chessGameData[i][j];
    let ifClickedOneOfDest = probableDestinations.filter(dest=>dest["x"] === i && dest["y"] === j)
    console.log(playerType, clickedPlayer, clickedPlayer.split("_")[1]) 
    if(ifClickedOneOfDest && ifClickedOneOfDest.length>0){
      // complete the move 
      if(clickedPlayer!=="na" && playerType !== clickedPlayer.split("_")[1]) {// there is enemy player at destination 
        chessGameData[i][j] = chessGameData[clcikedPlayeri][clcikedPlayerj]
        chessGameData[clcikedPlayeri][clcikedPlayerj] = "na";
        this.setState({ chessGameData, probableDestinations: [] })
      } else if(clickedPlayer==="na"){ // no player at destination 
        chessGameData[i][j] = chessGameData[clcikedPlayeri][clcikedPlayerj]
        chessGameData[clcikedPlayeri][clcikedPlayerj] = "na";
        this.setState({ chessGameData, probableDestinations: [] })
      }
    } else {
      // check if the clicked cell is not empty
      if(clickedPlayer && clickedPlayer==="na") return // you have clicked an empty cell 
      // start the first step of move
      // check type of selected player & highlight the possible destinations
      let probableDestinations = this.calculateDestinations(parseInt(i), parseInt(j), clickedPlayer, playerSide, classArray, chessGameData)
      // this.setState({ onGoingMoveOne: true, onGoingMoveTwo: false, probableDestinations })
      this.setState({ probableDestinations, clcikedPlayeri: i, clcikedPlayerj: j })
    }
  }

  calculateDestinations = (i, j, clickedPlayer, playerSide, classArray, chessGameData) => {
    console.log(i, j, clickedPlayer, classArray)
    let hightlightArray = [];
    switch(clickedPlayer){
      case classArray[0]: // rook
        // console.log(clickedPlayer)
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
        if(playerSide && playerSide === "dark"){ // dark
          // for highlighting non attacking destinations
          if(i+1<=7 && chessGameData[i+1][j]==="na") hightlightArray.push({ x:i+1, y:j, enemyCell: false })
          if(i===1 && chessGameData[i+1][j]==="na") hightlightArray.push({ x:i+2, y:j, enemyCell: false });
          // for highlighting red for enemy at just diagonals
          console.log(chessGameData[i+1][j-1])
          if(i+1<=7 && j-1>=0 && chessGameData[i+1][j-1]!=="na" && chessGameData[i+1][j-1].split("_")[1]!=="dark") hightlightArray.push({ x:i+1, y:j-1, enemyCell: true })
          if(i+1<=7 && j+1<=7 && chessGameData[i+1][j+1]!=="na" && chessGameData[i+1][j+1].split("_")[1]!=="dark") hightlightArray.push({ x:i+1, y:j+1, enemyCell: true })
        } else { // white
          // for highlighting non attacking destinations
          if(i-1>=0 && chessGameData[i-1][j]==="na") hightlightArray.push({ x:i-1, y:j, enemyCell: false });
          if(i===6 && chessGameData[i-1][j]==="na") hightlightArray.push({ x:i-2, y:j, enemyCell: false });
          // for highlighting red for enemy at just diagonals
          if(i+1<=7 && i-1>=0 && j+1<=7 && j-1>=0 && chessGameData[i-1][j+1]!=="na" && chessGameData[i-1][j+1].split("_")[1]!=="white") hightlightArray.push({ x:i+1, y:j-1, enemyCell: true })
          if(i+1<=7 && i-1>=0 && j+1<=7 && j-1>=0 && chessGameData[i-1][j-1]!=="na" && chessGameData[i-1][j-1].split("_")[1]!=="white") hightlightArray.push({ x:i+1, y:j+1, enemyCell: true })
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
            this.setState({ gameScreen: true, joinScreen: false, currentRoomId: respData["room"]["id"], currentUserId: respData["user"]["id"], players: respData["room"]["players"], spectators: respData["room"]["spectators"]})
          } else if(type === "join" && !respData["room"]){
            // error - this room doesnot exist
          } else {
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

  participate = async (playerSide) => {
    const { currentRoomId, currentUserId } = this.state;
    console.log(currentRoomId, currentUserId)
    socket.emit('participate', currentUserId, currentRoomId, playerSide, (response)=>{
      this.setState({ players: response['data']["players"] })
    })
  }

  joinAsWhite = async () => {
    this.setState({ playerSide: "white" })
    await this.participate("white")
  }

  joinAsDark = async () => {
    this.setState({ playerSide: "dark" })
    await this.participate("dark")
  }

  render (){
    const { joinScreen, gameScreen, chessGameData, probableDestinations, playerSide, players, currentRoomId, currentUserId } = this.state
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
          <div id="gameLeftPane">
            {playerSide === "white" &&
              <p>
                You 
              </p>
            }
            { players[1] && players[1]!=="" && 
              <div>
                {players[1]["name"]}
              </div>
            }
            { players[1]==="" &&
              <div>
                <span>Join as White</span>
                <Button disabled={playerSide} onClick={this.joinAsWhite}>Join</Button>
              </div>
            }
          </div>
          <div id="gamePane">
            {
              chessGameData.map((data, i)=>{
                return (
                  <div key={`${i}`} className={"gamePaneRow"}>
                    {data.map((eachData, j)=>{
                      let isProbableDestination = false
                      let isDanger = false
                      for(let d=0;d<probableDestinations.length;d++){
                        if(probableDestinations[d]["enemyCell"] && probableDestinations[d]["x"] === i && probableDestinations[d]["y"] === j){
                          if(!isDanger) isDanger = probableDestinations[d]["enemyCell"]?probableDestinations[d]["enemyCell"]:false
                          isProbableDestination = false
                        }
                        if(!isProbableDestination) isProbableDestination = probableDestinations[d]["x"] === i && probableDestinations[d]["y"] === j
                      }
                      let classNames = `gamePaneCell ${((i%2===0 && j%2===0) || (i%2!==0 && j%2!==0))?("whiteBackground"):("blackBackground")} ${isProbableDestination?"highlight":null} ${isDanger?"highlight_danger":null} ${chessGameData[i][j]}`;
                      return ( <div key={`${i}+${j}`} className={classNames} onClick={playerSide?this.clickCell.bind(this,i,j):()=>{}}></div>  )
                    })}
                  </div>
                )
              })
            }
          </div>
          <div id="gameRightPane">
            { playerSide === "dark" &&
              <p>
                You 
              </p> 
            }
            { players[0] && players[0]!=="" && 
              <div>
                {players[0]["name"]}
              </div>
            }
            { players[0]==="" &&
              <div>
                <span>Join as Dark</span>
                <Button disabled={playerSide} onClick={this.joinAsDark}>Join</Button>
              </div>
            }
          </div>
        </div>}
      </div>  
    );
  }
}

export default App;