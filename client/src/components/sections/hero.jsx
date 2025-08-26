import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { ArrowDownToLine, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-900 pt-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0dGVybiBpZD0icGF0dGVybi1iYXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFucm9tPSJzY2FsZSgxKSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0wIDBoNDB2NDBINHYtNDB6IiBmaWxsPSIjZjVmNWY1Ii8+PC9wYXR0ZXJuPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybi1iYXNlKSIvPjwvc3ZnPg==')]">
      </div>

      <div className="container mx-auto px-6 md:px-8 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-neutral-200 block">Hi, I'm</span>
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Sangay Rinchen
              </span>
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-3xl font-semibold text-neutral-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Civil Engineering Student
            </motion.h2>
            
            <motion.p 
              className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Passionate about structural design, sustainable construction, and innovative engineering solutions. 
              Currently pursuing my degree in Civil Engineering with a focus on modern construction technologies.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white hover:text-white px-8 py-6 text-lg">
                <ArrowDownToLine className="mr-2 h-5 w-5" />
                Download Resume
              </Button>
              <Button variant="outline" className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 hover:text-white px-8 py-6 text-lg">
                <Mail className="mr-2 h-5 w-5" />
                Contact Me
              </Button>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur opacity-75"></div>
              <div className="relative bg-zinc-800 p-1 rounded-full">
                <div className="h-64 w-64 md:h-80 md:w-80 rounded-full bg-zinc-700 overflow-hidden border-4 border-zinc-800">
                  {/* Replace with actual profile image */}
                  <div className="w-full h-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center">
                    <span className="text-6xl font-bold text-zinc-500">SR</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <motion.div 
                className="absolute -bottom-4 -right-4 bg-emerald-500 rounded-full w-12 h-12 flex items-center justify-center text-white"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  repeatType: "reverse"
                }}
              >
                <span className="text-xs font-bold">3D</span>
              </motion.div>
              
              <motion.div 
                className="absolute -top-4 -left-4 bg-cyan-500 rounded-full w-10 h-10 flex items-center justify-center text-white"
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: "reverse"
                }}
              >
                <span className="text-xs">CAD</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <span className="text-sm text-neutral-400 mb-2">Scroll Down</span>
        <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-emerald-400 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
