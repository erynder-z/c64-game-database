// Navbar toggle
document.addEventListener('DOMContentLoaded', function () {
  const elems = document.querySelectorAll('.sidenav');
  const instances = M.Sidenav.init(elems, {});
});

// Fab
document.addEventListener('DOMContentLoaded', function () {
  const elems = document.querySelectorAll('.fixed-action-btn');
  const instances = M.FloatingActionButton.init(elems, {
    toolbarEnabled: true,
  });
});

// Form dropdown
document.addEventListener('DOMContentLoaded', function () {
  const elems = document.querySelectorAll('select');
  const instances = M.FormSelect.init(elems, {});
});

// Back button
document.addEventListener('DOMContentLoaded', function () {
  const backBtn = document.getElementById('go-back');
  backBtn?.addEventListener('click', () => {
    history.back();
  });
});
