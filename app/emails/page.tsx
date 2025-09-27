import { EmailViewer } from '@/components/email-viewer'

export default function EmailsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      <div className="container mx-auto py-8">
        <EmailViewer />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Emails Guardados - Directorio SENA',
  description: 'Visualiza los emails enviados desde el formulario de contacto (simulación local)',
}