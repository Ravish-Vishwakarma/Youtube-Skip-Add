chrome.storage.sync.get(['enabled'], (data) => {
    if (data.enabled === false) return;

    function showToast(message = "Skip sequence started") {
        const existing = document.querySelector('#skip-ad-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'skip-ad-toast';
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '48px';
        toast.style.left = '24px';
        toast.style.background = '#323232';
        toast.style.color = 'white';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '4px';
        toast.style.fontSize = '14px';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(toast);
        setTimeout(() => (toast.style.opacity = '1'), 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // The runSequence function stays the same (omitted here for brevity)
    async function runSequence() {
        // ... (your existing runSequence code here)
    }

    function insertSkipButton() {
        const buttonContainer = document.querySelector('#top-level-buttons-computed');
        if (!buttonContainer) return false;
        if (document.querySelector('#skip-ad-button')) return false; // avoid duplicates

        const btn = document.createElement('button');
        btn.id = 'skip-ad-button';

        btn.style.width = '40px';
        btn.style.height = '40px';
        btn.style.borderRadius = '50%';
        btn.style.background = 'rgba(50, 50, 50, 0.6)';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.marginLeft = '8px';
        btn.style.padding = '0';
        btn.style.backdropFilter = 'blur(4px)';

        btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 24 24" fill="white">
        <path d="M6 4l12 8-12 8z"/>
      </svg>
    `;

        btn.addEventListener('click', () => {
            runSequence();
            showToast('Skip sequence started');
        });

        buttonContainer.appendChild(btn);
        return true;
    }

    // Try inserting immediately (in case toolbar is already present)
    insertSkipButton();

    // Watch the page for changes to dynamically add the button
    const observer = new MutationObserver(() => {
        insertSkipButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
