import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              User Management
            </Link>
            <Link href="/docs" className="text-gray-600 hover:text-gray-900">
              API Docs
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}