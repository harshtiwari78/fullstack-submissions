import { useState } from "react"

const Button = ({ handleGood, handleNeutral, handleBad }) => {
  return( 
  <div>
  <button onClick={handleGood}>good</button>
  <button onClick={handleNeutral}>neutral</button>
  <button onClick={handleBad}>bad</button>
  </div>
 )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad

  if(all===0){
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  const average = (good-bad) / all 
  const positive = (good / all) * 100

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive + " %"} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button
      handleGood={() => setGood(good + 1)}
      handleNeutral={() => setNeutral(neutral + 1)}
      handleBad={() => setBad(bad+1)}
      />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App