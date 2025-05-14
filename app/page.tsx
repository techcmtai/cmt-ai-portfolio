"use client"

import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import { ArrowRight, Search, X } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

// Define interfaces for our data types
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  technologies: string[];
}

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  className?: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  image: string;
  technologies: string[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("Static Website")
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"))
        const projectsData = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title || data.Title || "Untitled Project",
            description: data.description || data.Description || "No description available",
            category: data.category || data.Category || "Uncategorized",
            image: data.image || data.Image || "/placeholder.svg",
            link: data.link || data.Link || "#",
            technologies: data.technologies || data.Technologies || []
          } as Project
        })
        setProjects(projectsData)
        console.log("Fetched Projects:", projectsData)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setProjects([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects based on search query and active tab
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      // If no search query, return projects based on active tab
      return projects.filter(project => 
        project?.category === activeTab
      )
    }

    // If search query exists, search across all projects
    const query = searchQuery.toLowerCase().trim()
    return projects.filter((project) => {
      if (!project) return false
      
      return (
        (project.title?.toLowerCase() || "").includes(query) ||
        (project.description?.toLowerCase() || "").includes(query) ||
        (project.technologies || []).some((tech: string) => 
          (tech?.toLowerCase() || "").includes(query)
        ) ||
        (project.category?.toLowerCase() || "").includes(query)
      )
    })
  }, [searchQuery, activeTab, projects])

  // Clear search and reset to active tab
  const clearSearch = () => {
    setSearchQuery("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-zinc-400">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-10">
      {/* Portfolio Section */}
      <section className="py-10 bg-zinc-950">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-600">CMT AI</span>{" "}
              Portfolio
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Explore our diverse range of projects across different technology domains
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Search projects by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2 bg-zinc-900/70 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Only show tabs if not searching */}
          {!searchQuery && (
            <div className="mb-8">
              {/* Mobile-friendly tabs */}
              <div className="grid grid-cols-2 gap-2 sm:hidden">
                <MobileTabButton active={activeTab === "Static Website"} onClick={() => setActiveTab("Static Website")}>Static Website</MobileTabButton>
                <MobileTabButton active={activeTab === "Dynamic Website"} onClick={() => setActiveTab("Dynamic Website")}>Dynamic Website</MobileTabButton>
                <MobileTabButton active={activeTab === "E-commerce"} onClick={() => setActiveTab("E-commerce")}>E-commerce</MobileTabButton>
                <MobileTabButton active={activeTab === "AI & ML"} onClick={() => setActiveTab("AI & ML")}>AI & ML</MobileTabButton>
                <MobileTabButton active={activeTab === "Mobile Apps"} onClick={() => setActiveTab("Mobile Apps")} className="col-span-2">Mobile Apps</MobileTabButton>
              </div>

              {/* Desktop tabs */}
              <div className="hidden sm:flex justify-center">
                <div className="inline-flex bg-zinc-900/50 border border-zinc-800 rounded-lg p-1">
                  <DesktopTabButton active={activeTab === "Static Website"} onClick={() => setActiveTab("Static Website")}>Static Website</DesktopTabButton>
                  <DesktopTabButton active={activeTab === "Dynamic Website"} onClick={() => setActiveTab("Dynamic Website")}>Dynamic Website</DesktopTabButton>
                  <DesktopTabButton active={activeTab === "E-commerce"} onClick={() => setActiveTab("E-commerce")}>E-commerce</DesktopTabButton>
                  <DesktopTabButton active={activeTab === "AI & ML"} onClick={() => setActiveTab("AI & ML")}>AI & ML</DesktopTabButton>
                  <DesktopTabButton active={activeTab === "Mobile Apps"} onClick={() => setActiveTab("Mobile Apps")}>Mobile Apps</DesktopTabButton>
                </div>
              </div>
            </div>
          )}

          {/* Search results heading */}
          {searchQuery && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                {filteredProjects.length > 0 ? (
                  <>
                    Search Results <span className="text-zinc-400">({filteredProjects.length})</span>
                  </>
                ) : (
                  <span className="text-zinc-400">No results found for "{searchQuery}"</span>
                )}
              </h2>
            </div>
          )}

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  category={project.category}
                  image={project.image}
                  technologies={project.technologies}
                />
              ))}
            </div>
          ) : (
            // No results found
            searchQuery && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900/50 mb-4">
                  <Search className="h-8 w-8 text-zinc-500" />
                </div>
                <p className="text-zinc-400 max-w-md mx-auto">
                  Try searching for different keywords or browse projects by category.
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-4 inline-flex items-center text-teal-400 hover:text-teal-300 font-medium"
                >
                  Clear search and show all projects
                </button>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  )
}

