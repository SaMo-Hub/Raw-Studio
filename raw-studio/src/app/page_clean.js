import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-0">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Creative Digital Work
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Handcrafted digital experiences that blend design, innovation, and craftsmanship
          </p>
        </div>
      </section>

      {/* Galerie Minimale */}
      <section className="px-6 md:px-0 py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center">Recent Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <p>Project 1</p>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <p>Project 2</p>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <p>Project 3</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 md:px-0">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>&copy; 2026 Raw Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
