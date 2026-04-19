import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import ServicesSection from "./services";
import ProjectsSection from "./projects";
import PartnersSection from "./partners";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection />
      <PartnersSection />
    </div>
  );
};

export default HomePage;