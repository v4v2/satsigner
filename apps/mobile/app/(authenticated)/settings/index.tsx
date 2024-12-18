import { Image } from 'expo-image'
import { Stack, useRouter } from 'expo-router'
import { ScrollView } from 'react-native'

import SSSettingsCards from '@/components/SSSettingsCard'
import SSText from '@/components/SSText'
import SSVStack from '@/layouts/SSVStack'
import { i18n } from '@/locales'

export default function Settings() {
  const router = useRouter()

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <SSText size="xl">{i18n.t('settings.title')}</SSText>
          ),
          headerRight: undefined
        }}
      />
      <ScrollView>
        <SSVStack gap="none">
          <SSSettingsCards
            title={i18n.t('settings.bitcoinNetwork.title')}
            description={i18n.t('settings.bitcoinNetwork.description')}
            icon={
              <Image
                style={{ width: 24, height: 24 }}
                source={require('@/assets/icons/network.svg')}
              />
            }
            onPress={() => router.navigate('/settings/config/bitcoinNetwork')}
          />
          <SSSettingsCards
            title={i18n.t('settings.appSecurity.title')}
            description={i18n.t('settings.appSecurity.description')}
            icon={
              <Image
                style={{ width: 24, height: 32 }}
                source={require('@/assets/icons/lock.svg')}
              />
            }
            onPress={() => router.navigate('/settings/config/appSecurity')}
          />
          <SSSettingsCards
            title={i18n.t('settings.about.title')}
            description={i18n.t('settings.about.description')}
            icon={
              <Image
                style={{ width: 26, height: 26 }}
                source={require('@/assets/icons/about.svg')}
              />
            }
            onPress={() => router.navigate('/settings/config/about')}
          />
          {__DEV__ && (
            <SSSettingsCards
              title={i18n.t('settings.developer.title')}
              description={i18n.t('settings.developer.description')}
              icon={
                <Image
                  style={{ width: 24, height: 24 }}
                  source={require('@/assets/icons/dev.svg')}
                />
              }
              onPress={() => router.navigate('/settings/config/developer')}
            />
          )}
        </SSVStack>
      </ScrollView>
    </>
  )
}
