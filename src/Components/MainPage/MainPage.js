import React, { Component } from "react";
import "./MainPage.css";
import axios from "axios";

class MainPage extends Component {
  state = {
    superheroes: [],
    selectedHeroes: [],
    loading: true,
    error: null,
    filter: "all",
    searchTerm: "",
    comparisonResult: "",
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
  };

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  selectHero(hero) {
    let selectedHeroes = [...this.state.selectedHeroes];

    const isAlreadySelected = selectedHeroes.some((h) => h.id === hero.id);

    if (isAlreadySelected) {
      selectedHeroes = selectedHeroes.filter((h) => h.id !== hero.id);
    } else {
      if (selectedHeroes.length < 2) {
        selectedHeroes.push(hero);
      }
    }

    this.setState({ selectedHeroes });
  }

  resetSelection = () => {
    this.setState({ selectedHeroes: [] });
  };
  compareHeroes = () => {
    const [hero1, hero2] = this.state.selectedHeroes;

    const score1 =
      hero1.powerstats.intelligence * 1.5 +
      hero1.powerstats.strength * 2 +
      hero1.powerstats.speed * 1.2 +
      hero1.powerstats.durability * 1.8 +
      hero1.powerstats.power * 2.5 +
      hero1.powerstats.combat * 1.3;

    const score2 =
      hero2.powerstats.intelligence * 1.5 +
      hero2.powerstats.strength * 2 +
      hero2.powerstats.speed * 1.2 +
      hero2.powerstats.durability * 1.8 +
      hero2.powerstats.power * 2.5 +
      hero2.powerstats.combat * 1.3;

    if (score1 > score2) {
      this.setState({ comparisonResult: `${hero1.name} is stronger!` });
    } else if (score1 < score2) {
      this.setState({ comparisonResult: `${hero2.name} is stronger!` });
    } else {
      this.setState({ comparisonResult: `Both heroes are equally strong!` });
    }
  };

  render() {
    const { superheroes, loading, error, filter, searchTerm, selectedHeroes } =
      this.state;

    const filteredHeroes = superheroes.filter((hero) => {
      // Filter by alignment
      if (
        filter !== "all" &&
        hero.biography.alignment.toLowerCase() !== filter
      ) {
        return false;
      }

      // Filter by search term
      if (
        searchTerm &&
        !hero.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div className="mainContainer">
        <div className="titleContainer">
          <h1 className="superHeroTitle">Superheroes</h1>
        </div>
       
        <div className ="comparisonResult"><h1>{this.state.comparisonResult}</h1></div>
        <div className="selected-heroes-section">
          <div className="selected-heroes-container">
            {selectedHeroes.map((hero) => (
              <div key={hero.id} className="selected-hero">
                <h2>{hero.name}</h2>
                <img src={hero.images.md} alt={hero.name} />
                <div>Power Stats: </div>
                <div>Intelligence: {hero.powerstats.intelligence}</div>
                <div>Strength: {hero.powerstats.strength}</div>
                <div>Speed: {hero.powerstats.speed}</div>
                <div>Durability: {hero.powerstats.durability}</div>
                <div>Power: {hero.powerstats.power}</div>
                <div>Combat: {hero.powerstats.combat}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="button-div">
        {this.state.selectedHeroes.length > 0 ? (
          <button className = "buttons" onClick={this.resetSelection}>Reset Selection</button>
        ) : null}
        {this.state.selectedHeroes.length > 1 ? (
          <button className = "buttons" onClick={this.compareHeroes}>Compare</button>
        ) : null}
</div>
<div className="searchBarContainer">
          <input
            className="searchBar"
            type="text"
            placeholder="Search For A Superhero..."
            value={this.state.searchTerm}
            onChange={this.handleSearchChange}
          />
        </div>
        <div className="filter-menu">
          <label className="filterLabel">Filter by Alignment: </label>
          <select className = "selectMenu" value={filter} onChange={this.handleFilterChange}>
            <option value="all">See All</option>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <ul className="hero-grid">
          {filteredHeroes.map((hero) => (
            <li
              key={hero.id}
              className="hero-li"
              onClick={() => this.selectHero(hero)}
            >
              <div className="hero-name">{hero.name}</div>
              <img src={hero.images.md} alt={hero.name} />
              <div className="hero-details">
                <div>
                  Full Name:{" "}
                  {hero.biography.fullName
                    ? hero.biography.fullName
                    : hero.name}
                </div>
                <div> Aliases:</div>
                <div> {hero.biography.aliases.join(", ")}</div>
                <div>
                  Place Of Birth:{" "}
                  {hero.biography.placeOfBirth !== "-"
                    ? hero.biography.placeOfBirth
                    : "N/A"}
                </div>
                <div>Gender: {hero.appearance.gender}</div>
                <div>Race: {hero.appearance.race}</div>
                <div>Alignment: {hero.biography.alignment}</div>
                <div> Base: {hero.work.base}</div>
                <div>
                  Height: {hero.appearance.height[0]},{" "}
                  {hero.appearance.height[1]}
                </div>
                <div>
                  Weight: {hero.appearance.weight[0]},{" "}
                  {hero.appearance.weight[1]}
                </div>
                <div>Eye Color: {hero.appearance.eyeColor}</div>
                <div>Hair Color: {hero.appearance.hairColor}</div>

                <div>Power Stats: </div>
                <div>Intelligence: {hero.powerstats.intelligence}</div>
                <div>Strength: {hero.powerstats.strength}</div>
                <div>Speed: {hero.powerstats.speed}</div>
                <div>Durability: {hero.powerstats.durability}</div>
                <div>Power: {hero.powerstats.power}</div>
                <div>Combat: {hero.powerstats.combat}</div>

                <div>
                  Occupation:{" "}
                  {hero.work.occupation !== "-" ? hero.work.occupation : "N/A"}
                </div>
                <div>Afffiliated Groups:</div>
                <div>{hero.connections.groupAffiliation}</div>
                <div>Relatives:</div>
                <div>{hero.connections.relatives}</div>
                <div>First Appearance: {hero.biography.firstAppearance}</div>

                <div>Publisher: {hero.biography.publisher}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default MainPage;
