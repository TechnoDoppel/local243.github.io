'use strict';

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    const closeButton = document.querySelector('.hamburger-close');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('is-active');
    closeButton.style.display = navLinks.classList.contains('active') ? 'flex' : 'none';
}

// Keep the contact form unavailable until EmailJS has initialized and this
// submission handler has been registered. This prevents the form from falling
// back to an unsafe browser GET submission when JavaScript or EmailJS fails.
const contactForm = document.getElementById('contact-form');
const contactFields = document.getElementById('contact-fields');
const contactSubmit = document.getElementById('contact-submit');
const contactStatus = document.getElementById('contact-status');
let contactFormIsSubmitting = false;

function setContactStatus(message) {
    contactStatus.textContent = message;
}

function enableContactForm() {
    contactFields.disabled = false;
    contactSubmit.disabled = false;
    contactSubmit.textContent = 'Send a message to Local 243';
    setContactStatus('');
}

function disableContactForm(message) {
    contactFields.disabled = true;
    contactSubmit.disabled = true;
    contactSubmit.textContent = 'Contact form unavailable';
    setContactStatus(message);
}

async function handleContactSubmission(event) {
    event.preventDefault();

    if (contactFormIsSubmitting) {
        return;
    }

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    contactFormIsSubmitting = true;
    contactSubmit.disabled = true;
    contactSubmit.textContent = 'Sending…';
    setContactStatus('Sending your message…');

    try {
        await window.emailjs.sendForm(
            'service_dm6vibp',
            'template_08jj35i',
            contactForm
        );

        contactForm.reset();
        setContactStatus('Your message was sent successfully. Thank you.');
    } catch (error) {
        console.error('Contact form submission failed:', error);
        setContactStatus('Your message could not be sent. Please try again or email local243@gmail.com.');
    } finally {
        contactFormIsSubmitting = false;
        contactSubmit.disabled = false;
        contactSubmit.textContent = 'Send a message to Local 243';
    }
}

function initializeContactForm() {
    if (!contactForm || !contactFields || !contactSubmit || !contactStatus) {
        console.error('Contact form initialization failed: required page elements are missing.');
        return;
    }

    if (!window.emailjs || typeof window.emailjs.sendForm !== 'function') {
        disableContactForm('The contact form is temporarily unavailable. Please email local243@gmail.com.');
        return;
    }

    try {
        window.emailjs.init('Y4ZbNfQ9HCDyqlN-3');

        // Register the handler before enabling any form controls.
        contactForm.addEventListener('submit', handleContactSubmission);
        enableContactForm();
    } catch (error) {
        console.error('Email service initialization failed:', error);
        disableContactForm('The contact form is temporarily unavailable. Please email local243@gmail.com.');
    }
}

initializeContactForm();

/*
        async function loadUpdates() {
            try {
                const response = await fetch('./data/updates.json');
                const updates = await response.json();
                const updatesFeed = document.getElementById('updates-feed');
                updatesFeed.innerHTML = '';
                updates.forEach(update => {
                    const article = document.createElement('article');
                    article.classList.add('update');
                    article.innerHTML = `<h3>${update.date}</h3><p>${update.content}</p>`;
                    updatesFeed.appendChild(article);
                });
            } catch (error) {
                console.error('Error loading updates:', error);
            }
        }
*/
