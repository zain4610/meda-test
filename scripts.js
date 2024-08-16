document.addEventListener('DOMContentLoaded', function () {
    // Common logic for all pages
    const menuIcon = document.querySelector('.menu-icon');
    if (menuIcon) {
        menuIcon.addEventListener('click', function () {
            alert('Menu clicked! Implement your menu here.');
        });
    }

    // Page-specific logic

    // index.html (Silver Medals Page)
    const h1 = document.querySelector('h1');
    const image = document.querySelector('#coin');
    const COOLDOWN_TIME = 14 * 60 * 1000; // 14 minutes in milliseconds
    let coins = localStorage.getItem('coins');
    let total = localStorage.getItem('total');
    let power = localStorage.getItem('power');
    let count = localStorage.getItem('count');
    let lastClickTime = localStorage.getItem('lastClickTime');

    if (coins == null) {
        localStorage.setItem('coins', '0');
        h1.textContent = '0';
    } else {
        h1.textContent = Number(coins).toLocaleString();
    }

    if (total == null) {
        localStorage.setItem('total', '100');
        document.querySelector('#total').textContent = '/100';
    } else {
        document.querySelector('#total').textContent = `/${total}`;
    }

    if (power == null) {
        localStorage.setItem('power', '100');
        document.querySelector('#power').textContent = '100';
    } else {
        document.querySelector('#power').textContent = power;
    }

    if (count == null) {
        localStorage.setItem('count', '1');
    }

    if (image) {
        image.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
    
            if (lastClickTime == null || currentTime - lastClickTime >= COOLDOWN_TIME) {
                let x = e.offsetX;
                let y = e.offsetY;
    
                navigator.vibrate(5);
    
                coins = localStorage.getItem('coins');
                power = localStorage.getItem('power');
        
                if (Number(power) > 0) {
                    localStorage.setItem('coins', `${Number(coins) + 1}`);
                    h1.textContent = `${(Number(coins) + 1).toLocaleString()}`;
        
                    localStorage.setItem('power', `${Number(power) - 1}`);
                    document.querySelector('#power').textContent = `${Number(power) - 1}`;
                }
    
                if (x < 150 && y < 150) {
                    image.style.transform = 'translate(-0.25rem, -0.25rem) skewY(-10deg) skewX(5deg)';
                } else if (x < 150 && y > 150) {
                    image.style.transform = 'translate(-0.25rem, 0.25rem) skewY(-10deg) skewX(5deg)';
                } else if (x > 150 && y > 150) {
                    image.style.transform = 'translate(0.25rem, 0.25rem) skewY(10deg) skewX(-5deg)';
                } else if (x > 150 && y < 150) {
                    image.style.transform = 'translate(0.25rem, -0.25rem) skewY(10deg) skewX(-5deg)';
                }
    
                setTimeout(() => {
                    image.style.transform = 'translate(0px, 0px)';
                }, 1);
    
                document.querySelector('.progress').style.width = `${(100 * power) / total}%`;

                // Save the current click time
                localStorage.setItem('lastClickTime', currentTime.toString());
            } else {
                alert("You can only click once every 14 minutes!");
            }
        });
    }

    setInterval(() => {
        count = localStorage.getItem('count');
        power = localStorage.getItem('power');
        if (Number(total) > power) {
            localStorage.setItem('power', `${Number(power) + Number(count)}`);
            document.querySelector('#power').textContent = `${Number(power) + Number(count)}`;
            document.querySelector('.progress').style.width = `${(100 * power) / total}%`;
        }
    }, 1000);

    // invite-friends.html (Invite Friends Page)
    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function () {
            const inviteLink = "https://example.com/invite"; // Replace with your actual invite link
            navigator.clipboard.writeText(inviteLink).then(function () {
                alert('Invite link copied to clipboard!');
            }).catch(function (error) {
                alert('Failed to copy link: ' + error);
            });
        });
    }

    // tasks-list.html (Tasks List Page)
    const followButtons = document.querySelectorAll('.follow-btn');
    if (followButtons.length > 0) {
        followButtons.forEach(button => {
            button.addEventListener('click', function () {
                button.textContent = "Following";
                button.disabled = true;
            });
        });
    }

    // balance.html (Balance Page)
    const totalBalanceElement = document.getElementById('total-balance');
    if (totalBalanceElement) {
        let totalMedals = 50; // Example initial value
        totalBalanceElement.textContent = totalMedals;
    }

    // Additional Functionality: Turbo and Charge
    const today = new Date().toISOString().split('T')[0]; // Gets the current date in YYYY-MM-DD format
    let lastClaimDate = localStorage.getItem('lastClaimDate');
    let balanceElement = document.querySelector('#balance');
    coins = Number(localStorage.getItem('coins')) || 0;

    if (balanceElement) {
        balanceElement.textContent = coins.toLocaleString();
    }

    const turbo = document.querySelector('#turbo');
    const charge = document.querySelector('#charge');

    function canClaimReward() {
        return lastClaimDate !== today;
    }

    if (turbo) {
        turbo.addEventListener('click', () => {
            if (canClaimReward()) {
                coins += 60; // Add 60 coins
                localStorage.setItem('coins', coins);
                if (balanceElement) balanceElement.textContent = coins.toLocaleString();
                localStorage.setItem('lastClaimDate', today); // Store today's date as the last claim date

                // Reset after 5 seconds
                localStorage.setItem('count', '0');
                setTimeout(() => {
                    localStorage.setItem('count', '1');
                }, 5000);
            } else {
                alert('You can only claim this reward once a day.');
            }
        });
    }

    if (charge) {
        charge.addEventListener('click', () => {
            if (canClaimReward()) {
                coins += 100; // Add 100 coins
                localStorage.setItem('coins', coins);
                if (balanceElement) balanceElement.textContent = coins.toLocaleString();
                localStorage.setItem('lastClaimDate', today); // Store today's date as the last claim date

                total = localStorage.getItem('total') || 0;
                localStorage.setItem('power', total); // Update 'power' in localStorage
            } else {
                alert('You can only claim this reward once a day.');
            }
        });
    }
});
