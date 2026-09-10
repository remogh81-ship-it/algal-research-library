import { FormEvent, useState } from 'react';
import { useAuth } from '../auth';

export function AuthModal({ onClose }: { onClose: () => void }) {
  const { login, register } = useAuth();
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = registering ? register(name, email, password) : login(email, password);
    if (result) setError(result); else onClose();
  };
  return <div className="modal-backdrop" onClick={onClose}><section className="modal auth-modal" onClick={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
    <span className="eyebrow">ACADEMIC PORTAL</span><h2>{registering ? 'Create your account' : 'Welcome back'}</h2>
    <div className="auth-tabs"><button className={!registering ? 'active' : ''} onClick={() => setRegistering(false)}>Login</button><button className={registering ? 'active' : ''} onClick={() => setRegistering(true)}>Register</button></div>
    <form onSubmit={submit}>{registering && <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} required /></label>}<label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required /></label>{error && <p className="error">{error}</p>}<button type="submit" className="primary-action">{registering ? 'Create account' : 'Login'}</button></form>
  </section></div>;
}
