import { Link } from 'react-router-dom'
import { PenLine, Github, Twitter, Rss } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-900 text-ink-300">
      <div className="section py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <PenLine size={15} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">BlogSphere</span>
            </Link>
            <p className="text-sm text-ink-400 leading-relaxed max-w-xs">
              A modern blogging platform for thoughtful writers. Share your ideas with the world, beautifully.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { href: 'https://twitter.com', icon: <Twitter size={15} /> },
                { href: 'https://github.com',  icon: <Github  size={15} /> },
                { href: '/rss',                icon: <Rss     size={15} /> },
              ].map(({ href, icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-ink-800 hover:bg-brand-600 flex items-center justify-center transition-colors text-ink-400 hover:text-white">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/blogs">All Posts</FooterLink>
              <FooterLink to="/about">About</FooterLink>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display font-semibold text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/login">Sign in</FooterLink>
              <FooterLink to="/register">Create account</FooterLink>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-600">
          <p>© {year} BlogSphere. Built with React &amp; Supabase.</p>
          <p>Made with ♥ for writers everywhere</p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-ink-400 hover:text-brand-400 transition-colors">{children}</Link>
    </li>
  )
}
