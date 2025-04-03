document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.querySelector(".dropdown-icon");
    const dropdown = document.querySelector(".dropdown-content");
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    // Dropdown toggle
    menuIcon?.addEventListener("click", () => {
        dropdown.classList.toggle("show");
    });

        // ✅ Close dropdown when clicking a link inside it
    document.querySelectorAll(".dropdown-content a").forEach(link => {
        link.addEventListener("click", () => {
            dropdown.classList.remove("show");
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!menuIcon?.contains(event.target) && !dropdown?.contains(event.target)) {
            dropdown?.classList.remove("show");
        }
    });

    // ✅ Only run if the form exists (on contact.html)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.textContent = "Message sent! ✅";
                    status.style.color = "green";
                    form.reset();
                } else {
                    status.textContent = "Something went wrong. ❌";
                    status.style.color = "red";
                }
            } catch (error) {
                status.textContent = "Network error. Try again later. ❌";
                status.style.color = "red";
            }
        });
    }
});

// ✅ This is safe to keep outside the DOMContentLoaded
if (document.body.classList.contains("home-page")) {
    const images = [
        'images/store3.jpg',
        'images/store1.jpg',
        'images/store12.jpg',
        'images/store15.jpg'
    ];

    let current = 0;
    let showingFirst = true;

    const bg1 = document.createElement('div');
    const bg2 = document.createElement('div');
    bg1.id = 'bg1';
    bg2.id = 'bg2';
    bg1.className = bg2.className = 'background-layer';

    document.body.appendChild(bg1);
    document.body.appendChild(bg2);

    bg1.style.backgroundImage = `url('${images[0]}')`;
    bg2.style.backgroundImage = `url('${images[1]}')`;

    function crossfade() {
        const nextIndex = (current + 1) % images.length;

        if (showingFirst) {
            bg2.style.backgroundImage = `url('${images[nextIndex]}')`;
            bg2.style.opacity = '1';
            bg1.style.opacity = '0';
        } else {
            bg1.style.backgroundImage = `url('${images[nextIndex]}')`;
            bg1.style.opacity = '1';
            bg2.style.opacity = '0';
        }

        current = nextIndex;
        showingFirst = !showingFirst;
    }

    setInterval(crossfade, 6000);
}

