// src/pages/Home.tsx
import React from "react";
import MeteorIntro from "../components/meteor_intro";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MeteorIntro onLaunch={() => navigate("/globe")} />
  );
};

export default Home;
