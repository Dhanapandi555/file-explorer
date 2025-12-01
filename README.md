# Mac-Style File Explorer

A beautiful, fully-functional file explorer application built with React, TypeScript, and Tailwind CSS that replicates the macOS Finder experience.

![File Explorer](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## ✨ Features

### Multiple View Modes
- **List View**: Detailed table with sortable columns (Name, Date, Size, Kind)
- **Icon View**: Responsive grid layout with large file icons
- **Column View**: Multi-column hierarchical navigation (like macOS Finder)
- **Gallery View**: Thumbnail-based view perfect for media files

### Navigation & Organization
- **Sidebar Navigation**: Quick access to Favorites, Locations, and Media folders
- **Back/Forward Buttons**: Full navigation history support
- **Search**: Real-time file and folder filtering
- **Sorting**: Sort by name, date modified, size, or file type
- **Multi-Selection**: Select multiple items with Cmd/Ctrl + Click

### Design & UX
- **Mac-Inspired Dark Theme**: Authentic macOS appearance
- **Smooth Animations**: Micro-interactions and hover effects
- **Color-Coded Icons**: 15+ file type categories with unique icons
- **Custom Scrollbars**: Styled to match macOS
- **Status Bar**: Shows item count and current path

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173/`

## 🎯 Usage

### Navigation
- **Click** on folders in the sidebar to navigate
- **Double-click** on folders in the main view to open them
- Use **Back/Forward** buttons in the toolbar to navigate history
- **Search** using the search bar in the toolbar

### View Modes
Click the view mode buttons in the toolbar:
- Grid icon: Icon View
- List icon: List View
- Columns icon: Column View
- Image icon: Gallery View

### Selection
- **Single click** to select an item
- **Cmd/Ctrl + Click** to select multiple items
- **Double-click** to open folders or files

### Sorting (List View)
Click on column headers to sort:
- Name
- Date Modified
- Size
- Kind

Click again to toggle between ascending and descending order.

## 📁 Project Structure

```
file-explorer/
├── src/
│   ├── components/          # React components
│   │   ├── Sidebar.tsx
│   │   ├── Toolbar.tsx
│   │   ├── FileIcon.tsx
│   │   ├── ListView.tsx
│   │   ├── IconView.tsx
│   │   ├── ColumnView.tsx
│   │   └── GalleryView.tsx
│   ├── utils/
│   │   └── fileSystem.ts    # File system utilities
│   ├── types.ts             # TypeScript types
│   ├── App.tsx              # Main app component
│   └── index.css            # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ Technologies

- **React 18.2**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  'mac-sidebar': '#1e1e1e',
  'mac-content': '#2d2d2d',
  'mac-hover': '#3a3a3a',
  'mac-selected': '#0066cc',
  'mac-border': '#3f3f3f',
}
```

### Mock Data
Currently uses mock file system data. Edit `src/utils/fileSystem.ts` to:
- Add more mock directories and files
- Integrate with real File System Access API
- Connect to a backend API

## 🔮 Future Enhancements

- [ ] Real file system integration (File System Access API or Electron)
- [ ] Drag and drop file operations
- [ ] Context menu (right-click) actions
- [ ] File preview panel
- [ ] Quick Look functionality
- [ ] Keyboard shortcuts
- [ ] File operations (copy, move, delete, rename)
- [ ] Cloud storage integration
- [ ] Advanced search with filters

## 📝 License

MIT License - feel free to use this project for learning or as a starting point for your own file explorer!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 🙏 Acknowledgments

- Design inspired by macOS Finder
- Icons from Lucide React
- Built with modern web technologies
