import React, { Component } from 'react';
import "./MainPage.css";
import axios from 'axios';

class MainPage extends Component {
    // 1. Initialize state
    state = {
        superheroes: [],
        loading: true,
        error: null
    };

    // 2. Fetch data in componentDidMount
    componentDidMount() {
        const API_ENDPOINT = process.env.REACT_APP_SUPERHERO_API_ENDPOINT;
    
        axios.get(API_ENDPOINT)
            .then(response => {
                this.setState({
                    superheroes: response.data,
                    loading: false
                });
            })
            .catch(error => {
                console.error("There was an error fetching data:", error);
                this.setState({
                    error: error.message,
                    loading: false
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
                <ul>
                    {superheroes.map(hero => (
                        <li key={hero.id}>{hero.name}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default MainPage;
