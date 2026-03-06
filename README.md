# Lalasa Bakery POS

A mobile-optimized Point of Sale (POS) web application built with Vite, Vue 3, Bootstrap CSS, and Supabase.

## Features

### Global Features (Available on All Pages)
- **Persistent Search Bar**: Filter current page data in real-time
- **Sales Cancellation**: Cancel any completed sale without deleting records

### Sales Screen (Mobile-First)
- Large, touch-friendly product buttons in a grid layout
- Real-time cart system with quantity management
- "CHARGE" button to save sales to Supabase
- Search functionality to filter products

### Product Management
- Simple product list with Add/Edit functionality
- Modal-based forms for adding and editing products
- Categories: Bakery, Drinks, Snacks, Others
- Search functionality to filter products

### Sales History & Cancellation
- List of past sales with Time, Total, and Status
- "Cancel Sale" button for completed sales
- Detailed view of sale items in modal
- Search by Sale ID or Date

### Technical Features
- **PWA Support**: Add to Home Screen experience
- **GitHub Pages Ready**: Deployed at `/minipos5/` base path
- **Mobile-First Design**: Optimized for touch interactions
- **Local Storage**: Cart persistence across page refreshes

## Tech Stack

- **Frontend**: Vite + Vue 3 (Composition API) + Bootstrap CSS
- **Database**: Supabase (Auth + Database)
- **Icons**: lucide-vue-next
- **PWA**: vite-plugin-pwa
- **Routing**: Vue Router 4

## Setup Instructions

### 1. Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Supabase account (optional for demo mode)

### 2. Installation

```bash
# Clone or download this project
cd minipos5

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Quick Start (Demo Mode)

**No Supabase required!** The app includes a demo mode that works immediately:

1. **Start the app**: `npm run dev`
2. **Open browser**: Go to `http://localhost:3000/minipos5/`
3. **Login**: Use any username and password
4. **Start using**: The app will work in demo mode with mock data

### 4. Full Setup with Supabase (Optional)

For full database functionality:

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be ready

2. **Setup Database**:
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the SQL from `supabase-setup.sql` file

3. **Get API Keys**:
   - Go to Settings > API
   - Copy your Project URL and anon public key

4. **Configure Environment**:
   - Create `.env.local` file in project root
   - Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. **Restart the app**: `npm run dev`

### 4. Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
minipos5/
├── src/
│   ├── components/          # Reusable components
│   ├── composables/         # Vue composables (cart, auth, etc.)
│   ├── pages/              # Page components
│   ├── router/             # Vue Router configuration
│   ├── services/           # API services (Supabase)
│   ├── App.vue             # Main app layout
│   └── main.js             # App entry point
├── public/                 # Static assets
├── supabase-setup.sql      # Database schema
└── README.md              # This file
```

## Pages

1. **Login Page** (`/login`)
   - User authentication
   - Account creation
   - Protected route

2. **Sales Page** (`/sales`)
   - Product selection grid
   - Cart management
   - Sale completion

3. **Product Management** (`/products`)
   - View all products
   - Add new products
   - Edit existing products
   - Delete products

4. **Sales History** (`/history`)
   - View past sales
   - Cancel completed sales
   - Detailed sale view

## Mobile Optimization

- Touch-friendly button sizes (minimum 44px)
- Responsive grid layouts
- Optimized for mobile viewport
- Fixed cart summary on mobile (Sales page)

## PWA Features

- Add to Home Screen capability
- Offline support for cached assets
- Mobile app-like experience
- Custom icons and manifest

## Deployment to GitHub Pages

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Configure GitHub Pages**:
   - Go to your GitHub repository settings
   - Navigate to Pages section
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch
   - Set folder to `/ (root)`

3. **Deploy**:
   ```bash
   npm run build
   git add dist
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

The app will be available at: `https://yourusername.github.io/minipos5/`

## Security Notes

⚠️ **Important**: This is a demo application. For production use:

1. **Authentication**: Replace localStorage auth with proper Supabase Auth
2. **Password Security**: Hash passwords before storing
3. **RLS Policies**: Implement proper Row Level Security
4. **Environment Variables**: Never commit `.env.local` to version control
5. **API Keys**: Use service roles for server-side operations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or contributions, please use the GitHub repository.