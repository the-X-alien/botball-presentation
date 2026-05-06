"use client"
import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Lightbulb, Bot, Code, Cpu, Trophy, ChevronDown, ChevronUp, Menu, X, Cog, ArrowDown } from "lucide-react"
import { CTASection } from "@/components/ui/hero-dithering-card"
import { ShaderAnimation } from "@/components/ui/shader-animation"
import { SensorShowcase } from "@/components/ui/sensor-showcase"

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
}

function SectionNavButton({ onClick, label }: { onClick: () => void, label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
      className="flex justify-center mt-16"
    >
      <motion.button
        onClick={onClick}
        className="group flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xs font-medium tracking-widest">SCROLL TO {label.toUpperCase()}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </motion.div>
  )
}

const sections = [
  { id: "hero", label: "Home" },
  { id: "what-is", label: "What is Botball?" },
  { id: "how-works", label: "How It Works" },
  { id: "sensors", label: "Sensors" },
  { id: "functions", label: "Botball Functions" },
  { id: "programming", label: "Programming" },
  { id: "motors", label: "Motors & Servos" },
  { id: "community", label: "Community Service" },
]

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (index: number) => {
    const el = document.getElementById(sections[index]?.id)
    if (el) {
      const targetPosition = el.offsetTop
      const startPosition = window.scrollY
      const distance = targetPosition - startPosition
      const duration = 1000
      let startTime: number | null = null
      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        window.scrollTo(0, startPosition + distance * easeOut)
        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll)
        }
      }
      requestAnimationFrame(animateScroll)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))
      const sectionElements = sections.map(s => document.getElementById(s.id))
      const scrollPos = window.scrollY + window.innerHeight / 3
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i]
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(i)
          break
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToNext = () => {
    const nextIndex = Math.min(activeSection + 1, sections.length - 1)
    scrollToSection(nextIndex)
  }

  const scrollToPrev = () => {
    const prevIndex = Math.max(activeSection - 1, 0)
    scrollToSection(prevIndex)
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation Sidebar */}
      <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2">
        {sections.map((section, i) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(i)}
            className="group relative flex items-center"
          >
            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              i === activeSection
                ? "bg-cyan-400 border-cyan-400 scale-125"
                : "border-white/30 group-hover:border-white/60"
            }`} />
            <span className={`absolute left-6 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
              i === activeSection
                ? "opacity-100 translate-x-0 bg-black/80 text-white"
                : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 bg-black/60 text-white/80"
            }`}>
              {section.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="fixed top-4 right-4 z-50 xl:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="absolute top-16 right-0 w-56 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
            >
              {sections.map((section, i) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                    i === activeSection
                      ? "bg-cyan-400/20 text-cyan-400"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section 1: Hero */}
      <section id="hero" className="relative h-screen">
        <div className="absolute inset-0 z-0">
          <ShaderAnimation />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <CTASection onExplore={scrollToNext} />
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <SectionNavButton onClick={scrollToNext} label={sections[1]?.label || "Next"} />
        </div>
      </section>

      {/* Section 2: What is Botball */}
      <section id="what-is" className="relative min-h-screen flex items-center py-24 px-4 md:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-background to-purple-950/50" />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-400">
              <Trophy className="w-4 h-4" />
              <span>About Botball</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              What is Botball?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Botball is a national K-12 educational robotics competition where teams of students design, build, and program autonomous robots to solve complex challenges. Unlike remote-controlled robots, Botball robots operate entirely on their own using pre-written code and sensor inputs.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "Autonomous",
                desc: "Robots run entirely without human intervention during matches. All decisions are made by pre-programmed code responding to sensor inputs in real-time.",
                color: "from-blue-500/20 to-cyan-500/20",
              },
              {
                icon: Lightbulb,
                title: "Educational",
                desc: "Focuses on STEM learning, teamwork, and problem-solving skills. Students learn C programming, engineering principles, and collaborative design.",
                color: "from-yellow-500/20 to-orange-500/20",
              },
              {
                icon: Trophy,
                title: "Competitive",
                desc: "Teams compete in regional and national tournaments with seeded brackets. Points are scored by completing tasks, acquiring multipliers, and documenting the engineering process.",
                color: "from-purple-500/20 to-pink-500/20",
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                variants={sectionVariants}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2 }}
                className="group relative p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl hover:border-white/20 transition-all duration-500"
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${item.color}`} />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <SectionNavButton onClick={scrollToNext} label={sections[2]?.label || "Next"} />
        </div>
      </section>

      {/* Section 3: How Botball Works - NOW CENTERED */}
      <section id="how-works" className="relative min-h-screen flex items-center py-24 px-4 md:px-6 bg-muted/30">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-400">
              <Bot className="w-4 h-4" />
              <span>The Format</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              How Botball Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Each team receives an identical kit of parts and has ~12 weeks to build robots that can complete that year's game challenge. Robots must be fully autonomous. That means if it fails, you cannot intervene.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Kit Contents",
                items: [
                  "KIPR Robot Controller (Running Botball Software in Kiosk Mode on RaspiOS)",
                  "4 Motors",
                  "Both Full Servos and 9g Servos for precise positioning on things like the claw",
                  "A full Suite of Sensors (Light, Tophat, ET Rangefinder)",
                  "Structural Parts (Aluminum, Lego, Gears)",
                  "Rechargeable 9V Battery & Charger"
                ],
                icon: Bot
              },
              {
                title: "Competition Format",
                items: [
                  "2-minute autonomous matches",
                  "Seeding matches + double elimination bracket",
                  "Scoring based on task completion * multiplier",
                  "Teamwork and documentation judged separately",
                  "Engineering Journal (Documentation) required",
                  "Interview of the team with a small presentation"
                ],
                icon: Trophy
              }
            ].map((section, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                variants={sectionVariants}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.3 }}
                className="relative p-8 md:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-background to-background/95 backdrop-blur-xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <section.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6">{section.title}</h3>
                  <ul className="space-y-4">
                    {section.items.map((item, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-muted-foreground leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          <SectionNavButton onClick={scrollToNext} label={sections[3]?.label || "Next"} />
        </div>
      </section>

      {/* Section 4: Sensors */}
      <section id="sensors" className="relative">
        <SensorShowcase onScrollNext={scrollToNext} nextLabel={sections[4]?.label || "Next"} />
      </section>

      {/* Section 5: Botball Functions */}
      <section id="functions" className="relative min-h-screen flex items-center py-24 px-4 md:px-6 bg-muted/30">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* ... (all your original Functions content) ... */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm font-medium text-orange-400">
              <Code className="w-4 h-4" />
              <span>KIPR C Library</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Botball Functions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The KIPR library provides powerful C functions for controlling motors, reading sensors, and managing robot behavior. Here are the core functions you'll use.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              // ... all your function categories (unchanged)
            ].map((category, i) => (
              <motion.div key={i} /* ... your original card ... */ >
                {/* Keep all your original function cards */}
              </motion.div>
            ))}
          </div>
          <SectionNavButton onClick={scrollToNext} label={sections[5]?.label || "Next"} />
        </div>
      </section>

      {/* Section 6: Programming */}
      <section id="programming" className="relative min-h-screen flex items-center py-24 px-4 md:px-6">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* ... your full original Programming section ... */}
          <SectionNavButton onClick={scrollToNext} label={sections[6]?.label || "Next"} />
        </div>
      </section>

      {/* Section 7: Motors & Servos - NOW CENTERED */}
      <section id="motors" className="relative min-h-screen flex items-center py-24 px-4 md:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/30 via-background to-red-950/30" />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm font-medium text-orange-400">
              <Cog className="w-4 h-4" />
              <span>The Moving Parts</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Motors & Servos
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Movement in Botball robots is controlled by motors for drive wheels and servos for precise positioning of claws, bulldozers, and other mechanisms.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Your original Motors card */}
            <motion.div /* ... your full motors card ... */ />
            {/* Your original Servos card */}
            <motion.div /* ... your full servos card ... */ />
          </div>
          
          {/* FIXED: Now properly centered */}
          <SectionNavButton onClick={scrollToNext} label={sections[7]?.label || "Next"} />
        </div>
      </section>

      {/* Section 8: Community Service */}
      <section id="community" className="relative min-h-screen flex items-center py-24 px-4 md:px-6 bg-muted/30">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* ... your full original community section ... */}
          <SectionNavButton onClick={() => scrollToSection(0)} label="Home" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Made with 💖 By{" "}
            <a href="https://github.com/the-X-alien" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Dhiaan Dave
            </a>
            {" + The Thomas Russell Botball Team"}
          </p>
        </div>
      </footer>
    </div>
  )
}
