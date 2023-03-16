import "./App.css"

// React
import { useCallback, useEffect, useState } from "react"

// Data
import {wordsList} from "./data/words"

// Components
import StartScreen from "./components/startScreen/StartScreen"
import GameScreen from "./components/gameScreen/GameScreen"
import EndScreen from "./components/endScreen/EndScreen"

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]

const qtdGuesses = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(qtdGuesses)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * categories.length)]

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }, [words])

  //  starts the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates()

    // pick word and pick category
    const { word, category } = pickWordAndCategory()

    //  create an array of latters
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())
    
    // fill states
    
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])
  
  // process the latter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // check f letter has already been utilized

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    // push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter])
    } else {
      setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }

  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
    setGuesses([qtdGuesses])
  }
  
  // check if guesses ended
  useEffect(() => {
    if(guesses <= 0) {
      // reset all state
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    // win condition
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      // add score
      setScore((actualScore) => actualScore += 100)

      // restart game with new word
      startGame()
    }

  }, [guessedLetters, letters, startGame])

  
  // Restarts the game
  const retry = () => {
    setScore(0)
    setGuesses(qtdGuesses)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      { gameStage === "start" && <StartScreen startGame={ startGame }/> }
      { gameStage === "game" && (
        <GameScreen 
          verifyLetter={ verifyLetter } 
          pickedWord={ pickedWord } 
          pickedCategory={ pickedCategory } 
          letters={ letters }
          guessedLetters={ guessedLetters }
          wrongLetters={ wrongLetters }
          guesses={ guesses }
          score={ score }
        />
      )}
      { gameStage === "end" && <EndScreen retry={ retry } score={score} />}
    </div>
  )
}

export default App
