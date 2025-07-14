'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';

export function useUsuarioAutenticado(tipoEsperado: string) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {

      if (res.data.user.tipo !== tipoEsperado) {
        router.push('/acesso-negado');
      } else {
        setUsuario(res.data);
      }
    })
    .catch(() => {
      router.push('/login');
    })
    .finally(() => setCarregando(false));
  }, [tipoEsperado, router]);

  return { usuario, carregando };
}
