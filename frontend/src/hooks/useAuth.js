// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Vérifier les informations supplémentaires du médecin dans Firestore
        const userDoc = await getDoc(doc(db, 'doctors', user.uid));
        if (userDoc.exists()) {
          setUser({ ...user, ...userDoc.data() });
        } else {
          // Si l'utilisateur n'a pas de profil médecin, le déconnecter
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'doctors', result.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error("Ce compte n'est pas associé à un numéro de médecin valide");
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => signOut(auth);

  return { user, loading, error, login, logout };
};