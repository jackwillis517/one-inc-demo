export default function Navbar() {
  return (
    <nav className="w-full bg-[#23669A] flex items-center h-20 px-6">
      <div className="flex items-center h-full">
        {/* Replace src with your logo image path */}
        <img
          src="/assets/logo.png"
          alt="Company Logo"
          className="h-20 w-auto"
        />
      </div>
      {/* Add more navbar content here if needed */}
    </nav>
  );
}
