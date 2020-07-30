# Election Data Quality Web Application

#### https://github.com/msukmoon/election-data-quality

Election Data Quality is a web application developed using React, Spring, React-Leaflet, React Bootstrap and styled-components.

The U.S. redraws their [electoral precincts](https://en.wikipedia.org/wiki/Electoral_precinct) every 10 years after the census. This application is part of the bigger project that aims to draw precincts fairly and prevent [gerrymandering](https://en.wikipedia.org/wiki/Gerrymandering) by using computing technologies. This application lets users to easily check and edit geological and statistical election data.

<p align="center">
  <img src="doc/screenshots/states.png" title="State Level View">
  <img src="doc/screenshots/counties.png" title="County Level View">
  <img src="doc/screenshots/loading.png" title="Loading Message">
  <img src="doc/screenshots/precincts.png" title="Precinct Level View">
  <img src="doc/screenshots/sidebar.png" title="Sidebar View">
  <img src="doc/screenshots/neighbors.png" title="Neighbors Highlighted">
  <img src="doc/screenshots/drawing.png" title="Drawing Shape Mode">
  <img src="doc/screenshots/editing.png" title="Editing Shape Mode">
</p>

## Getting Started

This repository only contains a front-end part of the application. The source code of a back-end part of the application is at this [repository](https://github.com/HOZH/hozh-416). The source code for preprocessing the election data could be provided when requested to [brendankon](https://github.com/brendankon).

### Running the Application

#### Requirements

- Java SE 14 or higher
- Node.js v12.16.0 or higher

#### Instructions

1. Clone this repository.

```shell
git clone https://github.com/msukmoon/election-data-quality
```

2. Go to the cloned directory.

```shell
cd election-data-quality
```

3. Do a clean install of the application.

```shell
npm ci
```

4. Launch the server.

```shell
java -jar server/hozh-server-0.8.3.jar
```

5. In another terminal tab or window, start the application package.

```shell
npm start
```

### Checking Source Codes

Source codes are mainly in `src` folder. All React components are in `src/components` folder. Most of the work is put into the map component which is `src/components/MapView.js`.

## Authors

- **Myungsuk (Jay) Moon** - [msukmoon](https://github.com/msukmoon) - jaymoon9876@gmail.com
  - Wrote the front-end part of the application.
- **Brendan Kondracki** - [brendankon](https://github.com/brendankon)
  - Preprocessed the geological and statistical election data for the application.
- **Hong Zheng** - [HOZH](https://github.com/HOZH)
  - Developed the server of the application.
- **Hye-Jun Jeong** - [HyejunJeong](https://github.com/HyejunJeong)
  - Developed the database of the application and worked on integrating it to the server.
