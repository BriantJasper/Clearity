import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </>
  );
}
