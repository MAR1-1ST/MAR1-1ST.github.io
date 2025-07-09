document.addEventListener('DOMContentLoaded', () => {
    // --- THEME SWITCHER ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme on load
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    // Theme switcher event listener
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
            // Add a small delay for chart recoloring if charts are present
            if (typeof updateAllChartsTheme === 'function') {
                setTimeout(updateAllChartsTheme, 10);
            }
        });
    }

    // --- SIDEBAR TOGGLE FOR MOBILE ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // --- ACTIVE NAVIGATION LINK ---
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('.nav-item');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

});

// Function to get theme-based colors for charts
function getChartColors() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    if (theme === 'dark') {
        return {
            textColor: '#d1d5db',
            gridColor: 'rgba(255, 255, 255, 0.1)',
            primary: '#4f46e5',
            secondary: '#34d399',
            tertiary: '#fbbf24',
        };
    } else {
        return {
            textColor: '#374151',
            gridColor: 'rgba(0, 0, 0, 0.1)',
            primary: '#4f46e5',
            secondary: '#34d399',
            tertiary: '#fbbf24',
        };
    }
}