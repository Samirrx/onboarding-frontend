/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLogin from "./AuthLogin";
import { motion } from "framer-motion";
import BackgroundPattern2 from "./BackgroundPattern2";
import "./Login.css";

const Login = () => {
  const slides = [
    {
      image: "https://opsbeats.s3.ap-south-1.amazonaws.com/dashboard.png",
      text: "Create Interactive Dashboards",
      description:
        "Design customizable dashboards for real-time data insights.",
    },
    {
      image: "https://opsbeats.s3.ap-south-1.amazonaws.com/recorddetail.png",
      text: "Create Dynamic Forms",
      description:
        "Build responsive forms adapting to user inputs effortlessly.",
    },
    {
      image: "https://opsbeats.s3.ap-south-1.amazonaws.com/workflow.png",
      text: "Create Powerful Workflows",
      description:
        "Automate workflows and streamline tasks using intuitive tools.",
    },
  ];
  const [isTwoStepVerfication, setIsTwoStepVerification] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    if (token && location.pathname === "/login") {
      navigate("/");
    }
  }, [location, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has("twostep")) {
      setIsTwoStepVerification(true);
    }
  }, [location.search]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // if (isTwoStepVerfication) {
  //   return <CodeVerification />;
  // }
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left side - Image Slider and Logo (hidden on mobile) */}
      <div className="relative hidden lg:block lg:w-1/2">
        <BackgroundPattern2>
          <div className="flex items-center justify-center w-full h-full">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full max-w-[77%]"
            >
              <div className="rounded-[32px] border border-white/5 bg-white/10 p-4 backdrop-blur-xl shadow-[0_0_150px_rgba(30,58,138,0.35)]">
                <img
                  src="https://opsbeats.s3.ap-south-1.amazonaws.com/recorddetail.png"
                  alt="Record Detail"
                  className="w-full h-auto object-cover rounded-[20px]"
                />
              </div>
            </motion.div>
          </div>
        </BackgroundPattern2>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-between p-8 pt-28">
          <div className="z-10 space-y-10">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="text-3xl font-bold text-black">
                {slides[currentSlide].text}
              </div>
              <div className="text-xs font-bold text-black">
                {slides[currentSlide].description}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 cursor-pointer rounded-full ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  } transition-all duration-300`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form (centered on mobile) */}
      <AuthLogin />
    </div>
  );
};

export default Login;
