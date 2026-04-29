import HeroSection from "./sections/HeroSection";
import StatsSection from "./sections/StatsSection";
import ServicesSection from "./sections/ServicesSection";
import ProjectsSection from "./sections/ProjectsSection";
import StoriesSection from "./sections/StoriesSection";
import PartnersSection from "./sections/PartnersSection";

const HomePage = () => {
  return (
    <div className="overflow-x-hidden bg-white">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection />
      <StoriesSection />
      <PartnersSection />
    </div>
  );
};

export default HomePage;
