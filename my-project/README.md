# Interactive 3D Map Component

## Overview

This project consists of a Svelte component that integrates Mapbox GL JS and Three.js to create an interactive 3D map. The component displays a map with a predefined GeoJSON path and a 3D cube that animates along this path. Additionally, the map features 3D buildings and provides options for dynamic viewing by adjusting the camera position and following the animated path.

## Features

- **3D Map Rendering:** Utilizes Mapbox GL JS for rendering the map with custom styles.
- **GeoJSON Path Visualization:** Displays a path from a GeoJSON file as a line layer on the map.
- **3D Object Animation:** Incorporates a red cube (3D object) that moves along the GeoJSON path.
- **Camera Control and Animation:** Adjusts the camera to follow the 3D object or the path, enhancing the interactive experience.
- **Responsive Design:** Automatically adjusts the rendering based on the map's size, ensuring that the component is suitable for various devices and window sizes.

## Setup

### Prerequisites

- Node.js and npm (Node Package Manager)
- Sveltekit
- TypeScript
- Tailwindcss

### Installation

1. **Clone the repository:**
   git clone [repository-url]
   cd [project-folder]
   

2. **Install dependencies:**
   npm install

3. **Run the development server:**
   npm run dev

   Access the application at `http://localhost:5173`.

### Mapbox Access Token

You will need to replace `'YOUR_ACCESS_TOKEN_HERE'` in the code with your actual Mapbox access token, which you can obtain by signing up at [Mapbox](https://mapbox.com/).

## Usage

Once the application is running, you will start at the landing page you can start by clicking begin and it will take you will see a map loaded with a style defined in the component. The 3D boat will automatically start moving along the predefined path. You can interact with the map by zooming in/out and rotating the view.

## Customization

To customize the path or the 3D object:
- Modify the GeoJSON file located at `./Path` to change the route.
- Adjust the Three.js geometry and material properties in the script to customize the appearance and behavior of the 3D boat.

## Contributing

Contributions to enhance the functionality or documentation of this project are welcome. Please follow the standard fork-and-pull request workflow.


