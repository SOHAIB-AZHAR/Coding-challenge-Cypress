# Cypress Automation Testing

This project contains end-to-end test automation using [Cypress](https://www.cypress.io/) for the website [Demoblaze](https://www.demoblaze.com).

## 🚀 Project Overview

This repository is intended to demonstrate and run automated UI tests using Cypress. It is configured to test user flows on the [Demoblaze](https://www.demoblaze.com) demo web application.

## 📁 Project Structure

cypress-automation-testing/ ├── cypress/ │ ├── e2e/ # Test specifications │ └── support/ # Cypress support files ├── cypress.config.js # Cypress configuration file ├── package.json # Project metadata and dependencies └── README.md # Project documentation


## 🛠 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cypress-automation-testing.git
   cd cypress-automation-testing
2. **Install dependencies:**

npm install

**3. Running Tests**
To open the Cypress test runner UI:

npx cypress open

To run tests in headless mode (CLI):

npx cypress run
