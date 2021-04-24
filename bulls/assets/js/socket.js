
import {Socket} from "phoenix";

let socket = new Socket(
    "/socket",
    { params: { token: "" } }
);

//good      
socket.connect();
//good
let channel = socket.channel("game", {});

//good
let state = {
  guesses: [],
  gameOver: false,
  bulls: [],
  cows: [],
};

//good
let callback = null;

// The server sent us a new state.
// Good
function state_update(st) {
  state = st;
  if (callback) {
    callback(st);
  }
}

// Good
export function ch_join(cb) {
    callback = cb;
    callback(state);
}

//good I think
//for pushing guesses and such
export function ch_push(user_guess) {
  channel.push("guess", user_guess)
         .receive("ok", state_update)
         .receive("error", resp => {console.log("Push filed", resp)});

}

//for reseting state in the elixir end
//good I think
export function ch_reset() {
  channel.push("reset", {})
         .receive("ok", state_update)
         .receive("error", resp => {console.log("Push failed (on reset)", resp)});
}


//good
channel.join()
  .receive("ok", state_update)
  .receive("error", resp => { console.log("Unable to join", resp) });


export default socket