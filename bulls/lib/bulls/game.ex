defmodule Bulls.Game do


  def newState do
    %{
      guesses: [],
      secret: makeNum(),
      bulls: [],
      cows: []
    }
  end

  def makeNum do
      list = ['1','2','3','4','5','6','7','8','9']
      rans = Enum.take_random(list, 4)
      Enum.join(rans)
  end


  #makes sure there aren't repeat numbers in the guess
  def allUniqueNums(guessSplit) do
    setOfGuess = MapSet.new(guessSplit)
    MapSet.size(setOfGuess) === 4
  end

  #checks to see if this guess is new in state
  def newGuess?(guess, guesses) do
    not(Enum.member?(guesses, guess))
  end

  def properNum(guessSplit) do
    list = ['1','2','3','4','5','6','7','8','9']
    Enum.member?(list, Enum.at(list, 0)) and Enum.member?(list, Enum.at(list, 1)) and Enum.member?(list, Enum.at(list, 2)) and Enum.member?(list, Enum.at(list, 3))
  end


  def makeGuess(st, num) do
    guess_split = String.graphemes(num) #graphemes was discovered from lecture, very useful!
    if (allUniqueNums(guess_split) and newGuess?(num, st.guesses) and properNum(guess_split)) do
      update_bulls_cows(%{st | guesses: st.guesses ++ [num]}, num, st.secret)
    end
  end

  def guessedCorrectly?(st) do
    Enum.member?(st.guesses, st.secret)
  end

  def guessesDone(st) do
    length(st.guesses) >= 8
   end


  def view(st) do
    over = guessedCorrectly?(st) or guessesDone(st)
    %{
      guesses: st.guesses,
      gameOver: not(over),
      bulls: st.bulls,
      cows: st.cows
    }
  end

  def bulls_helper(index, newGuessSplit, secretSplit) do
    if (index < 0) do
      0
    else
      if Enum.at(newGuessSplit, index) === Enum.at(secretSplit, index) do
        1 + bulls_helper(index - 1, newGuessSplit, secretSplit)
      else
        bulls_helper(index - 1, newGuessSplit, secretSplit)
      end
    end
  end


  def cows_helper(index, newGuessSplit, secretSplit) do
    if (index < 0) do
      0
    else
      if  Enum.member?(secretSplit, Enum.at(newGuessSplit, index)) do
        1 + cows_helper(index - 1, newGuessSplit, secretSplit)
      else
        cows_helper(index - 1, newGuessSplit, secretSplit)
      end
    end
  end

  #think this works
  def update_bulls_cows(st, newGuess, secret) do
    guessSplit = String.graphemes(newGuess)
    secretSplit = String.graphemes(secret)
    newBulls = bulls_helper(3, guessSplit, secretSplit)
    newCows = cows_helper(3, guessSplit, secretSplit)
    %{ %{st | bulls: st.bulls ++ [newBulls]} | cows: st.cows ++ [newCows] }
  end

end