function MobileTabButton({ children, active, onClick, className = "" }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-teal-500/20 to-purple-600/20 border border-teal-500/30 text-white"
          : "bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white"
      } ${className}`}
    >
      {children}
    </button>
  )
}

function DesktopTabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
        active ? "bg-gradient-to-r from-teal-500/20 to-purple-600/20 text-white" : "text-zinc-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  )
}

function ProjectCard({ title, description, category, image, technologies }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all duration-300 group">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={600}
          height={400}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech: string, index: number) => (
              <span key={index} className="text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
      <CardContent className="p-4 sm:p-6">
        <div className="text-xs font-medium text-teal-400 mb-2">{category}</div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-zinc-400 text-xs sm:text-sm mb-4">{description}</p>
        <Link
          href="#"
          className="inline-flex items-center text-xs sm:text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
        >
          View Project <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}

// Project data
const staticProjects = [
  {
    title: "Corporate Landing Page",
    description: "A high-performance static website for a financial services company",
    image: "/placeholder.svg?key=xwmc7",
    technologies: ["Next.js", "Tailwind CSS", "Vercel"],
  },
  {
    title: "Portfolio Website",
    description: "A creative portfolio for a digital artist showcasing their work",
    image: "/placeholder.svg?key=x4a64",
    technologies: ["React", "GSAP", "Netlify"],
  },
  {
    title: "Restaurant Website",
    description: "An elegant website for a high-end restaurant with online reservations",
    image: "/placeholder.svg?key=z950p",
    technologies: ["Astro", "Tailwind CSS", "Cloudflare"],
  },
]

const dynamicProjects = [
  {
    title: "Content Management System",
    description: "A custom CMS for a media company to manage digital content",
    image: "/placeholder.svg?key=cms01",
    technologies: ["React", "Node.js", "MongoDB", "AWS"],
  },
  {
    title: "Learning Management System",
    description: "An interactive platform for online courses and educational content",
    image: "/placeholder.svg?key=6kdgc",
    technologies: ["Next.js", "PostgreSQL", "Auth.js", "AWS"],
  },
  {
    title: "Real Estate Portal",
    description: "A property listing website with advanced search and filtering options",
    image: "/placeholder.svg?key=it6ec",
    technologies: ["Vue.js", "Firebase", "Google Maps API"],
  },
]

const ecommerceProjects = [
  {
    title: "Fashion E-commerce Store",
    description: "A modern online fashion store with personalized recommendations",
    image: "/placeholder.svg?key=fash1",
    technologies: ["Next.js", "Shopify", "Stripe", "Tailwind CSS"],
  },
  {
    title: "Electronics Marketplace",
    description: "Multi-vendor electronics marketplace with comparison features",
    image: "/placeholder.svg?key=elec1",
    technologies: ["React", "Node.js", "MongoDB", "Redux"],
  },
  {
    title: "Subscription Box Service",
    description: "Recurring subscription platform for curated monthly product boxes",
    image: "/placeholder.svg?key=subs1",
    technologies: ["Vue.js", "Stripe", "Firebase", "Vuex"],
  },
]

const aiProjects = [
  {
    title: "Predictive Analytics Dashboard",
    description: "AI-powered business intelligence platform for data-driven decisions",
    image: "/placeholder.svg?key=pred1",
    technologies: ["Python", "TensorFlow", "React", "D3.js"],
  },
  {
    title: "Natural Language Processing Tool",
    description: "Text analysis tool for sentiment analysis and content categorization",
    image: "/placeholder.svg?key=nlp01",
    technologies: ["Python", "PyTorch", "FastAPI", "Next.js"],
  },
  {
    title: "Computer Vision Application",
    description: "Image recognition system for automated quality control in manufacturing",
    image: "/placeholder.svg?key=t7jdp",
    technologies: ["Python", "OpenCV", "TensorFlow", "React"],
  },
]

const mobileProjects = [
  {
    title: "Fitness Tracking App",
    description: "Cross-platform mobile application with personalized workout plans",
    image: "/placeholder.svg?key=ic3ql",
    technologies: ["React Native", "Firebase", "Redux", "Expo"],
  },
  {
    title: "Food Delivery App",
    description: "On-demand food delivery platform with real-time order tracking",
    image: "/placeholder.svg?key=food1",
    technologies: ["Flutter", "Firebase", "Google Maps", "Stripe"],
  },
  {
    title: "Travel Companion App",
    description: "All-in-one travel app with itinerary planning and local recommendations",
    image: "/placeholder.svg?key=c810o",
    technologies: ["React Native", "GraphQL", "MongoDB", "AWS Amplify"],
  },
]
