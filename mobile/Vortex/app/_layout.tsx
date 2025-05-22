// app/_layout.tsx
import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';

export default function RootLayout() {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState?.authenticated === false) {
      // если точно разлогинен, кидаем на логин
      router.replace('/login');
    }
  }, [authState, router]);

  // пока authState ещё не известен или мы уже на логине — просто показываем Slot
  return <Slot />;
}
