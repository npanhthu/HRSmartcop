# HRSmartcop

A Node app built with MongoDB and Reactjs.

Node provides the RESTful API. React provides the frontend and accesses the API. MongoDB stores like a hoarder.

# Live demo
- Link: [Live Demo](https://smartcop.herokuapp.com/)
- admin test account: admin123
- password: 123456

## Requirements

- [Node and npm](http://nodejs.org)
- [MongoDB](https://docs.mongodb.com/)
## Installation

1. Clone the repository: `git clone https://github.com/npanhthu/HRSmartcop.git`
2. Install the application: `npm install`
3. Install webpack to built: `npm install webpack -g`
3. Place your own MongoDB URI in `Server/utils/connect.js` or default that is a mongodb live url on site modulusmongo
4. built react jsx to js: `webpack`
5. Start the server: `node app.js`
6. View in browser at `http://localhost:3007`