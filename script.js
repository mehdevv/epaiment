// Current language state
let currentLanguage = 'ar';

// DOM elements
const languageDropdown = document.getElementById('language-dropdown');
const languageDropdownBtn = document.getElementById('language-dropdown-btn');
const languageDropdownMenu = document.getElementById('language-dropdown-menu');
const selectedLanguageSpan = document.querySelector('.selected-language');
const languageOptions = document.querySelectorAll('.language-option');

// Language switcher translations
const languageTexts = {
    ar: "العربية",
    fr: "Français"
};

// Function to update language dropdown display
function updateLanguageDropdown() {
    selectedLanguageSpan.textContent = languageTexts[currentLanguage];
    
    // Update selected state in dropdown
    languageOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-selected', 'false');
        if (option.getAttribute('data-lang') === currentLanguage) {
            option.classList.add('selected');
            option.setAttribute('aria-selected', 'true');
        }
    });
}

// Function to update all translatable elements
function updatePageContent() {
    // Get all elements with data-ar and data-fr attributes
    const translatableElements = document.querySelectorAll('[data-ar][data-fr]');
    
    translatableElements.forEach(element => {
        const arabicText = element.getAttribute('data-ar');
        const frenchText = element.getAttribute('data-fr');
        
        if (currentLanguage === 'ar') {
            element.textContent = arabicText;
        } else {
            element.textContent = frenchText;
        }
    });
    
    // Update page direction and text alignment
    if (currentLanguage === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
        document.body.style.textAlign = 'right';
    } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'fr';
        document.body.style.textAlign = 'left';
    }
}

// Function to switch language
function switchLanguage(newLanguage) {
    if (newLanguage === currentLanguage) return;
    
    console.log('Switching language from', currentLanguage, 'to', newLanguage);
    
    currentLanguage = newLanguage;
    updateLanguageDropdown();
    updatePageContent();
    
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', currentLanguage);
    
    // Close dropdown
    closeDropdown();
    
    console.log('Language switched successfully to', currentLanguage);
}

// Function to toggle dropdown
function toggleDropdown() {
    const isOpen = languageDropdownMenu.classList.contains('show');
    
    if (isOpen) {
        closeDropdown();
    } else {
        openDropdown();
    }
}

// Function to open dropdown
function openDropdown() {
    languageDropdownBtn.classList.add('active');
    languageDropdownMenu.classList.add('show');
}

// Function to close dropdown
function closeDropdown() {
    languageDropdownBtn.classList.remove('active');
    languageDropdownMenu.classList.remove('show');
}

// Function to initialize language
function initializeLanguage() {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'fr')) {
        currentLanguage = savedLanguage;
    }
    
    updateLanguageDropdown();
    updatePageContent();
}

// Function to add smooth transitions
function addTransitions() {
    const style = document.createElement('style');
    style.textContent = `
        .main-title, .subtitle, .button-title, .button-subtitle, .support-text {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Loader functionality
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
}

// Resource loading tracking
let resourcesLoaded = {
    images: 0,
    fonts: false,
    css: false,
    totalImages: 0
};

// Function to check if all critical resources are loaded
function checkAllResourcesLoaded() {
    console.log('Checking resources:', resourcesLoaded);
    
    if (resourcesLoaded.images >= resourcesLoaded.totalImages && 
        resourcesLoaded.fonts && 
        resourcesLoaded.css) {
        console.log('All resources loaded, hiding loader');
        hideLoader();
    }
}

// Function to track image loading
function trackImageLoading() {
    const images = document.querySelectorAll('img');
    resourcesLoaded.totalImages = images.length;
    
    if (images.length === 0) {
        resourcesLoaded.images = 0;
        checkAllResourcesLoaded();
        return;
    }
    
    images.forEach(img => {
        if (img.complete) {
            resourcesLoaded.images++;
            console.log('Image already loaded:', img.src);
        } else {
            img.addEventListener('load', () => {
                resourcesLoaded.images++;
                console.log('Image loaded:', img.src);
                checkAllResourcesLoaded();
            });
            img.addEventListener('error', () => {
                resourcesLoaded.images++;
                console.log('Image failed to load:', img.src);
                checkAllResourcesLoaded();
            });
        }
    });
    
    // Check if all images are already loaded
    if (resourcesLoaded.images === resourcesLoaded.totalImages) {
        checkAllResourcesLoaded();
    }
}

// Function to track font loading
function trackFontLoading() {
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            resourcesLoaded.fonts = true;
            console.log('Fonts loaded');
            checkAllResourcesLoaded();
        });
    } else {
        // Fallback for browsers without Font Loading API
        setTimeout(() => {
            resourcesLoaded.fonts = true;
            console.log('Fonts loaded (fallback)');
            checkAllResourcesLoaded();
        }, 1000);
    }
}

// Function to track CSS loading
function trackCSSLoading() {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    let loadedStylesheets = 0;
    const totalStylesheets = stylesheets.length;
    
    if (totalStylesheets === 0) {
        resourcesLoaded.css = true;
        checkAllResourcesLoaded();
        return;
    }
    
    stylesheets.forEach(link => {
        if (link.sheet) {
            loadedStylesheets++;
        } else {
            link.addEventListener('load', () => {
                loadedStylesheets++;
                if (loadedStylesheets === totalStylesheets) {
                    resourcesLoaded.css = true;
                    console.log('CSS loaded');
                    checkAllResourcesLoaded();
                }
            });
            link.addEventListener('error', () => {
                loadedStylesheets++;
                if (loadedStylesheets === totalStylesheets) {
                    resourcesLoaded.css = true;
                    console.log('CSS loaded (with errors)');
                    checkAllResourcesLoaded();
                }
            });
        }
    });
    
    // Check if all stylesheets are already loaded
    if (loadedStylesheets === totalStylesheets) {
        resourcesLoaded.css = true;
        checkAllResourcesLoaded();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Track all resource loading
    trackImageLoading();
    trackFontLoading();
    trackCSSLoading();
    
    // Fallback timeout (maximum 3 seconds)
    setTimeout(() => {
        console.log('Fallback timeout reached, hiding loader');
        hideLoader();
    }, 3000);
    
    // Initialize language
    initializeLanguage();
    
    // Add dropdown functionality
    if (languageDropdownBtn) {
        // Toggle dropdown on button click
        languageDropdownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
        });
        
        // Handle language option clicks
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const selectedLang = this.getAttribute('data-lang');
                switchLanguage(selectedLang);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!languageDropdown.contains(e.target)) {
                closeDropdown();
            }
        });
        
        // Keyboard support
        languageDropdownBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
            } else if (e.key === 'Escape') {
                closeDropdown();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                openDropdown();
                focusFirstOption();
            }
        });
        
        // Keyboard navigation for dropdown options
        languageDropdownMenu.addEventListener('keydown', function(e) {
            const options = Array.from(languageOptions);
            const currentIndex = options.findIndex(option => option === document.activeElement);
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % options.length;
                    options[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
                    options[prevIndex].focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    const selectedLang = document.activeElement.getAttribute('data-lang');
                    if (selectedLang) {
                        switchLanguage(selectedLang);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeDropdown();
                    languageDropdownBtn.focus();
                    break;
            }
        });
        
        // Function to focus first option
        function focusFirstOption() {
            if (languageOptions.length > 0) {
                languageOptions[0].focus();
            }
        }
        
        console.log('Dropdown event listeners added successfully');
    } else {
        console.error('Language dropdown elements not found!');
    }
    
    // Add transitions
    addTransitions();
}); 