import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div>
        <header className="flex justify-between items-center p-4 bg-gray-100">
        <Link href="/" className="text-2xl font-bold hover:text-gray-700">
          PDF Editor
        </Link>
        
        <nav className="space-x-20 pr-20">
          <Link href="/add" className="hover:text-gray-700">
            Add
          </Link>
          <Link href="/link2" className="hover:text-gray-700">
            Link2
          </Link>
          <Link href="/link3" className="hover:text-gray-700">
            Link3
          </Link>
        </nav>
      </header>
    </div>
  )
}

export default Header