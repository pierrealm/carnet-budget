/*
  Carnet : comptes et synchronisation avec Supabase, sans bibliothèque externe.
  - Authentification : API Supabase Auth (inscription, connexion, mot de passe oublié).
  - Données : une ligne par utilisateur dans la table `budgets` (colonne `data` en JSON),
    protégée par RLS : chacun ne peut lire et écrire que sa propre ligne.
*/
(function () {
  const cfg = window.CARNET_CONFIG || {};
  const URL_ = (cfg.supabaseUrl || '').replace(/\/$/, '');
  const KEY = cfg.supabaseAnonKey || '';
  const SESSION_KEY = 'carnet-session';
  const configured = /^https:\/\/.+\.supabase\.co$/.test(URL_) && KEY && !KEY.startsWith('VOTRE');

  let session = null;
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { session = null; }
  const listeners = new Set();
  let status = 'idle'; // idle | saving | saved | offline | error
  const setStatus = s => { status = s; listeners.forEach(f => f(s)); };

  function storeSession(s) {
    session = s ? {
      access_token: s.access_token,
      refresh_token: s.refresh_token,
      expires_at: s.expires_at || (Math.floor(Date.now() / 1000) + (s.expires_in || 3600)),
      user: { id: s.user.id, email: s.user.email }
    } : null;
    try { session ? localStorage.setItem(SESSION_KEY, JSON.stringify(session)) : localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  // Traduit les erreurs de Supabase en messages compréhensibles
  function frenchError(body, httpStatus) {
    const raw = ((body && (body.error_description || body.msg || body.message || body.error)) || '').toLowerCase();
    if (raw.includes('invalid login')) return 'Email ou mot de passe incorrect.';
    if (raw.includes('email not confirmed')) return "Ton email n'est pas encore confirmé. Clique sur le lien reçu par email.";
    if (raw.includes('already registered') || raw.includes('already exists')) return 'Un compte existe déjà avec cet email. Connecte-toi.';
    if (raw.includes('password') && (raw.includes('6') || raw.includes('weak') || raw.includes('short'))) return 'Mot de passe trop faible : 8 caractères minimum.';
    if (raw.includes('rate limit') || httpStatus === 429) return 'Trop de tentatives. Réessaie dans quelques minutes.';
    if (raw.includes('invalid') && raw.includes('email')) return "Cette adresse email n'est pas valide.";
    return "Quelque chose n'a pas marché. Vérifie ta connexion et réessaie.";
  }

  async function authCall(path, body, token) {
    const res = await fetch(URL_ + '/auth/v1/' + path, {
      method: path === 'user' ? 'PUT' : 'POST',
      headers: Object.assign({ apikey: KEY, 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
      body: JSON.stringify(body || {})
    });
    let json = null; try { json = await res.json(); } catch (e) {}
    if (!res.ok) throw new Error(frenchError(json, res.status));
    return json;
  }

  async function refresh() {
    if (!session) return null;
    try {
      const s = await authCall('token?grant_type=refresh_token', { refresh_token: session.refresh_token });
      storeSession(s);
      return session;
    } catch (e) {
      if (!navigator.onLine) return session;
      storeSession(null);
      return null;
    }
  }

  async function validToken() {
    if (!session) return null;
    if (session.expires_at - 60 < Date.now() / 1000) await refresh();
    return session && session.access_token;
  }

  async function rest(path, opts) {
    const token = await validToken();
    if (!token) throw new Error('Session expirée, reconnecte-toi.');
    const res = await fetch(URL_ + '/rest/v1/' + path, Object.assign({}, opts, {
      headers: Object.assign({ apikey: KEY, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, (opts && opts.headers) || {})
    }));
    if (!res.ok) throw new Error('Erreur serveur (' + res.status + ')');
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  // Lit le lien reçu par email (confirmation d'inscription ou mot de passe oublié)
  function readHash() {
    if (!location.hash || location.hash.indexOf('access_token=') === -1) {
      if (location.hash.indexOf('error_description=') !== -1) {
        const p = new URLSearchParams(location.hash.slice(1));
        history.replaceState(null, '', location.pathname);
        return { error: 'Le lien a expiré ou a déjà servi. Redemande un email.' + (p.get('error_description') ? '' : '') };
      }
      return null;
    }
    const p = new URLSearchParams(location.hash.slice(1));
    history.replaceState(null, '', location.pathname);
    return { access_token: p.get('access_token'), refresh_token: p.get('refresh_token'), expires_in: +p.get('expires_in') || 3600, type: p.get('type') };
  }

  let pushTimer = null, pending = null;

  window.Cloud = {
    configured,
    get user() { return session && session.user; },
    get status() { return status; },
    onStatus(f) { listeners.add(f); },

    async boot() {
      if (!configured) return { user: null };
      const h = readHash();
      if (h && h.error) return { user: null, error: h.error };
      if (h && h.access_token) {
        const user = await fetch(URL_ + '/auth/v1/user', { headers: { apikey: KEY, Authorization: 'Bearer ' + h.access_token } }).then(r => r.ok ? r.json() : null).catch(() => null);
        if (user) storeSession(Object.assign({}, h, { user }));
        return { user: this.user, recovery: h.type === 'recovery' };
      }
      if (session) await validToken();
      return { user: this.user };
    },

    async signUp(email, password) {
      const redirect = location.origin + location.pathname;
      const res = await authCall('signup?redirect_to=' + encodeURIComponent(redirect), { email, password, data: { cgu_accepted_at: new Date().toISOString() } });
      if (res && res.access_token) { storeSession(res); return { user: this.user }; }
      return { needsConfirmation: true };
    },
    async signIn(email, password) {
      const res = await authCall('token?grant_type=password', { email, password });
      storeSession(res); return { user: this.user };
    },
    async resetPassword(email) {
      await authCall('recover?redirect_to=' + encodeURIComponent(location.origin + location.pathname), { email });
    },
    async updatePassword(password) {
      await authCall('user', { password }, await validToken());
    },
    async signOut() {
      const token = session && session.access_token;
      storeSession(null);
      if (token) { try { await authCall('logout', {}, token); } catch (e) {} }
    },

    async pull() {
      const rows = await rest('budgets?select=data,updated_at&user_id=eq.' + session.user.id);
      return rows && rows[0] ? rows[0].data : null;
    },
    push(data) {
      if (!session) return;
      pending = data;
      setStatus('saving');
      clearTimeout(pushTimer);
      pushTimer = setTimeout(async () => {
        const body = JSON.stringify({ user_id: session.user.id, data: pending, updated_at: new Date().toISOString() });
        try {
          await rest('budgets?on_conflict=user_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body });
          setStatus('saved');
        } catch (e) {
          setStatus(navigator.onLine ? 'error' : 'offline');
        }
      }, 800);
    },
    async deleteAccount() {
      await rest('rpc/delete_my_account', { method: 'POST', body: '{}' });
      storeSession(null);
    }
  };

  // Renvoie les données en attente dès que le réseau revient
  window.addEventListener('online', () => { if (pending && session) window.Cloud.push(pending); });
})();
