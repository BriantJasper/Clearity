import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}
