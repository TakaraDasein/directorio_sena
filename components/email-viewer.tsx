"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Mail, 
  Calendar, 
  User, 
  FileText, 
  Download, 
  Trash2, 
  RefreshCw,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react'
import { 
  getStoredEmails, 
  getEmailStats, 
  clearStoredEmails, 
  exportEmails,
  type StoredEmail 
} from '@/lib/email-storage'

export function EmailViewer() {
  const [emails, setEmails] = useState<StoredEmail[]>([])
  const [selectedEmail, setSelectedEmail] = useState<StoredEmail | null>(null)
  const [showStats, setShowStats] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load emails on component mount
  useEffect(() => {
    loadEmails()
  }, [])

  const loadEmails = () => {
    setIsLoading(true)
    try {
      const storedEmails = getStoredEmails()
      setEmails(storedEmails)
    } catch (error) {
      console.error('Error loading emails:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadEmails()
  }

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los emails guardados?')) {
      clearStoredEmails()
      setEmails([])
      setSelectedEmail(null)
    }
  }

  const handleExport = () => {
    try {
      const jsonData = exportEmails()
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sena-emails-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting emails:', error)
      alert('Error al exportar los emails')
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    const textContent = content.replace(/<[^>]*>/g, '').trim()
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent
  }

  const stats = getEmailStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-white/70">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Cargando emails...
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">📧 Emails Guardados</h1>
          <p className="text-white/70">Simulación local de envío de emails</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowStats(!showStats)}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {showStats ? <EyeOff className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
            {showStats ? 'Ocultar' : 'Estadísticas'}
          </Button>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {showStats && (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estadísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-white/70">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.today}</div>
              <div className="text-sm text-white/70">Hoy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.thisWeek}</div>
              <div className="text-sm text-white/70">Esta semana</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.byStatus.sent}</div>
              <div className="text-sm text-white/70">Enviados</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleExport}
          disabled={emails.length === 0}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar JSON
        </Button>
        <Button
          onClick={handleClearAll}
          disabled={emails.length === 0}
          variant="outline"
          size="sm"
          className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpiar Todo
        </Button>
      </div>

      {/* Email List */}
      {emails.length === 0 ? (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-white/50 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No hay emails guardados</h3>
            <p className="text-white/70 text-center">
              Los emails enviados desde el formulario de contacto aparecerán aquí.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email List */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Lista de Emails ({emails.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedEmail?.id === email.id
                          ? 'bg-primary/20 border-primary/40'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-white/70" />
                          <span className="text-sm font-medium text-white truncate">
                            {email.to}
                          </span>
                        </div>
                        <Badge 
                          variant={email.status === 'sent' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {email.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-white/50" />
                        <span className="text-xs text-white/70">
                          {formatDate(email.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 line-clamp-2">
                        {truncateContent(email.content)}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                        <span>{email.metadata.textLength} caracteres</span>
                        <span>HTML: {email.metadata.contentLength} bytes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Email Detail */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {selectedEmail ? 'Detalle del Email' : 'Selecciona un Email'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEmail ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white/70">Para:</label>
                    <p className="text-white">{selectedEmail.to}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70">Asunto:</label>
                    <p className="text-white">{selectedEmail.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70">Fecha:</label>
                    <p className="text-white">{formatDate(selectedEmail.timestamp)}</p>
                  </div>
                  <Separator className="bg-white/20" />
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">Contenido:</label>
                    <ScrollArea className="h-[300px] w-full rounded-lg border border-white/20 bg-white/5 p-4">
                      <div 
                        className="text-white/90 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }}
                      />
                    </ScrollArea>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-white/70">Estado:</label>
                      <Badge variant={selectedEmail.status === 'sent' ? 'default' : 'destructive'}>
                        {selectedEmail.status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-white/70">ID:</label>
                      <p className="text-white/90 font-mono text-xs">{selectedEmail.id}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-white/50 mb-4" />
                  <p className="text-white/70 text-center">
                    Selecciona un email de la lista para ver sus detalles
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}