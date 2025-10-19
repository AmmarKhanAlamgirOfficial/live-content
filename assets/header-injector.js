// A single, smart script that injects the correct header based on the current page.
function renderArchiveHeader(base_path) {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;
    const writerHeaderHTML = `
        <header class="header">
            <div class="header-content">
                <div class="header-left">
                </div>
                <div class="header-center">
                    <a href="${base_path}/" class="logo">
                        <svg class="vector-animation" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
                            <rect x="50" y="50" width="100" height="100" fill="#3498db" class="square"/>
                            <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="tmp-text">TMP</text>
                            <circle cx="100" cy="100" r="80" fill="none" stroke="#3498db" stroke-width="2" class="rotating-circle"/>
                        </svg>
                        <span class="logo-text">The Muslim Post</span>
                    </a>
                </div>
                <div class="header-right">
                </div>
            </div>
        </header>
    `;
    headerPlaceholder.innerHTML = writerHeaderHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    const base_path = document.body.getAttribute('data-base-path') || '';
    renderArchiveHeader(base_path);
});
