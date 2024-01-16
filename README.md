# CybGPT API
<p>
  <img alt="Static Badge" src="https://img.shields.io/badge/code%20style-standardJS-blue?logo=javascript&logoColor=white">
  <img alt="Static Badge" src="https://img.shields.io/badge/licence-GPL3.0-blue">
</p>



CybGPT, a pioneering project by Coinnect SA, is at the forefront of integrating OpenAI's advanced GPT technology with the complex landscape of cybersecurity. This AI-driven plugin is not just a repository of information but a dynamic, evolving assistant tailored for both cybersecurity professionals and enthusiasts. By leveraging the cutting-edge capabilities of GPT, CybGPT stands out as a versatile and adaptive tool, designed to grow with each interaction and stay abreast of the rapidly changing cyber threat environment. CybGPT's strength lies in its ability to simplify and explain complex security concepts, making it an invaluable resource for users at all levels of expertise. Coinnect SA's development of the CybGPT API marks a significant advancement in its functionality. The API allows CybGPT to interact directly with servers, enabling it to perform a wide range of critical cybersecurity tasks. These include, but are not limited to, system scanning, real-time retrieval of security statistics, and detection of exfiltrated credentials. 

## Project Goals

Our mission is to build an AI assistant that not only responds to queries but also anticipates the needs of its users, offering:
- Proactive threat detection and analysis
- Simplified explanations of complex security issues
- Customizable tools for risk assessment and mitigation
- An open-source hub for Cyber Security AI innovation

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
