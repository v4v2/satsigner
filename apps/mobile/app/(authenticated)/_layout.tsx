import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Redirect, Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import SSIconButton from '@/components/SSIconButton'
import { useAuthStore } from '@/store/auth'
import { Colors } from '@/styles'

export default function AuthenticatedLayout() {
  const router = useRouter()
  const [firstTime, requiresAuth, lockTriggered] = useAuthStore(
    useShallow((state) => [
      state.firstTime,
      state.requiresAuth,
      state.lockTriggered
    ])
  )

  if (firstTime) return <Redirect href="/setPin" />
  if (requiresAuth && lockTriggered) return <Redirect href="/unlock" />

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: Colors.gray[950]
          },
          headerBackground: () => (
            <LinearGradient
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              colors={[Colors.gray[950], Colors.gray[850]]}
              start={{ x: 0.94, y: 1.0 }}
              end={{ x: 0.86, y: -0.64 }}
            />
          ),
          headerRight: () => (
            <SSIconButton onPress={() => router.navigate('/settings/')}>
              <Image
                style={{ width: 18, height: 18 }}
                source={require('@/assets/icons/settings.svg')}
              />
            </SSIconButton>
          ),
          headerTitleAlign: 'center',
          headerTintColor: Colors.gray[200],
          headerBackTitleVisible: false
        }}
      />
      <StatusBar style="light" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[900]
  }
})