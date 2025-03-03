# GearUp - Outdoor Adventure Gear E-commerce Platform

GearUp is an Angular-based e-commerce application designed for outdoor enthusiasts to browse, purchase, and order adventure gear. This modern web application provides a seamless shopping experience with user authentication, product browsing, cart management, and order processing.

## Project Overview

GearUp is built with:

- **Angular 16.2.10** - Frontend framework
- **Angular Material** - UI component library
- **TailwindCSS** - Utility-first CSS framework
- **RxJS** - Reactive programming library

## Features

### User Authentication

- Login and registration
- JWT-based authentication
- Protected routes with auth guards

### Product Management

- Browse product catalog
- View detailed product information
- Filter and search products

### Shopping Experience

- Add items to cart
- Update quantities
- Remove items
- Persistent cart across sessions

### Checkout Process

- Order summary
- Shipping information collection
- Order confirmation

### Responsive Design

- Mobile-friendly interface
- Optimized for various screen sizes

## Project Structure

The application follows a feature-based architecture:

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/gearup.git
   cd gearup
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   ng serve
   ```
4. **Navigate to** `http://localhost:4200/` in your browser.

## Development

### Development Server

Run `ng serve` for a dev server. The application will automatically reload if you change any of the source files.

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Tests

- **Unit Tests:** Run `ng test` to execute the unit tests via Karma.
- **End-to-End Tests:** Run `ng e2e` to execute the end-to-end tests.

## API Integration

The application connects to a backend API for data persistence. The API endpoints are configured in the environment files:

- **Development:** `src/app/environments/environment.ts`
- **Production:** `src/app/environments/environment.prod.ts`

## Styling

The project uses a combination of:

- **TailwindCSS** for utility-based styling
- **Angular Material** components for complex UI elements
- **Custom CSS** for specific styling needs

## Deployment

For production deployment:

1. **Build the production version:**
   ```sh
   ng build --prod
   ```
2. **Deploy the contents of the `dist/gearup` directory** to your web server or hosting service.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Angular team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- The open-source community for various libraries and tools used in this project
