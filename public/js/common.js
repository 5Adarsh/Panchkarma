// ===============================
// TOAST / NOTIFICATION SYSTEM
// ===============================

// Create / reuse container per position
function getNotificationContainer(position = 'top-right') {
  const id = `pk-toast-container-${position}`;
  let container = document.getElementById(id);

  if (!container) {
    container = document.createElement('div');
    container.id = id;
    container.style.position = 'fixed';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.pointerEvents = 'none'; // allow clicks through empty areas

    if (position.includes('top')) container.style.top = '16px';
    if (position.includes('bottom')) container.style.bottom = '16px';
    if (position.includes('right')) container.style.right = '16px';
    if (position.includes('left')) container.style.left = '16px';

    document.body.appendChild(container);
  }
  return container;
}

// 🌙 DARK THEME TOAST
function showNotification(message, type = 'info', options = {}) {
  const {
    duration = 4000,
    closable = true,
    position = 'top-right', // 'top-left', 'bottom-right', 'bottom-left'
    withProgress = true
  } = options;

  const container = getNotificationContainer(position);
  const notification = document.createElement('div');

  const iconMap = {
    success: '✅',
    error: '⛔',
    danger: '⛔',
    warning: '⚠️',
    info: 'ℹ️'
  };
  const normalizedType = type === 'danger' ? 'error' : type;

  // Base dark card styles
  notification.style.position = 'relative';
  notification.style.minWidth = '280px';
  notification.style.maxWidth = '360px';
  notification.style.display = 'flex';
  notification.style.alignItems = 'flex-start';
  notification.style.gap = '10px';
  notification.style.padding = '10px 14px';
  notification.style.borderRadius = '12px';
  notification.style.background = '#020617';
  notification.style.border = '1px solid #111827';
  notification.style.color = '#e5e7eb';
  notification.style.boxShadow = '0 16px 40px rgba(0,0,0,0.7)';
  notification.style.backdropFilter = 'blur(12px)';
  notification.style.opacity = '0';
  notification.style.transform = position.includes('bottom')
    ? 'translateY(8px)'
    : 'translateY(-8px)';
  notification.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  notification.style.pointerEvents = 'auto'; // interactive

  const borderColors = {
    success: '#22c55e',
    error: '#f97373',
    warning: '#facc15',
    info: '#38bdf8'
  };
  notification.style.borderLeft = `3px solid ${
    borderColors[normalizedType] || borderColors.info
  }`;

  // Icon
  const iconSpan = document.createElement('span');
  iconSpan.textContent = iconMap[normalizedType] || 'ℹ️';
  iconSpan.style.marginTop = '2px';

  // Text
  const textSpan = document.createElement('div');
  textSpan.textContent = message;
  textSpan.style.flex = '1';
  textSpan.style.fontSize = '13px';

  notification.appendChild(iconSpan);
  notification.appendChild(textSpan);

  // Close button
  if (closable) {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.border = 'none';
    closeBtn.style.background = 'transparent';
    closeBtn.style.color = '#9ca3af';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '12px';
    closeBtn.style.marginLeft = '4px';
    closeBtn.onmouseenter = () => (closeBtn.style.color = '#e5e7eb');
    closeBtn.onmouseleave = () => (closeBtn.style.color = '#9ca3af');
    closeBtn.onclick = () => hideToast(notification);
    notification.appendChild(closeBtn);
  }

  // Progress bar
  let progressInterval;
  if (withProgress && duration > 0) {
    const progressWrapper = document.createElement('div');
    progressWrapper.style.position = 'absolute';
    progressWrapper.style.left = '0';
    progressWrapper.style.right = '0';
    progressWrapper.style.bottom = '0';
    progressWrapper.style.height = '3px';
    progressWrapper.style.background = '#020617';

    const progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.width = '100%';
    progressBar.style.background =
      borderColors[normalizedType] || borderColors.info;
    progressBar.style.transition = 'width 0.1s linear';

    progressWrapper.appendChild(progressBar);
    notification.appendChild(progressWrapper);

    const steps = duration / 100;
    let elapsed = 0;
    progressInterval = setInterval(() => {
      elapsed += 100;
      const remaining = Math.max(duration - elapsed, 0);
      const widthPercent = (remaining / duration) * 100;
      progressBar.style.width = `${widthPercent}%`;
      if (remaining <= 0) {
        clearInterval(progressInterval);
      }
    }, 100);
  }

  container.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  });

  // Auto dismiss
  if (duration > 0) {
    setTimeout(() => hideToast(notification, progressInterval), duration);
  }

  return notification;
}

