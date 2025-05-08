import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex justify-between items-center px-8 py-4 bg-white shadow-sm transition-shadow duration-300">
        <div className="flex items-center bg-red-600 px-2 rounded">
          <div className="rounded-md bg-red-600 p-2 mr-2">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="8" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
            </svg>
          </div>
          <Link href="/">
          <span className="font-bold text-xl text-white">Tomato Health Monitor</span>
          </Link>
        </div>

        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 hover:text-gray-900 hover:">
            Home
          </Link>
          <a href="#" className="text-gray-700 hover:text-gray-900 ">
            About
          </a>
          <a href="/contact" className="text-gray-700 hover:text-gray-900">
            Contact
          </a>
        </div>
       <Link href="/login">
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Login
        </Button>
        </Link>
      </nav>
  )
}
