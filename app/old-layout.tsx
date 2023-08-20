// Import required libraries
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

// Layout component
export default function Layout({ children }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <div
        className={`fixed inset-0 z-20 bg-black opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`flex min-h-screen flex-col overflow-x-hidden transition duration-300 lg:static lg:inset-0 lg:translate-x-0${
          isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-between bg-gray-900 p-4 text-white">
          <button className="lg:hidden" onClick={toggleSidebar}>
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm1 5a1 1 0 100 2h16a1 1 0 100-2H4z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <nav className="grow overflow-y-auto bg-gray-800 p-4 text-white">
          {/* Navigation Links */}
          <Link href="/">
            <a
              className={`block rounded px-4 py-1 ${
                router.pathname === '/' ? 'bg-gray-900' : ''
              }`}
            >
              Home
            </a>
          </Link>
          <Link href="/about">
            <a
              className={`mt-2 block rounded px-4 py-1 ${
                router.pathname === '/about' ? 'bg-gray-900' : ''
              }`}
            >
              About
            </a>
          </Link>
        </nav>
      </div>

      <div className="grow bg-gray-200 p-10 lg:flex lg:items-center lg:justify-center">
        {children}
      </div>
    </div>
  )
}
