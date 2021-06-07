# Ordsky.no

This is the react frontend for Ordsky.no

## Structure

The application is structured as an MVP application.

There is a folder for each feature, with components and business logic used by multiple features located in the common folder.

### View

The view is located in the components folder and structured according to atomic design:

- Atoms: Pure and small UI components
- Molecules: Collection of atoms, may contain some UI logic
- Organisms: Distinc sections of UI, such as NAV. Collection of Molecules and Atoms
- Templates:

Some feature specific components are located in each feature folder.

### Presenter

The Page components act as presenters. The role of the presenter is to delegate logic to components.
There is one Page component in each feature folder.

### Services

The services folder contains the business logic and talks to the state.

Core business logic is found in the common/core folder.

### Model

The state folder contains the application state.

## Integrations

The app connects to an API hosted in AWS for the collaborative session feature.
