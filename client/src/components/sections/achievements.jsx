import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Award, BookOpen, Briefcase } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "Outstanding Student Award",
    organization: "College of Science and Technology",
    year: "2023",
    description:
      "Awarded for academic excellence and leadership in the Civil Engineering department.",
    icon: <Award className="h-6 w-6 text-emerald-400" />,
    type: "award",
  },
  {
    id: 2,
    title: "Autodesk Certified Professional",
    organization: "Autodesk",
    year: "2023",
    description:
      "Certified in AutoCAD and Revit for professional design and documentation.",
    icon: <BookOpen className="h-6 w-6 text-cyan-400" />,
    type: "certification",
  },
  {
    id: 3,
    title: "Structural Design Competition",
    organization: "National Engineering Conference",
    year: "2022",
    description:
      "First place in the annual structural design competition for innovative bridge design.",
    icon: <Award className="h-6 w-6 text-emerald-400" />,
    type: "award",
  },
  {
    id: 4,
    title: "Construction Safety Certification",
    organization: "OSHA Training Institute",
    year: "2022",
    description:
      "Completed 30-hour OSHA Construction Safety and Health certification.",
    icon: <BookOpen className="h-6 w-6 text-cyan-400" />,
    type: "certification",
  },
  {
    id: 5,
    title: "Best Research Paper",
    organization: "International Conference on Civil Engineering",
    year: "2023",
    description:
      "Award for research on sustainable construction materials and their applications.",
    icon: <Award className="h-6 w-6 text-emerald-400" />,
    type: "award",
  },
];

const experiences = [
  {
    id: 1,
    role: "Civil Engineering Intern",
    company: "Bhutan Construction Corporation",
    duration: "Jun 2023 - Aug 2023",
    responsibilities: [
      "Assisted in structural design and analysis of residential buildings",
      "Prepared construction drawings using AutoCAD and Revit",
      "Conducted site visits and assisted in quality control inspections",
      "Collaborated with project managers on scheduling and resource allocation",
    ],
    icon: <Briefcase className="h-6 w-6 text-emerald-400" />,
  },
  {
    id: 2,
    role: "Research Assistant",
    company: "Sustainable Infrastructure Lab",
    duration: "Jan 2023 - May 2023",
    responsibilities: [
      "Researched sustainable construction materials and their applications",
      "Conducted material testing and analysis",
      "Assisted in writing research papers and technical reports",
      "Presented findings at department seminars",
    ],
    icon: <Briefcase className="h-6 w-6 text-cyan-400" />,
  },
  {
    id: 3,
    role: "Site Engineer Trainee",
    company: "Druk Construction",
    duration: "May 2022 - Jul 2022",
    responsibilities: [
      "Assisted in site surveys and measurements",
      "Monitored construction progress and prepared daily reports",
      "Coordinated between contractors and project managers",
      "Ensured compliance with safety regulations and building codes",
    ],
    icon: <Briefcase className="h-6 w-6 text-emerald-400" />,
  },
];

const AchievementCard = ({ achievement }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="relative pl-10 pb-8 group"
    >
      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 border-2 border-emerald-400 group-hover:bg-emerald-400/20 transition-colors duration-300">
        {achievement.icon}
      </div>
      <div className="text-sm text-emerald-400 font-medium">
        {achievement.year}
      </div>
      <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors duration-300">
        {achievement.title}
      </h3>
      <p className="text-cyan-400 font-medium text-sm mb-2">
        {achievement.organization}
      </p>
      <p className="text-gray-100 text-sm">{achievement.description}</p>

      {achievement.responsibilities && (
        <ul className="mt-3 space-y-2">
          {achievement.responsibilities.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-emerald-400 mr-2 mt-1">•</span>
              <span className="text-gray-100 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

const Achievements = () => {
  return (
    <section id="achievements" className="py-20 bg-zinc-900/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Achievements & <span className="text-emerald-400">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-6"></div>
          <p className="text-gray-100 max-w-3xl mx-auto">
            My professional journey, certifications, and recognitions that
            highlight my dedication to civil engineering.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Achievements & Certifications */}
          <div>
            <motion.h3
              className="text-2xl font-bold text-white mb-8 relative inline-block"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="relative z-10">Awards & Certifications</span>
              <span className="absolute bottom-0 left-0 w-full h-1.5 bg-emerald-400/40 -z-0"></span>
            </motion.h3>

            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-0.5 bg-gradient-to-b from-emerald-400/40 to-cyan-400/40"></div>
              <div className="space-y-8">
                {achievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <motion.h3
              className="text-2xl font-bold text-white mb-8 relative inline-block"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="relative z-10">Work Experience</span>
              <span className="absolute bottom-0 left-0 w-full h-1.5 bg-cyan-400/40 -z-0"></span>
            </motion.h3>

            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-400/40 to-emerald-400/40"></div>
              <div className="space-y-8">
                {experiences.map((exp) => (
                  <AchievementCard key={exp.id} achievement={exp} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Interested in working together?
          </h3>
          <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas or
            opportunities to be part of your visions.
          </p>
          <Button
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-6 text-lg"
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Get In Touch
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
