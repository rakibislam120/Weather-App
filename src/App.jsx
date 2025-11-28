
import { useState, useEffect } from "react"
import axios from "axios"
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiHumidity, WiStrongWind, WiBarometer } from "react-icons/wi"
import { FiSearch, FiMapPin, FiSunrise, FiSunset } from "react-icons/fi"
import { BsThermometerHalf } from "react-icons/bs"
import "./App.css"

export default function App() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const API_KEY = "5acb3bb28731bf85d26421d180eb31bb"

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => fetchByCoords(p.coords.latitude, p.coords.longitude),
        () => fetchByCity("Dhaka")
      )
    } else fetchByCity("Dhaka")
  }, [])

  const fetchByCoords = async (lat, lon) => {
    setLoading(true)
    try {
      const r = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      )
      setWeather(r.data)
      setError("")
    } catch {
      setError("Location not found")
    } finally {
      setLoading(false)
    }
  }

  const fetchByCity = async (name) => {
    setLoading(true)
    try {
      const r = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=metric`
      )
      setWeather(r.data)
      setError("")
    } catch {
      setError("City not found")
    } finally {
      setLoading(false)
    }
  }

  const search = () => {
    if (city.trim()) {
      fetchByCity(city)
      setCity("")
    }
  }

  const keyDown = (e) => e.key === "Enter" && search()

  const icon = (m) => {
    m = m.toLowerCase()
    if (m.includes("clear")) return <WiDaySunny size={128} />
    if (m.includes("cloud")) return <WiCloudy size={128} />
    if (m.includes("rain") || m.includes("drizzle")) return <WiRain size={128} />
    if (m.includes("snow")) return <WiSnow size={128} />
    if (m.includes("thunder")) return <WiThunderstorm size={128} />
    if (m.includes("mist") || m.includes("fog")) return <WiFog size={128} />
    return <WiDaySunny size={128} />
  }

  const time = (t) => new Date(t * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="wrapper">
      <div className="card">
        <h1 className="title">Weather Pro</h1>

        <div className="search-bar">
          <FiSearch className="icon" />
          <input
            type="text"
            placeholder="Search city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={keyDown}
          />
          <button onClick={search} disabled={loading || !city.trim()}>
            {loading ? "…" : "Go"}
          </button>
        </div>

        {error && <div className="msg error">{error}</div>}

        {weather && (
          <>
            <div className="location">
              <FiMapPin size={24} />
              <h2>{weather.name}, {weather.sys.country}</h2>
            </div>

            <div className="temp">
              {icon(weather.weather[0].main)}
              <span>{Math.round(weather.main.temp)}°</span>
            </div>

            <p className="desc">{weather.weather[0].description}</p>

            <p className="feels">
              Feels {Math.round(weather.main.feels_like)}° • H:{Math.round(weather.main.temp_max)}° L:{Math.round(weather.main.temp_min)}°
            </p>

            <div className="details">
              <div className="item">
                <WiHumidity size={40} />
                <strong>{weather.main.humidity}%</strong>
                <small>Humidity</small>
              </div>
              <div className="item">
                <WiStrongWind size={40} />
                <strong>{weather.wind.speed} m/s</strong>
                <small>Wind</small>
              </div>
              <div className="item">
                <WiBarometer size={40} />
                <strong>{weather.main.pressure} hPa</strong>
                <small>Pressure</small>
              </div>
              <div className="item">
                <BsThermometerHalf size={36} />
                <strong>{(weather.visibility / 1000).toFixed(1)} km</strong>
                <small>Visibility</small>
              </div>
            </div>

            <div className="sun">
              <div>
                <FiSunrise size={32} />
                <strong>{time(weather.sys.sunrise)}</strong>
                <small>Sunrise</small>
              </div>
              <div>
                <FiSunset size={32} />
                <strong>{time(weather.sys.sunset)}</strong>
                <small>Sunset</small>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}