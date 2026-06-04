function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-500">
          CryptoCode
        </h1>

        <div className="space-x-6">
          <button className="hover:text-blue-500">
            Home
          </button>

          <button className="hover:text-blue-500">
            Features
          </button>

          <button className="hover:text-blue-500">
            About
          </button>

          <button className="bg-blue-600 px-4 py-2 rounded-lg">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-32 px-5">

        <h1 className="text-6xl font-bold">
          Secure Online Coding Platform
        </h1>

        <p className="mt-6 text-xl text-gray-400">
          Practice, Execute and Track Code Securely
        </p>

        <div className="mt-8">
          <button className="bg-blue-600 px-8 py-3 rounded-lg mr-4">
            Get Started
          </button>

          <button className="border border-blue-600 px-8 py-3 rounded-lg">
            Learn More
          </button>
        </div>
      </div>

    </div>
  );
}

export default Landing;