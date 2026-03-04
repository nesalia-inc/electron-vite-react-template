import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ModeToggle } from '@/components/mode-toggle'

export const Route = createFileRoute('/')({
  component: IndexComponent
})

function IndexComponent(): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Electron Vite React Template</h1>
          <ModeToggle />
        </div>
      </header>
      <main className="container mx-auto p-4">
        <p>{t('welcome')}</p>
      </main>
    </div>
  )
}
