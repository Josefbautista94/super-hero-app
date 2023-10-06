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
    currentPage: 1,
    itemsPerPage: 20,
    
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

    this.setState({ 
        selectedHeroes,
        winner: null,  // Reset the winner
        loser: null    // Reset the loser
    });
}
  resetSelection = () => {
    this.setState({ selectedHeroes: [] });
  };
  compareHeroes = () => {
    const [hero1, hero2] = this.state.selectedHeroes;

    const transformationMultiplier1 = this.getTransformationMultiplier(hero1.transformation);
    const transformationMultiplier2 = this.getTransformationMultiplier(hero2.transformation);

    const techniqueBonus1 = this.getTechniqueBonus(hero1.technique);
    const techniqueBonus2 = this.getTechniqueBonus(hero2.technique);

    const experienceBonus1 = this.getExperienceBonus(hero1.battlesFought);
    const experienceBonus2 = this.getExperienceBonus(hero2.battlesFought);

    const score1 =
      (hero1.powerstats.intelligence * 1.5 +
       hero1.powerstats.strength * 2 +
       hero1.powerstats.speed * 1.2 +
       hero1.powerstats.durability * 1.8 +
       hero1.powerstats.power * 2.5 +
       hero1.powerstats.combat * 1.3 +
       techniqueBonus1 +
       experienceBonus1) * transformationMultiplier1;

    const score2 =
      (hero2.powerstats.intelligence * 1.5 +
       hero2.powerstats.strength * 2 +
       hero2.powerstats.speed * 1.2 +
       hero2.powerstats.durability * 1.8 +
       hero2.powerstats.power * 2.5 +
       hero2.powerstats.combat * 1.3 +
       techniqueBonus2 +
       experienceBonus2) * transformationMultiplier2;

       const strongerPhrases = [
        "dominates the battle!",
        "emerges superior!",
        "proves to be the mightier one!",
        "stands tall in this comparison!",
        "shows greater strength!"
      ];
      
      const equallyStrongPhrases = [
        "Both heroes are on par with each other!",
        "It's a tie! Neither hero has the upper hand.",
        "Both heroes showcase equal might!",
        "Neither hero can outdo the other!",
        "It's a balanced battle!"
      ];
      

      const randomPhrase = (phrases) => {
        return phrases[Math.floor(Math.random() * phrases.length)];
      };
      
      if (score1 > score2) {
        this.setState({ 
          comparisonResult: `${hero1.name} ${randomPhrase(strongerPhrases)}`,
          winner: hero1.id,
          loser: hero2.id
        });
      } else if (score1 < score2) {
        this.setState({ 
          comparisonResult: `${hero2.name} ${randomPhrase(strongerPhrases)}`,
          winner: hero2.id,
          loser: hero1.id
        });
      } else {
        this.setState({ 
          comparisonResult: randomPhrase(equallyStrongPhrases),
          winner: null,
          loser: null
        });
      }
  
  };

  // Helper functions for the improved compareHeroes
  getTransformationMultiplier = (transformation) => {
    switch (transformation) {
      case 'Super Saiyan':
        return 50;
      case 'Super Saiyan 2':
        return 100;
      // ... other transformations
      default:
        return 1;
    }
  };

  getTechniqueBonus = (technique) => {
    switch (technique) {
      case 'Kamehameha':
        return 500;
      case 'Final Flash':
        return 600;
      // ... other techniques
      default:
        return 0;
    }
  };

  getExperienceBonus = (battlesFought) => {
    if (battlesFought > 50) {
      return 300;
    } else if (battlesFought > 30) {
      return 200;
    } else {
      return 100;
    }
  };


  render() {
    const { superheroes, loading, error, filter, searchTerm, selectedHeroes, currentPage, itemsPerPage } =
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

    const indexOfLastHero = currentPage * itemsPerPage;
    const indexOfFirstHero = indexOfLastHero - itemsPerPage;
    const currentHeroes = filteredHeroes.slice(indexOfFirstHero, indexOfLastHero);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
     
    

    return (
      <div className="mainContainer">
        <div className="titleContainer">
          <h1 className="superHeroTitle"> Vs. Superheroes!</h1>
        </div>
        <div className="selected-heroes-section">
   
        <div className ="comparisonResult"><h1>{this.state.comparisonResult}</h1></div>

        <div className="selected-heroes-container">
    {selectedHeroes.map((hero, index) => (
        <React.Fragment key={hero.id}>
        <div className={`selected-hero ${hero.id === this.state.winner ? 'winner' : hero.id === this.state.loser ? 'loser' : ''}`}>
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
            {index === 0 && selectedHeroes.length > 1 && <div className="versus">
            <img src="https://www.pngall.com/wp-content/uploads/5/Combat-Versus-PNG-Pic.png" className ="vsPng"alt="Versus png"/>

            </div>}
        </React.Fragment>
    ))}
    
</div>

        </div>
        {selectedHeroes.length === 2 && (
        <p>
            The comparison logic evaluates the strength of two heroes based on their power statistics. Each power statistic is assigned a weight, and the weighted sum of these statistics determines the overall score for each hero. The specific weights for each power statistic are as follows:
            <br />
            Intelligence: Multiplied by 1.5
            <br />
            Strength: Multiplied by 2
            <br />
            Speed: Multiplied by 1.2
            <br />
            Durability: Multiplied by 1.8
            <br />
            Power: Multiplied by 2.5
            <br />
            Combat: Multiplied by 1.3
        </p>
    )}
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
        {currentHeroes.map((hero) => (            <li
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
        <div className="pagination-controls">
          <button className="previousButton"
            onClick={() => this.setState(prevState => ({ currentPage: prevState.currentPage - 1 }))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button className="nextButton"
            onClick={() => this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }))}
            disabled={currentPage === Math.ceil(filteredHeroes.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default MainPage;
