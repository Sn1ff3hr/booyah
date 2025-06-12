// js/i18n.js
'use strict';

let currentLang = navigator.language.startsWith('es') ? 'es' : 'en';
let translations = {};

async function fetchTranslations(lang) {
    try {
        const response = await fetch(`../locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${lang}.json`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        // Fallback to English if selected language fails to load
        if (lang !== 'en') {
            return await fetchTranslations('en');
        }
        return {}; // Return empty if English also fails
    }
}

export async function loadTranslations() {
    translations = await fetchTranslations(currentLang);
    translatePage();
}

export function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });
    updateLangButton();
}

function updateLangButton() {
    const btn = document.getElementById('lang-toggle');
    if (btn) {
        btn.textContent = currentLang.toUpperCase();
    }
}

export async function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    await loadTranslations(); // Reload translations for the new language
}

export function getCurrentLang() {
    return currentLang;
}
