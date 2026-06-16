import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

import MainLayout  from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'

import Home        from '@/pages/Home'
import Blogs       from '@/pages/Blogs'
import BlogDetails from '@/pages/BlogDetails'
import About       from '@/pages/About'
import Login       from '@/pages/Login'
import Register    from '@/pages/Register'
import NotFound    from '@/pages/NotFound'

import Dashboard   from '@/pages/Dashboard'
import AddBlog     from '@/pages/AddBlog'
import EditBlog    from '@/pages/EditBlog'
import ManageBlogs from '@/pages/ManageBlogs'
import ProfilePage from '@/pages/ProfilePage'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminPosts     from '@/pages/admin/AdminPosts'
import AdminUsers     from '@/pages/admin/AdminUsers'
import AdminComments  from '@/pages/admin/AdminComments'
import AdminTeam      from '@/pages/admin/AdminTeam'

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-ink-400 text-sm font-body">Loading…</p>
      </div>
    </div>
  )
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? children : <Navigate to="/login" replace />
}

function RequireAuthor({ children }) {
  const { user, isAuthor, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  if (!isAuthor) return <Navigate to="/" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route element={<MainLayout />}>
        <Route path="/"            element={<Home />} />
        <Route path="/blogs"       element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetails />} />
        <Route path="/about"       element={<About />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
      </Route>

      {/* ── Author protected ── */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard"      element={<RequireAuthor><Dashboard /></RequireAuthor>} />
        <Route path="/blogs/add"      element={<RequireAuthor><AddBlog /></RequireAuthor>} />
        <Route path="/blogs/:id/edit" element={<RequireAuthor><EditBlog /></RequireAuthor>} />
        <Route path="/manage-blogs"   element={<RequireAuthor><ManageBlogs /></RequireAuthor>} />
        <Route path="/profile"        element={<RequireAuth><ProfilePage /></RequireAuth>} />
      </Route>

      {/* ── Admin ── */}
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index           element={<AdminDashboard />} />
        <Route path="posts"    element={<AdminPosts />} />
        <Route path="users"    element={<AdminUsers />} />
        <Route path="comments" element={<AdminComments />} />
        <Route path="team"     element={<AdminTeam />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
