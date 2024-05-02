import { should } from 'chai';

beforeEach(() => {
  cy.visit('/');
});

describe('fetch real data', () => {
  it('should get real data and display it', () => {
    cy.get('input').type('star wars{Enter}');
    cy.get('.movie').should('have.length.above', 0);
    cy.get('.movie > h3').should('contain.text', 'Star');
  });
});

describe('using mocked data', () => {
  it('should get mocked data and display it', () => {
    cy.intercept('http://omdbapi.com/*', {
      Search: [
        {
          Title: 'Star Wars: Episode IV - A New Hope',
          Year: '1977',
          imdbID: 'tt0076759',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg',
        },
        {
          Title: 'Star Wars: Episode V - The Empire Strikes Back',
          Year: '1980',
          imdbID: 'tt0080684',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
        },
        {
          Title: 'Star Wars: Episode VI - Return of the Jedi',
          Year: '1983',
          imdbID: 'tt0086190',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BOWZlMjFiYzgtMTUzNC00Y2IzLTk1NTMtZmNhMTczNTk0ODk1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg',
        },
        {
          Title: 'Star Wars: Episode VII - The Force Awakens',
          Year: '2015',
          imdbID: 'tt2488496',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BOTAzODEzNDAzMl5BMl5BanBnXkFtZTgwMDU1MTgzNzE@._V1_SX300.jpg',
        },
        {
          Title: 'Star Wars: Episode I - The Phantom Menace',
          Year: '1999',
          imdbID: 'tt0120915',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BYTRhNjcwNWQtMGJmMi00NmQyLWE2YzItODVmMTdjNWI0ZDA2XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg',
        },
        {
          Title: 'Star Wars: Episode III - Revenge of the Sith',
          Year: '2005',
          imdbID: 'tt0121766',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BNTc4MTc3NTQ5OF5BMl5BanBnXkFtZTcwOTg0NjI4NA@@._V1_SX300.jpg',
        },
        {
          Title: 'Star Wars: Episode II - Attack of the Clones',
          Year: '2002',
          imdbID: 'tt0121765',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BMDAzM2M0Y2UtZjRmZi00MzVlLTg4MjEtOTE3NzU5ZDVlMTU5XkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SX300.jpg',
        },
        {
          Title: 'Rogue One: A Star Wars Story',
          Year: '2016',
          imdbID: 'tt3748528',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BMjEwMzMxODIzOV5BMl5BanBnXkFtZTgwNzg3OTAzMDI@._V1_SX300.jpg',
        },
        {
          Title: 'Star Wars: Episode VIII - The Last Jedi',
          Year: '2017',
          imdbID: 'tt2527336',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BMjQ1MzcxNjg4N15BMl5BanBnXkFtZTgwNzgwMjY4MzI@._V1_SX300.jpg',
        },
        {
          Title: 'Star Trek',
          Year: '2009',
          imdbID: 'tt0796366',
          Type: 'movie',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BMjE5NDQ5OTE4Ml5BMl5BanBnXkFtZTcwOTE3NDIzMw@@._V1_SX300.jpg',
        },
      ],
      totalResults: '4463',
      Response: 'True',
    }).as('myapicall');
    const searchText = 'Star';
    cy.get('input').type(searchText + '{Enter}');

    cy.wait('@myapicall').its('response.statusCode').should('equal', 200);
    cy.get('.movie').should('have.length', 10);
    cy.get('.movie > h3').should('contain.text', searchText);
  });

  it('should be possible to write something in input field', () => {
    const userInput = 'star';
    cy.get('input').type(userInput).should('have.value', userInput);
  });

  it('should use the inputText in the request', () => {
    cy.intercept('http://omdbapi.com/*', {
      Response: 'False',
    }).as('myapicall');
    const failingSearchText = 'kjhkjh';
    cy.get('input').type(failingSearchText + '{Enter}');
    cy.wait('@myapicall')
      .its('request.url')
      .should('include', failingSearchText);
  });

  it('should display error message when movies list is empty', () => {
    cy.intercept('http://omdbapi.com/*', {
      Response: 'False',
    }).as('myapicall');
    const failingSearchText = 'kjhkjh';
    cy.get('input').type(failingSearchText + '{Enter}');
    cy.get('.movie').should('have.length', 0);
    cy.get('div > p').should('have.text', 'Inga sökresultat att visa');
  });

  it('should display error message when status 500', () => {
    cy.intercept('http://omdbapi.com/*', {
      statusCode: 500,
    }).as('catched-api-call');
    cy.get('input').type('star{Enter}');
    cy.get('.movie').should('have.length', 0);
    cy.get('div > p').should('have.text', 'Inga sökresultat att visa');
    cy.wait('@catched-api-call')
      .its('response.statusCode')
      .should('equal', 500);
  });
});
