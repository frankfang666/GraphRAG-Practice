# Graph Visualization Web Application

This project is a web application designed to visualize graph data. It provides an interactive interface for users to explore and manage graph data, with features such as node highlighting, graph generation, and data search.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Graph Visualization**: Display and interact with graph data using Cytoscape.js.
- **Node Highlighting**: Highlight specific nodes based on search criteria.
- **Data Fetching**: Retrieve graph data from a server.
- **User Authentication**: Simple login system to access the graph page.
- **File Upload**: Upload files to generate new graph data.
- **Responsive Design**: Adaptable layout for different screen sizes.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`.

## Usage

- **Login**: Use the login page to access the graph visualization features.
- **Graph Page**: Interact with the graph, search for nodes, and view node details.
- **Upload Files**: Use the upload feature to add new data for graph generation.

## Components

- **GraphPage**: Main page for graph visualization.
- **LoginPage**: Handles user authentication.
- **NodeList**: Displays a list of highlighted nodes.
- **MyGraph**: Renders the graph using Cytoscape.js.
- **VerticalMenu**: Provides navigation and action options.
- **SearchArea**: Allows users to search for specific data within the graph.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
