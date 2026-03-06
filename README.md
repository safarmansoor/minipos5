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

**⚠️ Demo Mode Active** - The app is currently in demo mode. To exit demo mode:

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

4. **Update .env.local**:
   - Replace the placeholder credentials in `.env.local` with your actual Supabase credentials
   - Remove the demo mode warnings

5. **Restart the app**: `npm run dev`

**Or use Demo Mode immediately**:
1. **Start the app**: `npm run dev`
2. **Open browser**: Go to `http://localhost:3000/minipos5/`
3. **Login**: Use any username and password
4. **Note**: Data won't be saved to database in demo mode

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

### Option 1: Manual Deployment (Recommended)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com) and create a new repository named `minipos5`
   - Copy the repository URL

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/minipos5.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy to GitHub Pages**:
   ```bash
   # Build the project
   npm run build
   
   # Create and push to gh-pages branch
   git checkout --orphan gh-pages
   git add dist
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   
   # Switch back to main branch
   git checkout main
   ```

5. **Configure GitHub Pages**:
   - Go to your GitHub repository settings
   - Navigate to Pages section
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch
   - Set folder to `/ (root)`

The app will be available at: `https://yourusername.github.io/minipos5/`

### Option 2: Using GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '16'
    - run: npm install
    - run: npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Option 3: Using GitHub CLI (If Available)

```bash
# Install GitHub CLI if not available
# Then run:
gh repo create minipos5 --public --push
npm run build
gh pages deploy dist --branch gh-pages
```

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