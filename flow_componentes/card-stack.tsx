"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Bed, Users, DollarSign } from "lucide-react"
import ColorThief from "colorthief"

interface CardData {
  id: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
  icon: string
  colors: {
    primary: string
    secondary: string
    text: string
    shadow: string
  }
}

// Sample data with Unsplash images
const initialCards: CardData[] = [
  {
    id: 1,
    title: "MAGNA COASTAL",
    subtitle: "Invest in Future",
    description:
      "An undiscovered coastal jewel on the Gulf of Aqaba near the Red Sea, Magna will be a place like nothing on earth.",
    imageUrl:
      "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
    icon: "bed",
    colors: {
      primary: "#1a1a1a",
      secondary: "#333333",
      text: "#ffffff",
      shadow: "rgba(0, 0, 0, 0.5)",
    },
  },
  {
    id: 2,
    title: "AZURE RETREAT",
    subtitle: "Luxury Redefined",
    description: "Experience the pinnacle of coastal living with panoramic ocean views and world-class amenities.",
    imageUrl:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2760&q=80",
    icon: "users",
    colors: {
      primary: "#0f2b46",
      secondary: "#1e4976",
      text: "#ffffff",
      shadow: "rgba(15, 43, 70, 0.6)",
    },
  },
  {
    id: 3,
    title: "TERRA VISTA",
    subtitle: "Natural Harmony",
    description:
      "Nestled between mountains and sea, this sustainable development offers the perfect balance of luxury and nature.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2760&q=80",
    icon: "dollar",
    colors: {
      primary: "#2d4a22",
      secondary: "#4a7a38",
      text: "#ffffff",
      shadow: "rgba(45, 74, 34, 0.6)",
    },
  },
  {
    id: 4,
    title: "SOLARIS HEIGHTS",
    subtitle: "Urban Innovation",
    description:
      "A revolutionary urban development that combines cutting-edge architecture with sustainable living solutions.",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2760&q=80",
    icon: "arrowUpRight",
    colors: {
      primary: "#5a3a31",
      secondary: "#8c5b4a",
      text: "#ffffff",
      shadow: "rgba(90, 58, 49, 0.6)",
    },
  },
  {
    id: 5,
    title: "MERIDIAN BAY",
    subtitle: "Coastal Excellence",
    description: "Where luxury meets the sea. Exclusive waterfront properties with private beaches and marina access.",
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2760&q=80",
    icon: "bed",
    colors: {
      primary: "#1a3a5f",
      secondary: "#2d5f8a",
      text: "#ffffff",
      shadow: "rgba(26, 58, 95, 0.6)",
    },
  },
]

