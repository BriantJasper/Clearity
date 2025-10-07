export default function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-indigo-50 to-white"
    >
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
        Transform Your Images Effortlessly
      </h1>
      <p className="text-gray-600 max-w-xl mb-8 text-lg">
        Upload, edit, and enhance your photos right from your browser — no installation needed.
      </p>
      <a
        href="#editor"
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Get Started
      </a>
    </section>
  );
}
