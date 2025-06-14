// js/main.js
'use strict';

import { loadTranslations, toggleLanguage } from './i18n.js';
import { initUiEventListeners } from './ui.js';
import { initInventoryEventListeners } from './inventoryLogic.js';

function initCoreEventListeners() {
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', async () => {
            await toggleLanguage();
        });
    }
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/service-worker.js') // Adjusted path
            .then((registration) => {
                console.log(
                    'ServiceWorker registration successful with scope: ',
                    registration.scope
                );
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed: ', error);
            });
    }
}

async function initializeApp() {
    await loadTranslations();
    initCoreEventListeners();
    initUiEventListeners();
    initInventoryEventListeners(); // Added
    registerServiceWorker(); // Added
    console.log(
        'Application fully initialized with all modules and service worker registration.'
    );
}

document.addEventListener('DOMContentLoaded', initializeApp);
