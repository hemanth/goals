# Goal Planning & Tracking App

A modern, responsive web application for setting, tracking, and achieving your yearly goals. Built with Next.js, React, and Tailwind CSS.

[Go Goals](https://h3manth.com/fun/goals)


https://github.com/user-attachments/assets/7c145cdd-22fb-4d65-a7b2-87e86988eb76


## Features

- 🎯 Create and manage personal goals across multiple categories
- 📊 Track progress with interactive sliders and visual feedback
- 🌓 Dark/Light mode support
- 🔍 Command palette for quick navigation (⌘K)
- 💾 Local storage persistence
- ☁️ Optional Supabase cloud sync
- 📱 Fully responsive design
- 🎉 Goal completion celebrations
- 📤 Export goals as JSON

### Goal Categories

- Health & Fitness
- Career & Work
- Personal Development
- Financial
- Relationships
- Other

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Database:** Supabase (optional)
- **State Management:** React Hooks
- **Storage:** LocalStorage + Supabase

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/hemanth/goals.git
cd goals
```

1. Install dependencies:
```bash
npm install
```

1. Start the development server:
```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Cloud Sync Setup (Optional)

To enable cloud synchronization:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a new table called \`goals\` with the following schema:
```sql
create table goals (
  id uuid primary key,
  title text not null,
  description text,
  category text not null,
  progress integer default 0,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```
3. Configure your Supabase credentials in the app settings

## Key Features Explained

### Goal Management
- Create new goals with title, description, and category
- Track progress using an interactive slider
- Mark goals as completed
- Edit or delete existing goals
- Visual feedback for completed goals

### Command Palette (⌘K)
- Quick search through all goals
- Filter goals by category
- Navigate directly to specific goals

### Theme Support
- Automatic system theme detection
- Manual theme toggle (light/dark)
- Persistent theme preference

### Data Management
- Automatic local storage saving
- Export goals as JSON
- Optional cloud synchronization with Supabase
- Offline-first approach

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized navigation for mobile devices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Lucide](https://lucide.dev) for the icons
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [Supabase](https://supabase.com) for the backend infrastructure