export default function CardStack() {
  const [cards, setCards] = useState<CardData[]>(initialCards)
  const [loading, setLoading] = useState(true)
  const [extractedColors, setExtractedColors] = useState<boolean>(false)

  // Extract colors from images when component mounts
  useEffect(() => {
    const extractColors = async () => {
      if (extractedColors) return

      const updatedCards = [...cards]
      const colorThief = new ColorThief()

      for (let i = 0; i < updatedCards.length; i++) {
        const card = updatedCards[i]
        try {
          const img = new Image()
          img.crossOrigin = "Anonymous"
          img.src = card.imageUrl

          await new Promise((resolve) => {
            img.onload = () => {
              try {
                const palette = colorThief.getPalette(img, 3)

                // Convert RGB to hex and create color scheme
                const primaryColor = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`
                const secondaryColor = `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`
                const shadowColor = `rgba(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]}, 0.6)`

                // Determine if text should be white or black based on primary color brightness
                const brightness = (palette[0][0] * 299 + palette[0][1] * 587 + palette[0][2] * 114) / 1000
                const textColor = brightness < 128 ? "#ffffff" : "#000000"

                updatedCards[i].colors = {
                  primary: primaryColor,
                  secondary: secondaryColor,
                  text: textColor,
                  shadow: shadowColor,
                }
              } catch (error) {
                console.error("Error extracting colors:", error)
              }
              resolve(null)
            }
          })
        } catch (error) {
          console.error("Error loading image:", error)
        }
      }

      setCards(updatedCards)
      setExtractedColors(true)
      setLoading(false)
    }

    extractColors()
  }, [cards, extractedColors])

  const removeCard = (id: number) => {
    setCards((prevCards) => {
      const newCards = prevCards.filter((card) => card.id !== id)
      const maxId = Math.max(...prevCards.map((card) => card.id))

      const newCard = {
        ...prevCards[0],
        id: maxId + 1,
        title: `NEW PROPERTY ${maxId + 1}`,
        description: "A newly discovered property with unique features and amenities.",
        imageUrl: prevCards[maxId % prevCards.length].imageUrl,
        icon: ["bed", "users", "dollar", "arrowUpRight"][Math.floor(Math.random() * 4)] as string,
        colors: prevCards[0].colors,
      }

      return [...newCards, newCard]
    })
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "bed":
        return <Bed className="h-5 w-5" />
      case "users":
        return <Users className="h-5 w-5" />
      case "dollar":
        return <DollarSign className="h-5 w-5" />
      case "arrowUpRight":
      default:
        return <ArrowUpRight className="h-5 w-5" />
    }
  }

  if (loading) {
    return <div className="flex h-96 w-full items-center justify-center">Loading cards...</div>
  }

  return (
    <div className="relative h-[600px] w-full">
      <AnimatePresence mode="popLayout">
        {cards.slice(0, 3).map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            removeCard={removeCard}
            getIconComponent={getIconComponent}
            totalCards={Math.min(cards.length, 3)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

interface CardProps {
  card: CardData
  index: number
  removeCard: (id: number) => void
  getIconComponent: (iconName: string) => JSX.Element
  totalCards: number
}

function Card({ card, index, removeCard, getIconComponent, totalCards }: CardProps) {
  const zIndex = totalCards - index
  const yOffset = index * 30 // Increased vertical offset
  const xOffset = index * 5 // Added horizontal offset

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 100, x: xOffset }}
      animate={{
        opacity: 1,
        y: yOffset,
        x: xOffset,
        scale: 1 - index * 0.04,
        rotateZ: index * -3, // Slight rotation for each card
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 50,
        mass: 1,
      }}
      style={{
        zIndex,
        boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px ${card.colors.shadow}`,
        backgroundColor: card.colors.primary,
      }}
      className="absolute left-0 top-0 h-full w-full cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing"
      drag={index === 0} // Allow drag in all directions for the top card
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (index === 0) {
          const distance = Math.sqrt(Math.pow(info.offset.x, 2) + Math.pow(info.offset.y, 2))
          if (distance > 150) {
            // Adjust this threshold as needed
            removeCard(card.id)
          }
        }
      }}
      whileDrag={{
        scale: 1.05,
        boxShadow: `0 ${15 + index * 5}px ${40 + index * 10}px ${card.colors.shadow}`,
      }}
    >
      <motion.div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl"
        style={{ color: card.colors.text }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between p-4">
          <div className="rounded-full bg-opacity-20 p-2" style={{ backgroundColor: `${card.colors.text}20` }}>
            {getIconComponent(card.icon)}
          </div>
          <div className="rounded-full bg-opacity-20 p-2" style={{ backgroundColor: `${card.colors.text}20` }}>
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        {/* Card Title */}
        <div className="px-4 py-2">
          <h2 className="text-3xl font-bold">{card.title}</h2>
          <h3 className="text-xl font-medium" style={{ color: `${card.colors.text}99` }}>
            {card.subtitle}
          </h3>
        </div>

        {/* Card Image */}
        <div className="mt-2 overflow-hidden px-4">
          <div
            className="aspect-video w-full overflow-hidden rounded-xl bg-cover bg-center"
            style={{
              backgroundImage: `url(${card.imageUrl})`,
              boxShadow: `0 10px 30px ${card.colors.shadow}`,
            }}
          />
        </div>

        {/* Card Footer */}
        <div className="mt-auto p-4">
          <div
            className="rounded-full px-3 py-1 text-sm"
            style={{
              backgroundColor: `${card.colors.text}20`,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <DollarSign className="h-4 w-4" />
            {card.subtitle}
          </div>
          <p className="mt-3 text-sm opacity-80">{card.description}</p>
        </div>

        {/* Drag indicator for the top card */}
        {index === 0 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <motion.div
              className="h-1 w-10 rounded-full"
              style={{ backgroundColor: `${card.colors.text}40` }}
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
