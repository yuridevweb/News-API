# NC-News API

Welcome to my back-end project at Northcoders. News API serving up a range of random data on a number of available endpoints.

You can find the hosted version:
https://nc-news-yuridev.herokuapp.com/api/

## Getting Started & Installation

### Prerequisites

To run this API, you will need Node.js and Postgres installed on your machine.

To install Postgres, go to: https://www.postgresql.org/download/
To install Node, go to: https://nodejs.org/en/download/

### Installation

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
- Clone a copy of the repository on your machine using the below command:
`code`
https://github.com/yuridevweb/News-API.git
`code`

## Setting up DB enviroments

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.
