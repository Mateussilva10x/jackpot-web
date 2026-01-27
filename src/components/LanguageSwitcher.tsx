import { Globe } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
    const { currentLanguage, changeLanguage } = useLanguage()
    const { t } = useTranslation()

    const toggleLanguage = () => {
        const newLang = currentLanguage === 'pt-BR' ? 'en' : 'pt-BR'
        changeLanguage(newLang)
    }

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
            aria-label={t('language.selectLanguage')}
            title={t('language.selectLanguage')}
        >
            <Globe className="w-4 h-4" />
            <span>{currentLanguage === 'pt-BR' ? 'PT' : 'EN'}</span>
        </button>
    )
}
