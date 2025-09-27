'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface AnimatedContactCardProps {
  className?: string
}

type Step = 'initial' | 'message' | 'email' | 'success'

export function AnimatedContactCard({ className = '' }: AnimatedContactCardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('initial')
  const [isHovered, setIsHovered] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInitialClick = () => {
    setCurrentStep('message')
  }

  const handleMessageSubmit = async () => {
    if (!message.trim()) return
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoading(false)
    setCurrentStep('email')
  }

  const handleEmailSubmit = async () => {
    if (!email.trim()) return
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setCurrentStep('success')
  }

  const resetCard = () => {
    setCurrentStep('initial')
    setMessage('')
    setEmail('')
    setIsHovered(false)
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative w-80 h-96 rounded-3xl overflow-hidden cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)'
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => currentStep === 'initial' && setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Profile Avatar */}
        <div className="absolute top-8 left-8">
          <motion.div
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20"
            animate={{ 
              scale: currentStep !== 'initial' ? 0.8 : 1,
              opacity: currentStep === 'success' ? 0.5 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" fill="hsl(var(--muted))" />
              <circle cx="32" cy="24" r="8" fill="hsl(var(--muted-foreground))" />
              <path d="M16 56c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="hsl(var(--muted-foreground))" />
            </svg>
          </motion.div>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 p-8 flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            {currentStep === 'initial' && (
              <motion.div
                key="initial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center text-white"
              >
                <motion.div
                  className="mb-6"
                  animate={{ 
                    y: isHovered ? -10 : 0,
                    scale: isHovered ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Mail className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">¿Necesitas ayuda?</h3>
                  <p className="text-white/80 text-sm">
                    Haz clic para enviarnos un mensaje
                  </p>
                </motion.div>
                
                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={handleInitialClick}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                  >
                    Contactar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {currentStep === 'message' && (
              <motion.div
                key="message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full text-white"
              >
                <h3 className="text-lg font-semibold mb-4 text-center">
                  ¿En qué podemos ayudarte?
                </h3>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Escribe tu mensaje aquí..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm resize-none"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentStep('initial')}
                      variant="outline"
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Volver
                    </Button>
                    <Button
                      onClick={handleMessageSubmit}
                      disabled={!message.trim() || isLoading}
                      className="flex-1 bg-white text-primary hover:bg-white/90"
                    >
                      {isLoading ? 'Enviando...' : 'Siguiente'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full text-white"
              >
                <h3 className="text-lg font-semibold mb-4 text-center">
                  ¿Cuál es tu email?
                </h3>
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentStep('message')}
                      variant="outline"
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Volver
                    </Button>
                    <Button
                      onClick={handleEmailSubmit}
                      disabled={!email.trim() || isLoading}
                      className="flex-1 bg-white text-primary hover:bg-white/90"
                    >
                      {isLoading ? 'Enviando...' : 'Enviar'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center text-white"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-2">¡Mensaje enviado!</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Nos comunicaremos pronto contigo y te responderemos hasta entonces
                </p>
                
                <Button
                  onClick={resetCard}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                >
                  Enviar otro mensaje
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <motion.div
            className="w-2 h-2 bg-white/30 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="absolute bottom-4 left-4">
          <motion.div
            className="w-1 h-1 bg-white/20 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}