/**
 * Chase Cole Portfolio - Interactive Features
 * Minimal JavaScript for collapsible project descriptions and keyboard navigation
 */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Portfolio Loaded");

    // Initialize collapsible project descriptions
    initializeCollapsibleProjects();

    // Add keyboard navigation support
    addKeyboardNavigation();

    // Fetch and update GitHub repository data
    fetchGitHubRepoData();
});

/**
 * Initialize collapsible functionality for project descriptions
 */
function initializeCollapsibleProjects() {
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleProjectDescription(this);
        });
        
        // Support keyboard interaction (Enter and Space)
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleProjectDescription(this);
            }
        });
    });
}

/**
 * Toggle the visibility of a project description
 * @param {HTMLElement} button - The expand/collapse button
 */
function toggleProjectDescription(button) {
    const projectItem = button.closest('.project-item');
    const description = projectItem.querySelector('.project-description');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    // Toggle aria-expanded attribute
    button.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle the description visibility
    if (isExpanded) {
        // Collapse
        description.classList.remove('expanded');
        description.setAttribute('hidden', '');
    } else {
        // Expand
        description.classList.add('expanded');
        description.removeAttribute('hidden');
    }
}

/**
 * Add keyboard navigation support for better accessibility
 */
function addKeyboardNavigation() {
    // Add visible focus indicators for keyboard users
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove focus indicators when using mouse
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Support Escape key to collapse all descriptions
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            collapseAllDescriptions();
        }
    });
}

/**
 * Collapse all open project descriptions
 */
function collapseAllDescriptions() {
    const expandButtons = document.querySelectorAll('.expand-btn[aria-expanded="true"]');
    expandButtons.forEach(button => {
        toggleProjectDescription(button);
    });
}

/**
 * Fetch GitHub repository data and update last updated timestamps
 */
async function fetchGitHubRepoData() {
    const projectItems = document.querySelectorAll('.project-item[data-repo]');

    projectItems.forEach(async (projectItem) => {
        const repo = projectItem.getAttribute('data-repo');
        const lastUpdatedElement = projectItem.querySelector('.last-updated');

        if (!repo || !lastUpdatedElement) return;

        try {
            const response = await fetch(`https://api.github.com/repos/${repo}`);

            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}`);
            }

            const data = await response.json();
            const lastPushDate = new Date(data.pushed_at);
            const relativeTime = getRelativeTime(lastPushDate);

            lastUpdatedElement.textContent = `Updated ${relativeTime}`;
        } catch (error) {
            console.error(`Failed to fetch data for ${repo}:`, error);
            lastUpdatedElement.textContent = 'Recently updated';
        }
    });
}

/**
 * Convert a date to relative time string (e.g., "2 days ago")
 * @param {Date} date - The date to convert
 * @returns {string} Relative time string
 */
function getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);

        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }

    return 'just now';
}
