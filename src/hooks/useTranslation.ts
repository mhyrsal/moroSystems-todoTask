import { useAppSelector } from '@store/hooks';
import { translations, TranslationKey } from '@utils/translations';

export const useTranslation = () => {
    const language = useAppSelector((state) => state.ui.language);

    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations.en[key];
    };

    return { t, language };
};
