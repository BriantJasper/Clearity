import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutSection from "../components/AboutSection";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}


