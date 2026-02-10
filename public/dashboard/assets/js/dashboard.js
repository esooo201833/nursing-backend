// Dashboard JS Actions
document.querySelectorAll('.btn-approve').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = 'Confirmed';
    btn.style.background = '#14b3a2';
  });
});

document.querySelectorAll('.btn-cancel').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = 'Cancelled';
    btn.style.background = '#e74c3c';
  });
});
