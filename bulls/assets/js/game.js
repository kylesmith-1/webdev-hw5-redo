//This code draws heavily in stucture form the hangman lecture notes
//https://github.com/NatTuck/scratch-2021-01/blob/master/notes-4550/04-react-intro/notes.md
export function uniq(xs) {
    return Array.from(new Set(xs));
}

export function get_bulls_and_cows(secret, guess) {
    var secretArr = secret.split('');
    var guessArr = guess.split('');
    var bulls = 0;
    var cows = 0;
    for (var i = 0; i < 4; i++) {
        if (guessArr[i] === secretArr[i]) {
            bulls += 1;
        }
        else if (secretArr.includes(guessArr[i])) {
            cows += 1;
        }
    }
    return "B" + bulls + " C" + cows;
}

export function all_bulls_and_cows(secret, guesses) {
    var bsAndCs = []
    for (let gg of guesses) {
        bsAndCs.push(get_bulls_and_cows(secret, gg));
    }
    return bsAndCs;
}


export function lives_left(guesses) {
    return 8 - guesses.length;
}

export function new_secret() {
    //4 random digits 0-9
    //Not the best way to get unique digits, but it will do 
    var num = Math.floor(Math.random() * 10) + "";
    while (num.length < 4) {
        var newNum = Math.floor(Math.random() * 10);
        if (!num.includes(newNum)) {
            num += newNum;
        }
    }
    return num;
}

//Make into a dictionary
export function guesses_and_results(secret, guesses) {
    var res = [];
    var allBullsAndCows = all_bulls_and_cows(secret, guesses);
    for (var i = 0; i < allBullsAndCows.length; i++) {
        res.push({ guess: guesses[i], results: allBullsAndCows[i] });
    }
    return res;
}

//makes sure there are 4 unique digits in the guess
export function validate_guess(guess) {
    var set = new Set(guess.split(""));
    if (set.size == 4) {
        return true;
    }
}