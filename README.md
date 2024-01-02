# CybGPT API Interface

This project is the API interface for CybGPT, created by Coinnect SA. CybGPT is a powerful AI system designed for various cybersecurity tasks. With this API, CybGPT can interact with server to perform actions such as scanning, retrieving statistics, checking for exfiltrated credentials, and more.

## Installation

### Prerequisites
Node.js: This project requires Node.js to run. If you don't have Node.js installed, download and install it from the official website.<br>
MongoDB: This project requires MongoDB to run.

### Getting Started
- Clone the repository
- cd project-folder
- You must create a config.js file in config folder and add parameters to connect to the local mongoDb instance:

```javascript
  const config = {
    "mongo_connection_type": "connection",
    "user_db": "user",
    "ip_db": "ip",
    "name_db": "name"
  };

  module.exports = config;
```

- npm install
- npm start

## Contributing

We welcome contributions from the community to improve and enhance this project. To get involved, please follow the guidelines outlined in our [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is distributed under the terms of the [GNU General Public License version 3](LICENSE.md).

[GNU General Public License version 3](LICENSE.md) is a widely-used open source software license that grants you certain permissions while also imposing certain restrictions. Please review the [LICENSE.md](LICENSE.md) file for the full text of the license and make sure you understand its implications before using, modifying, or distributing this software.

By using this project, you agree to comply with the terms and conditions of the GNU GPLv3 license.
