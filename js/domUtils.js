// js/domUtils.js
'use strict';

export function getElement(selector) {
    return document.querySelector(selector);
}

export function getElements(selector) {
    return document.querySelectorAll(selector);
}

export function getValue(selector) {
    const el = getElement(selector);
    return el ? el.value : null;
}

export function setValue(selector, value) {
    const el = getElement(selector);
    if (el) {
        el.value = value;
    }
}

export function getText(selector) {
    const el = getElement(selector);
    return el ? el.textContent : null;
}

export function setText(selector, text) {
    const el = getElement(selector);
    if (el) {
        el.textContent = text;
    }
}

export function addClass(selector, className) {
    const el = getElement(selector);
    if (el) {
        el.classList.add(className);
    }
}

export function removeClass(selector, className) {
    const el = getElement(selector);
    if (el) {
        el.classList.remove(className);
    }
}

export function toggleClass(selector, className) {
    const el = getElement(selector);
    if (el) {
        el.classList.toggle(className);
    }
}
