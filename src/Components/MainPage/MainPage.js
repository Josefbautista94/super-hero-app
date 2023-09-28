import React, { Component } from "react";
import "./MainPage.css";
import axios from "axios";

class MainPage extends Component {
  state = {
    superheroes: [],
    loading: true,
    error: null,
    filter: "all",
    searchTerm: "",
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

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
}

  render() {
    const { superheroes, loading, error, filter, searchTerm  } = this.state;
    
    const filteredHeroes = superheroes.filter(hero => {
        // Filter by alignment
        if (filter !== 'all' && hero.biography.alignment.toLowerCase() !== filter) {
            return false;
        }
    
        // Filter by search term
        if (searchTerm && !hero.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
    
        return true;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <h1 className="superHeroTitle">Superheroes</h1>

        <input 
    type="text" 
    placeholder="Search for a superhero..." 
    value={this.state.searchTerm} 
    onChange={this.handleSearchChange}
/>        <div className="filter-menu">
          <label>Filter by Alignment: </label>
          <select value={filter} onChange={this.handleFilterChange}>
            <option value="all">See All</option>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        <ul className="hero-grid">
          {filteredHeroes.map((hero) => (
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
                <div>Occupation: {hero.work.occupation}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default MainPage;
