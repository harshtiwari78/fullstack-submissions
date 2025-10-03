import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      setCountries(response.data)
    })
  }, [])

  const filteredCountries = countries.filter(c => 
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries:
        <input value={filter} onChange={(e) => {
          setFilter(e.target.value)
          setSelectedCountry(null)
        }} />
      </div>

      <CountriesList 
      countries={filteredCountries}
      onShowCountry={setSelectedCountry}
      />

      {selectedCountry && <CountryDetails country={selectedCountry} />}
    </div>
  )
}

const CountriesList = ({ countries, onShowCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map(c => (
          <li key={c.cca3}>
            {c.name.common}{' '}
            <button onClick={() => onShowCountry(c)}>Show</button>
          </li>
        ))}
      </ul>
    )
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return <p>No matches</p>
}

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY
  const capital = country.capital[0]

  console.log('OpenWeather API Key:', api_key)


  useEffect(() => {
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
    .then(response => {
      setWeather(response.data)
    })
  }, [capital, api_key])

  if(!weather) return <p>Loading Weather...</p>

      return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>

        <h3>Weather in {capital}</h3>
        <p>Temperature: {weather.main.temp} °C</p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
        <p>Wind: {weather.wind.speed} m/s</p>
        <h4>Languages:</h4>
        <ul>
          {Object.values(country.languages).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>

        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      </div>
    )
}

export default App