# React Maxton - Bootstrap 5 Admin Dashboard

A modern React 19.1.0 implementation of the Maxton Bootstrap 5 admin dashboard theme, featuring responsive design, multiple themes, and comprehensive UI components.

## 🚀 Features

- **React 19.1.0** with TypeScript support
- **Bootstrap 5.3.3** with React Bootstrap components
- **Responsive Design** - Mobile-first approach
- **Multiple Themes** - Blue, Light, Dark, Semi-dark, and Bordered themes
- **Interactive Charts** - ApexCharts integration for data visualization
- **Collapsible Sidebar** - Responsive navigation with MetisMenu-style behavior
- **Modern Components** - Reusable React components following best practices
- **TypeScript** - Full type safety and IntelliSense support
- **SCSS Support** - Custom styling with SASS preprocessing

## 🏗️ Project Structure

```
react-maxton/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.tsx       # Top navigation header
│   │   ├── Sidebar.tsx      # Collapsible sidebar navigation
│   │   └── ThemeCustomizer.tsx # Theme switching component
│   ├── layouts/             # Layout components
│   │   └── MainLayout.tsx   # Main application layout
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx    # Dashboard with charts and widgets
│   │   └── NotFound.tsx     # 404 error page
│   ├── context/             # React context providers
│   │   └── LayoutContext.tsx # Theme and sidebar state management
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # All interface and type definitions
│   ├── utils/               # Utility functions and data
│   │   └── navigationData.ts # Navigation menu configuration
│   ├── assets/              # Static assets from original theme
│   │   ├── css/             # Original CSS files
│   │   ├── images/          # Images and icons
│   │   ├── js/              # Original JavaScript files
│   │   └── sass/            # Original SASS files
│   ├── theme.scss           # Custom SCSS theme implementation
│   ├── index.css           # Main CSS entry point
│   └── App.tsx             # Main application component
```

## 🛠️ Technologies Used

### Core Technologies

- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 4.9.5** - Type-safe JavaScript development
- **React Router Dom 7.6.3** - Client-side routing
- **Bootstrap 5.3.3** - CSS framework
- **React Bootstrap 2.10.10** - Bootstrap components for React

### UI and Visualization

- **ApexCharts 5.2.0** - Modern charting library
- **React ApexCharts 1.7.0** - React wrapper for ApexCharts
- **React Select 5.10.2** - Flexible select components
- **React DatePicker 8.4.0** - Date selection components
- **React Toastify 11.0.5** - Toast notifications

### Forms and Data

- **React Hook Form 7.60.0** - Performant forms with easy validation
- **@hookform/resolvers 5.1.1** - Validation schema resolvers
- **Yup 1.6.1** - Schema validation
- **@tanstack/react-table 8.21.3** - Powerful data tables

### Styling and Assets

- **SASS 1.89.2** - CSS preprocessing
- **React Perfect Scrollbar 1.5.8** - Custom scrollbars
- **React Dropzone 14.3.8** - File upload interface
- **Date-fns 4.1.0** - Date utility library
- **clsx 2.1.1** - Conditional CSS classes

## 🎨 Available Themes

The application supports 5 different themes that can be switched dynamically:

1. **Blue Theme** (Default) - Modern blue color scheme
2. **Light Theme** - Clean light interface
3. **Dark Theme** - Dark mode for better night viewing
4. **Semi-Dark** - Dark sidebar with light content area
5. **Bordered Theme** - Enhanced borders and outlines

Access the theme customizer using the "Customize" button in the bottom-right corner.

## 📊 Dashboard Features

The main dashboard includes:

### Widget Components

- **Welcome Card** - Personalized user greeting with stats
- **Statistics Cards** - Active users, total users with trend indicators
- **Chart Widgets** - Area charts, radial progress, and donut charts
- **Device Analytics** - Breakdown of user devices with percentages
- **Recent Orders Table** - Interactive data table with search

### Interactive Charts

- **Area Charts** - Sales trends and performance metrics
- **Radial Bar Charts** - Progress indicators with gradients
- **Donut Charts** - Device type distribution
- **Responsive Design** - Charts adapt to screen size

## 🚦 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

1. **Clone and navigate to the project**

```bash
cd react-maxton
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm start
```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Available Scripts

- `npm start` - Runs the development server
- `npm run build` - Creates production build
- `npm test` - Runs the test suite
- `npm run eject` - Ejects from Create React App (irreversible)

## 🔧 Configuration

### Theme Customization

Modify `src/theme.scss` to customize:

- Color schemes
- Layout dimensions
- Component styling
- Responsive breakpoints

### Navigation Menu

Update `src/utils/navigationData.ts` to:

- Add new menu items
- Modify existing routes
- Change icons and labels
- Add badges or indicators

### Layout Settings

Adjust `src/context/LayoutContext.tsx` for:

- Default theme selection
- Sidebar behavior
- Global state management

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px - Collapsible sidebar overlay
- **Tablet**: 768px - 1199px - Adaptive layout
- **Desktop**: ≥ 1200px - Full sidebar and content area

## 🧩 Component Architecture

### Layout System

- **MainLayout**: Wrapper for authenticated pages
- **Header**: Top navigation with search, notifications, and user menu
- **Sidebar**: Collapsible navigation with nested menu support
- **ThemeCustomizer**: Theme switching interface

### State Management

- **LayoutContext**: Global state for theme and sidebar
- **React Hook Form**: Form state management
- **Local State**: Component-level state with useState

### TypeScript Integration

- Full type safety for props and state
- Interface definitions for all data structures
- Strict TypeScript configuration
- IntelliSense support in IDEs

## 🔄 Migration from Original Theme

This React implementation maintains:

- ✅ **Visual Design** - Identical look and feel
- ✅ **Responsive Behavior** - Same breakpoints and layout
- ✅ **Theme Switching** - All original themes available
- ✅ **Navigation Structure** - Preserved menu hierarchy
- ✅ **Chart Functionality** - Interactive data visualization
- ✅ **Component Library** - Bootstrap 5 components

### Enhanced Features

- ⚡ **Performance** - React's virtual DOM and optimization
- 🔒 **Type Safety** - TypeScript prevents runtime errors
- 🧪 **Testability** - Component-based architecture for testing
- 🔧 **Maintainability** - Modular component structure
- 📦 **Reusability** - Composable and configurable components

## �� Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is based on the Maxton Bootstrap 5 admin template and is intended for educational and development purposes.

## 🆘 Support

For questions and support:

- Check the [documentation](./docs/)
- Review existing [issues](../../issues)
- Create a new issue for bugs or feature requests

---

**Built with ❤️ using React 19.1.0 and Bootstrap 5**
