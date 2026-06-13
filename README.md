# BlogSphere 🖊️

A modern full-stack blogging platform built with **React 18**, **Tailwind CSS**, and **Supabase**.

## Features

- 🔐 Secure authentication (sign up / sign in / sign out)
- 👤 Role-based access: `reader` · `author` · `admin`
- ✍️ Rich blog editor with cover image upload
- 🏷️ Categories, excerpts, read-time estimation
- 💬 Comment system with admin moderation
- 📊 Author dashboard with post stats
- 🛡️ Admin panel — manage posts, users, comments
- 📱 Fully responsive design

---

## Project Structure

```
blogsphere/
├── src/
│   ├── components/
│   │   ├── common/          # Navbar, Footer, Avatar, Spinner, Pagination, ConfirmModal, EmptyState
│   │   └── blog/            # BlogCard, BlogGrid, BlogForm, CommentSection
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Blogs.jsx
│   │   ├── BlogDetails.jsx
│   │   ├── About.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddBlog.jsx
│   │   ├── EditBlog.jsx
│   │   ├── ManageBlogs.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── NotFound.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminPosts.jsx
│   │       ├── AdminUsers.jsx
│   │       └── AdminComments.jsx
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── hooks/
│   │   ├── useBlogs.js
│   │   └── useCategories.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   ├── supabase.js
│   │   ├── authService.js
│   │   ├── blogService.js
│   │   ├── adminService.js
│   │   └── profileService.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase-schema.sql
├── .env.example
└── package.json
```

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/yourusername/blogsphere.git
cd blogsphere
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Storage** and confirm `blog-images` and `avatars` buckets exist

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Find these in: **Supabase Dashboard → Settings → API**

### 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Roles

| Role     | Capabilities |
|----------|-------------|
| `reader` | Browse & read posts, leave comments |
| `author` | All reader perms + create/edit/delete own posts |
| `admin`  | All author perms + admin panel (manage all posts, users, comments) |

To make yourself an admin, run this in Supabase SQL Editor after signing up:

```sql
update public.profiles
set role = 'admin'
where id = 'your-user-uuid-here';
```

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | React 18 + Vite |
| Styling   | Tailwind CSS |
| Backend   | Supabase (Postgres + Auth + Storage) |
| Routing   | React Router v6 |
| Toasts    | react-hot-toast |
| Icons     | lucide-react |
| Dates     | date-fns |

---

## Deployment

```bash
npm run build   # builds to /dist
```

Deploy `/dist` to **Vercel**, **Netlify**, or any static host.

Set the same environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in your host's dashboard.
