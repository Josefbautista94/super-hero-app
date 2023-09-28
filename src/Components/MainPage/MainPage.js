import React, { Component } from "react";
import "./MainPage.css";
import axios from "axios";

class MainPage extends Component {
  // 1. Initialize state
  state = {
    superheroes: [],
    loading: true,
    error: null,
  };

  // 2. Fetch data in componentDidMount
  componentDidMount() {
    const API_ENDPOINT = process.env.REACT_APP_SUPERHERO_API_ENDPOINT;

    axios
      .get(API_ENDPOINT)
      .then((response) => {
        this.setState({
          superheroes: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("There was an error fetching data:", error);
        this.setState({
          error: error.message,
          loading: false,
        });
      });
  }

  render() {
    const { superheroes, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <h1>Superheroes</h1>
        <ul className="hero-grid">
          {superheroes.map((hero) => (
            <li key={hero.id} className="hero-li">
              <div className="hero-name">{hero.name}</div>
              <img src={hero.images.md} alt={hero.name} />
              <div className="hero-details">
                <div>Gender: {hero.appearance.gender}</div>
                <div>Race: {hero.appearance.race}</div>
                <div>Alignment: {hero.biography.alignment}</div>
                <div>Power Stats: </div>
                <div>Intelligence: {hero.powerstats.intelligence}</div>
                <div>Strength: {hero.powerstats.strength}</div>
                <div>Speed: {hero.powerstats.speed}</div>
                <div>Durability: {hero.powerstats.durability}</div>
                <div>Power: {hero.powerstats.power}</div>
                <div>Combat: {hero.powerstats.combat}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default MainPage;
