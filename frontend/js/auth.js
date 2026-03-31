// ── AUTH LOGIC ──
let authMode = 'login';
let selectedRole = 'candidate';

function toggleAuth(mode) {
  authMode = mode;
  document.getElementById('authTitle').textContent = mode === 'login' ? 'Welcome back' : 'Join NextHire AI';
  document.getElementById('authSub').textContent = mode === 'login' ? 'Sign in to your account' : 'Create your account in seconds';
  document.getElementById('authBtn').textContent = mode === 'login' ? 'Sign In' : 'Create Account';
  document.getElementById('authToggle').innerHTML = mode === 'login'
    ? `Don't have an account? <a href="#" onclick="toggleAuth('signup')" class="text-accent">Sign up</a>`
    : `Already have an account? <a href="#" onclick="toggleAuth('login')" class="text-accent">Sign in</a>`;
  document.getElementById('roleSelector').style.display = mode === 'signup' ? 'grid' : 'none';
  document.getElementById('nameGroup').style.display = mode === 'signup' ? 'block' : 'none';
  document.getElementById('companyGroup').style.display = 'none';
}

function selectRole(role) {
  selectedRole = role;
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-role="${role}"]`).classList.add('active');
  document.getElementById('companyGroup').style.display = role === 'recruiter' ? 'block' : 'none';
}

async function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;

  try {
    let data;
    if (authMode === 'login') {
      data = await post('/auth/login', { email, password });
    } else {
      const name = document.getElementById('authName').value;
      const company = document.getElementById('authCompany')?.value;
      data = await post('/auth/register', { name, email, password, role: selectedRole, ...(company ? { company } : {}) });
    }
    store.set('token', data.token);
    store.set('user', data.user);
    state.token = data.token;
    state.user = data.user;
    toast(`Welcome, ${data.user.name}! 🎉`, 'success');
    showApp();
  } catch (err) {
    toast(err.message, 'error');
  }
}