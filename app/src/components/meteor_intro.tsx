import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MeteorIntro: React.FC = () => {
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLaunched(true), 800); // auto-launch
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "radial-gradient(circle at center, #0a0d1f 0%, #020308 100%)",
        position: "relative",
      }}
    >
      <AnimatePresence>
        {!launched && (
          <motion.div
            key="meteor"
            initial={{ x: "50vw", y: "20vh", rotate: 20, scale: 1 }}
            animate={{
              y: ["20vh", "15vh", "22vh", "20vh"],
              transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            }}
            exit={{
              x: "-120vw",
              rotate: -720,
              scale: 0.3,
              transition: { duration: 1.2, ease: "easeIn" },
            }}
            style={{
              position: "absolute",
              width: 180,
              height: 180,
              background: "radial-gradient(circle at 30% 30%, #ff9900, #a63a00 80%)",
              borderRadius: "50%",
              boxShadow:
                "0 0 30px 10px rgba(255,150,0,0.4), 0 0 60px 40px rgba(255,80,0,0.2)",
              filter: "blur(0.5px)",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -80,
                top: 50,
                width: 150,
                height: 30,
                background: "linear-gradient(90deg, rgba(255,160,0,0.7), transparent)",
                transform: "rotate(10deg)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          textAlign: "center",
          color: "white",
          fontSize: 18,
          letterSpacing: 1,
        }}
      >
        <p style={{ margin: 0 }}>☄️ Meteor Impact Initializing...</p>
      </motion.div>
    </div>
  );
};

export default MeteorIntro;
