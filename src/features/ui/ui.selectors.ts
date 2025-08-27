import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/index';

export const selectUI = (state: RootState) => state.ui;

export const selectTheme = createSelector(selectUI, (ui) => ui.theme);

export const selectLanguage = createSelector(selectUI, (ui) => ui.language);

export const selectIsLoading = createSelector(selectUI, (ui) => ui.isLoading);

export const selectError = createSelector(selectUI, (ui) => ui.error);

export const selectShowCompleted = createSelector(selectUI, (ui) => ui.showCompleted);

export const selectViewMode = createSelector(selectUI, (ui) => ui.viewMode);

export const selectIsDarkMode = createSelector(selectTheme, (theme) => theme === 'dark');

export const selectUISettings = createSelector(selectUI, (ui) => ({
    theme: ui.theme,
    language: ui.language,
    viewMode: ui.viewMode,
    showCompleted: ui.showCompleted,
}));

export const selectNotificationSettings = createSelector(selectUI, (ui) => ({
    soundEnabled: ui.soundEnabled ?? true,
    desktopNotifications: ui.desktopNotifications ?? false,
}));
