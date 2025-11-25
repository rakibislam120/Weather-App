import { useState, useEffect } from "react";
import axios from "axios";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiHumidity, WiStrongWind, WiBarometer } from "react-icons/wi";
import { FiSearch, FiMapPin, FiSunrise, FiSunset } from "react-icons/fi";
import { BsThermometerHalf } from "react-icons/bs";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "5acb3bb28731bf85d26421d180eb31bb";

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            setLoading(true);
            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            setWeather(res.data);
            setError("");
          } catch {
            setError("Unable to fetch location weather");
          } finally {
            setLoading(false);
          }
        },
        () => {
          fetchDefaultCity();
        }
      );
    } else {
      fetchDefaultCity();
    }
  };

  const fetchDefaultCity = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Dhaka&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setError("");
    } catch {
      setError("Default city not found");
    } finally {
      setLoading(false);
    }
  };

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setError("");
      setCity(""); // Search bar clear after successful search
    } catch {
      setError("City not found! Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  const getWeatherIcon = (weatherCondition) => {
    const main = weatherCondition.toLowerCase();
    if (main.includes("cloud")) return <WiCloud size={100} color="#94A3B8" />;
    if (main.includes("rain")) return <WiRain size={100} color="#3B82F6" />;
    if (main.includes("snow")) return <WiSnow size={100} color="#E2E8F0" />;
    if (main.includes("clear")) return <WiDaySunny size={100} color="#FFD700" />;
    if (main.includes("thunderstorm")) return <WiRain size={100} color="#1E40AF" />;
    if (main.includes("drizzle")) return <WiRain size={80} color="#60A5FA" />;
    if (main.includes("mist") || main.includes("fog") || main.includes("haze")) return <WiCloud size={100} color="#CBD5E1" />;
    return <WiDaySunny size={100} color="#FFD700" />;
  };

  const getBackground = () => {
    if (!weather) return "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)";
    const main = weather.weather[0].main.toLowerCase();
    
    if (main.includes("cloud")) return "linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)";
    if (main.includes("rain") || main.includes("drizzle")) return "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #3B82F6 100%)";
    if (main.includes("snow")) return "linear-gradient(135deg, #374151 0%, #4B5563 50%, #6B7280 100%)";
    if (main.includes("clear")) return "linear-gradient(135deg, #0C4A6E 0%, #0369A1 50%, #0EA5E9 100%)";
    if (main.includes("thunderstorm")) return "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)";
    if (main.includes("mist") || main.includes("fog") || main.includes("haze")) return "linear-gradient(135deg, #374151 0%, #4B5563 50%, #6B7280 100%)";
    
    return "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)";
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: getBackground(),
        transition: "background 0.8s ease",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
      className="weather-app"
    >
      {/* Animated Background */}
      <div style={{
        position: "absolute",
        top: "-50%",
        left: "-50%",
        width: "200%",
        height: "200%",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
        animation: "moveBackground 20s linear infinite",
        zIndex: 0,
      }} />

      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          padding: "30px",
          textAlign: "center",
          color: "#F8FAFC",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "25px" }}>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "800", 
            marginBottom: "8px",
            background: "linear-gradient(45deg, #60A5FA, #A78BFA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Weather Pro
          </h1>
          <p style={{ 
            opacity: 0.7, 
            fontSize: "14px",
            fontWeight: "500"
          }}>
            Real-time weather updates
          </p>
        </div>

        {/* Search Box - FIXED */}
        <div style={{ 
          marginBottom: "20px",
          width: "100%"
        }}>
          <div style={{ 
            position: "relative", 
            marginBottom: "12px",
            width: "100%"
          }}>
            <FiSearch style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.6)",
              fontSize: "18px",
              zIndex: 1
            }} />
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setError(""); // Clear error when user starts typing
              }}
              onKeyPress={handleKeyPress}
              style={{
                width: "100%",
                padding: "16px 16px 16px 48px",
                borderRadius: "16px",
                border: error ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(30, 41, 59, 0.8)",
                color: "#F8FAFC",
                fontSize: "16px",
                outline: "none",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(96, 165, 250, 0.5)";
                e.target.style.boxShadow = "0 0 0 3px rgba(96, 165, 250, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? "rgba(239, 68, 68, 0.5)" : "rgba(255, 255, 255, 0.2)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          
          <button
            onClick={getWeather}
            disabled={loading || !city.trim()}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "16px",
              border: "none",
              background: loading ? "rgba(51, 65, 85, 0.8)" : 
                         !city.trim() ? "rgba(51, 65, 85, 0.8)" : "linear-gradient(45deg, #3B82F6, #8B5CF6)",
              color: loading || !city.trim() ? "rgba(255,255,255,0.5)" : "#FFFFFF",
              fontWeight: "600",
              cursor: loading || !city.trim() ? "not-allowed" : "pointer",
              fontSize: "16px",
              transition: "all 0.3s ease",
              boxSizing: "border-box"
            }}
            onMouseOver={(e) => !loading && city.trim() && (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => !loading && city.trim() && (e.target.style.transform = "translateY(0)")}
          >
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <div style={{ 
                  width: "16px", 
                  height: "16px", 
                  border: "2px solid transparent", 
                  borderTop: "2px solid currentColor", 
                  borderRadius: "50%", 
                  animation: "spin 1s linear infinite" 
                }} />
                Searching...
              </div>
            ) : "Get Weather"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.2)",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
          className="fade-in"
          >
            <p style={{ 
              color: "#FCA5A5", 
              fontWeight: "600", 
              margin: 0,
              fontSize: "14px"
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Weather Info */}
        {weather && (
          <div style={{ 
            color: "#F8FAFC",
          }}
          className="slide-up"
          >
            {/* Location */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              marginBottom: "20px",
              background: "rgba(30, 41, 59, 0.6)",
              padding: "12px 20px",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)"
            }}>
              <FiMapPin style={{ 
                marginRight: "10px", 
                fontSize: "20px",
                color: "#60A5FA",
                flexShrink: 0
              }} />
              <h2 style={{ 
                fontSize: "20px", 
                fontWeight: "600", 
                margin: 0,
                color: "#F8FAFC",
                textAlign: "center"
              }}>
                {weather.name}, {weather.sys.country}
              </h2>
            </div>

            {/* Weather Icon & Temp */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              marginBottom: "10px",
              gap: "15px"
            }}>
              {getWeatherIcon(weather.weather[0].main)}
              <div style={{ textAlign: "left" }}>
                <p style={{ 
                  fontSize: "56px", 
                  fontWeight: "800", 
                  margin: "0",
                  background: "linear-gradient(45deg, #60A5FA, #A78BFA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: "1"
                }}>
                  {Math.round(weather.main.temp)}°C
                </p>
                <p style={{ 
                  fontSize: "16px", 
                  margin: "5px 0 0 0",
                  opacity: 0.8
                }}>
                  Feels like {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
            </div>

            {/* Weather Description */}
            <p style={{ 
              fontSize: "18px", 
              textTransform: "capitalize",
              margin: "0 0 20px 0",
              opacity: 0.9,
              background: "rgba(255, 255, 255, 0.1)",
              padding: "8px 20px",
              borderRadius: "20px",
              display: "inline-block"
            }}>
              {weather.weather[0].description}
            </p>

            {/* High/Low Temp */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              fontSize: "16px",
              opacity: 0.8,
              marginBottom: "25px"
            }}>
              <span>H: {Math.round(weather.main.temp_max)}°</span>
              <span>L: {Math.round(weather.main.temp_min)}°</span>
            </div>

            {/* Weather Details Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "25px"
            }}>
              <div style={{
                background: "rgba(30, 41, 59, 0.8)",
                padding: "20px",
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <WiHumidity size={32} color="#60A5FA" />
                <p style={{ margin: "12px 0 6px 0", fontSize: "14px", opacity: 0.8 }}>Humidity</p>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "20px" }}>{weather.main.humidity}%</p>
              </div>
              
              <div style={{
                background: "rgba(30, 41, 59, 0.8)",
                padding: "20px",
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <WiStrongWind size={32} color="#34D399" />
                <p style={{ margin: "12px 0 6px 0", fontSize: "14px", opacity: 0.8 }}>Wind</p>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "20px" }}>{weather.wind.speed} m/s</p>
              </div>

              <div style={{
                background: "rgba(30, 41, 59, 0.8)",
                padding: "20px",
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <WiBarometer size={32} color="#F59E0B" />
                <p style={{ margin: "12px 0 6px 0", fontSize: "14px", opacity: 0.8 }}>Pressure</p>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "20px" }}>{weather.main.pressure} hPa</p>
              </div>

              <div style={{
                background: "rgba(30, 41, 59, 0.8)",
                padding: "20px",
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <BsThermometerHalf size={28} color="#EF4444" />
                <p style={{ margin: "12px 0 6px 0", fontSize: "14px", opacity: 0.8 }}>Visibility</p>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "20px" }}>{(weather.visibility / 1000).toFixed(1)} km</p>
              </div>
            </div>

            {/* Sunrise & Sunset */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              background: "rgba(30, 41, 59, 0.8)",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <div style={{ textAlign: "center" }}>
                <FiSunrise size={28} color="#F59E0B" />
                <p style={{ margin: "12px 0 6px 0", fontSize: "14px", opacity: 0.8 }}>Sunrise</p>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>
                  {formatTime(weather.sys.sunrise)}
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <FiSunset size={28} color="#FB923C" />
                <p style={{ margin: "12px 0 6px 0", fontSize: "14px", opacity: 0.8 }}>Sunset</p>
                <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>
                  {formatTime(weather.sys.sunset)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}