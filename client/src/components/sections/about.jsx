import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";

const skills = [
  { name: 'AutoCAD', level: 90, category: 'software' },
  { name: 'STAAD Pro', level: 85, category: 'software' },
  { name: 'Revit', level: 80, category: 'software' },
  { name: 'ETABS', level: 75, category: 'software' },
  { name: 'SAP2000', level: 70, category: 'software' },
  { name: 'MATLAB', level: 75, category: 'software' },
  { name: 'Structural Design', level: 85, category: 'engineering' },
  { name: 'Construction Management', level: 80, category: 'engineering' },
  { name: 'Surveying', level: 85, category: 'engineering' },
  { name: 'Hydraulics', level: 75, category: 'engineering' },
  { name: 'Project Management', level: 80, category: 'soft' },
  { name: 'Teamwork', level: 90, category: 'soft' },
  { name: 'Problem Solving', level: 85, category: 'soft' },
  { name: 'Communication', level: 80, category: 'soft' },
];

const education = [
  {
    degree: 'B.Tech in Civil Engineering',
    institution: 'College of Science and Technology',
    year: '2021 - Present',
    description: 'Specializing in Structural Engineering and Construction Management'
  },
  {
    degree: 'Higher Secondary Education',
    institution: 'Ugyen Academy',
    year: '2019 - 2021',
    description: 'Science Stream with focus on Physics, Chemistry, and Mathematics'
  }
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-zinc-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            About <span className="text-emerald-400">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-6"></div>
          <p className="text-gray-200 max-w-3xl mx-auto">
            Passionate civil engineering student with a strong foundation in structural design, construction management, and sustainable building practices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-zinc-800 border-zinc-700 h-full">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-emerald-400/30 mb-6">
                    <div className="w-full h-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center">
                      <span className="text-5xl font-bold text-gray-400">SR</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Sangay Rinchen</h3>
                  <p className="text-emerald-400 mb-4">Civil Engineering Student</p>
                  <p className="text-gray-200 text-sm mb-6">
                    Passionate about creating sustainable and innovative structural solutions that shape the future of our cities.
                  </p>
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-200">Residence:</span>
                      <span className="text-white">Bhutan</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-200">Email:</span>
                      <span className="text-white">sangay@example.com</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-200">Phone:</span>
                      <span className="text-white">+975 77 88 99 00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills and Education */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Skills Section */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="w-1 h-6 bg-emerald-400 mr-3"></span>
                  My Skills
                </h3>
                
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-4 flex items-center">
                    <i className="ri-computer-line mr-2 text-emerald-400"></i>
                    Software Skills
                  </h4>
                  <div className="space-y-4">
                    {skills
                      .filter(skill => skill.category === 'software')
                      .map((skill, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-200">{skill.name}</span>
                            <span className="text-gray-200">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-zinc-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full" 
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-medium mb-4 flex items-center">
                    <i className="ri-building-line mr-2 text-emerald-400"></i>
                    Engineering Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter(skill => skill.category === 'engineering')
                      .map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-zinc-700/50 text-white text-sm rounded-full border border-zinc-600"
                        >
                          {skill.name}
                        </span>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4 flex items-center">
                    <i className="ri-team-line mr-2 text-emerald-400"></i>
                    Soft Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills
                      .filter(skill => skill.category === 'soft')
                      .map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-zinc-700/50 text-white text-sm rounded-full border border-emerald-400/30"
                        >
                          {skill.name}
                        </span>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="w-1 h-6 bg-emerald-400 mr-3"></span>
                  Education
                </h3>
                
                <div className="space-y-6">
                  {education.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="relative pl-8 pb-6 border-l-2 border-emerald-400/30 last:border-0 last:pb-0"
                    >
                      <div className="absolute w-4 h-4 rounded-full bg-emerald-400 -left-2 top-1"></div>
                      <div className="absolute w-2 h-2 rounded-full bg-emerald-400 -left-1 top-1 animate-ping"></div>
                      <div className="text-emerald-400 text-sm font-medium">{item.year}</div>
                      <h4 className="text-lg font-bold text-white mt-1">{item.degree}</h4>
                      <p className="text-cyan-400 font-medium text-sm mb-2">{item.institution}</p>
                      <p className="text-gray-200 text-sm">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