function hideToast(notification, progressInterval) {
  if (!notification) return;
  if (progressInterval) clearInterval(progressInterval);
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(-6px)';
  setTimeout(() => {
    if (notification.parentElement) {
      notification.parentElement.removeChild(notification);
    }
  }, 180);
}

// ===============================
// FORM VALIDATION (still works)
// ===============================
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;

  const inputs = form.querySelectorAll('[required]');
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add('error');
      isValid = false;
    } else {
      input.classList.remove('error');
    }
  });

  return isValid;
}

// ======================================
// SMALL HELPERS
// ======================================
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function filterTable(tableId, filterValue) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  rows.forEach((row) => {
    const status = row.querySelector('[data-status]');
    if (!status) {
      row.style.display = 'table-row';
      return;
    }

    if (filterValue === 'ALL' || status.getAttribute('data-status') === filterValue) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  });
}

function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===============================
// DYNAMIC BINDINGS: BUTTONS + SCROLL
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  // Attach validation + toast to all forms
  const forms = document.querySelectorAll('form[id]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const isValid = validateForm(form.id);
      if (!isValid) {
        e.preventDefault();
        showNotification('Please fill in all required fields', 'warning', {
          position: 'top-right'
        });
      }
    });
  });

  // Any button/link with data-toast attribute
  // Example in EJS:
  // <button data-toast="Therapy booked!" data-toast-type="success">Book</button>
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-toast]');
    if (!target) return;

    const msg = target.getAttribute('data-toast') || 'Action completed';
    const type = target.getAttribute('data-toast-type') || 'info';
    const position = target.getAttribute('data-toast-position') || 'top-right';

    showNotification(msg, type, { position });
  });

  // Smooth-scroll anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      if (target !== '#') {
        e.preventDefault();
        smoothScroll(target);
      }
    });
  });

  // Scroll-based toast example: when user reaches 60% scroll
  let scrollToastShown = false;
  window.addEventListener('scroll', () => {
    if (scrollToastShown) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const scrolledPercent = (scrollTop / docHeight) * 100;
    if (scrolledPercent > 60) {
      scrollToastShown = true;
      showNotification('You’ve explored most of the page ✨', 'info', {
        position: 'bottom-right'
      });
    }
  });

  console.log('Panchkarma Clinic UI initialized with dynamic dark toasts ✨');
});

// Convenience filters for appointments or reports
function filterAppointments(status) {
  const url = new URL(window.location);
  url.searchParams.set('status', status);
  window.location.href = url.toString();
}

function changePeriod(period) {
  const url = new URL(window.location);
  url.searchParams.set('period', period);
  window.location.href = url.toString();
}
function toggleClientMenu() {
  const menu = document.getElementById('client-nav-dropdown');
  if (!menu) return;
  menu.classList.toggle('open');
}

// Optional: close when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('client-nav-dropdown');
  const toggle = document.querySelector('.nav-dropdown-toggle');
  if (!menu || !toggle) return;

  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove('open');
  }
});

function toggleClientMenu() {
  const menu = document.getElementById("client-nav-dropdown");
  menu.classList.toggle("open");
}

document.addEventListener("click", (e) => {
  const menu = document.getElementById("client-nav-dropdown");
  const toggle = document.querySelector(".nav-dropdown-toggle");

  if (!menu || !toggle) return;

  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove("open");
  }
});
function toggleTherapistMenu() {
  const menu = document.getElementById("therapist-nav-dropdown");
  menu.classList.toggle("open");
}

document.addEventListener("click", (e) => {
  const menu = document.getElementById("therapist-nav-dropdown");
  const toggle = document.querySelector(".nav-dropdown-toggle");

  if (!menu || !toggle) return;

  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove("open");
  }
});
