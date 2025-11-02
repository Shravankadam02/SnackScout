/* auth.js
   Simple client-side auth helper using localStorage.
   Storage keys:
     - users  : array of {email, password, displayName, role}
     - currentUser : the logged-in user object (without password when exposed)
   Roles: "user" (default) or "vendor" (if you want to mark stall owners)
*/

(function(window){
  const USERS_KEY = 'snackscout_users_v1';
  const CURRENT_KEY = 'snackscout_currentUser_v1';

  // utility
  function _loadUsers(){
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch(e){ return []; }
  }
  function _saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u || [])); }
  function _setCurrent(user){
    if(user){
      const copy = Object.assign({}, user);
      delete copy.password;
      localStorage.setItem(CURRENT_KEY, JSON.stringify(copy));
    } else {
      localStorage.removeItem(CURRENT_KEY);
    }
    // emit event so other scripts know
    document.dispatchEvent(new CustomEvent('auth-changed', { detail: getCurrentUser() }));
  }

  function getCurrentUser(){
    try { return JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null'); }
    catch(e){ return null; }
  }

  async function signUp({ email, password, displayName = '', role = 'user' }){
    if(!email || !password) throw new Error('Email and password are required');
    const users = _loadUsers();
    if(users.find(u => u.email.toLowerCase() === email.toLowerCase())){
      throw new Error('An account with this email already exists');
    }
    const newUser = { email, password, displayName: displayName || email.split('@')[0], role };
    users.push(newUser);
    _saveUsers(users);
    _setCurrent(newUser);
    return getCurrentUser();
  }

  async function signIn({ email, password }) {
  if (!email || !password) throw new Error('Email and password are required');

  // ✅ Built-in admin login (no signup needed)
  if (email.toLowerCase() === 'admin@snackscout.com' && password === 'admin123') {
    const adminUser = {
      email: 'admin@snackscout.com',
      displayName: 'SnackScout Admin',
      role: 'admin'
    };
    _setCurrent(adminUser);
    return adminUser;
  }

  // 🔹 Normal user/vendor login
  const users = _loadUsers();
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!found) throw new Error('Invalid email or password');

  _setCurrent(found);
  return getCurrentUser();
}


  async function signOut(){
    _setCurrent(null);
    return true;
  }

  // Expose API
  window.SnackAuth = {
    signUp, signIn, signOut, getCurrentUser,
    // small helper: require login, if not logged in redirect to url
    requireLogin: function(redirectTo = 'login.html'){
      const u = getCurrentUser();
      if(!u){
        window.location.href = redirectTo;
        return false;
      }
      return true;
    }
  };

  // init: ensure users array exists (optional: create an admin account if not present)
  (function init(){
    const users = _loadUsers();
    if(!users.length){
      // leave empty so instructor can create admin manually if wanted
      _saveUsers(users);
    }
    // emit initial auth-changed event
    document.dispatchEvent(new CustomEvent('auth-changed', { detail: getCurrentUser() }));
  })();

})(window);
