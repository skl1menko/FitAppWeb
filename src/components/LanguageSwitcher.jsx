import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.scss';

const LANGUAGES = ['en', 'uk'];

const LanguageSwitcher = ({ className = '', compact = false }) => {
    const { i18n, t } = useTranslation();

    return (
        <div className={`language-switcher ${compact ? 'compact' : ''} ${className}`.trim()} aria-label="Language switcher">
            {LANGUAGES.map((language) => (
                <button
                    key={language}
                    type="button"
                    className={`language-switcher-btn ${i18n.resolvedLanguage === language ? 'active' : ''}`}
                    onClick={() => i18n.changeLanguage(language)}
                >
                    {t(`common.language.${language}`)}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
