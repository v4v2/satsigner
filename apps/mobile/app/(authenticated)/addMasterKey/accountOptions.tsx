import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { SSIconScriptsP2pkh } from '@/components/icons'
import SSButton from '@/components/SSButton'
import SSCollapsible from '@/components/SSCollapsible'
import SSLink from '@/components/SSLink'
import SSRadioButton from '@/components/SSRadioButton'
import SSSelectModal from '@/components/SSSelectModal'
import SSText from '@/components/SSText'
import SSFormLayout from '@/layouts/SSFormLayout'
import SSMainLayout from '@/layouts/SSMainLayout'
import SSVStack from '@/layouts/SSVStack'
import { t } from '@/locales'
import { useAccountBuilderStore } from '@/store/accountBuilder'
import { type Account } from '@/types/models/Account'
import { setStateWithLayoutAnimation } from '@/utils/animation'

export default function AccountOptions() {
  const router = useRouter()
  const [name, type, setScriptVersion, setSeedWordCount, generateMnemonic] =
    useAccountBuilderStore(
      useShallow((state) => [
        state.name,
        state.type,
        state.setScriptVersion,
        state.setSeedWordCount,
        state.generateMnemonic
      ])
    )

  const [localScriptVersion, setLocalScriptVersion] =
    useState<NonNullable<Account['scriptVersion']>>('P2WPKH')
  const [localSeedWordCount, setLocalSeedWordCount] =
    useState<NonNullable<Account['seedWordCount']>>(24)

  const [scriptVersionModalVisible, setScriptVersionModalVisible] =
    useState(false)
  const [seedWordCountModalVisible, setSeedWordCountModalVisibile] =
    useState(false)

  const [loading, setLoading] = useState(false)

  function getScriptVersionButtonLabel() {
    if (localScriptVersion === 'P2PKH')
      return `${t('script.p2pkh.name')} (P2PKH)`
    else if (localScriptVersion === 'P2SH-P2WPKH')
      return `${t('script.p2sh-p2wpkh.name')} (P2SH-P2WPKH)`
    else if (localScriptVersion === 'P2WPKH')
      return `${t('script.p2wpkh.name')} (P2WPKH)`
    else if (localScriptVersion === 'P2TR')
      return `${t('script.p2tr.name')} (P2TR)`

    return ''
  }

  function getSeedWordCountButtonLabel() {
    if (localSeedWordCount === 12)
      return `12 ${t('bitcoin.words').toLowerCase()}`
    if (localSeedWordCount === 15)
      return `15 ${t('bitcoin.words').toLowerCase()}`
    if (localSeedWordCount === 18)
      return `18 ${t('bitcoin.words').toLowerCase()}`
    if (localSeedWordCount === 21)
      return `21 ${t('bitcoin.words').toLowerCase()}`
    if (localSeedWordCount === 24)
      return `24 ${t('bitcoin.words').toLowerCase()}`

    return ''
  }

  function getContinueButtonLabel() {
    if (type === 'generate') return t('account.generate.title')
    else if (type === 'import') return t('account.import.title')

    return ''
  }

  async function handleOnPressConfirmAccountOptions() {
    setScriptVersion(localScriptVersion)
    setSeedWordCount(localSeedWordCount)

    if (type === 'generate') {
      setLoading(true)
      await generateMnemonic(localSeedWordCount)
      setLoading(false)
      router.navigate('/addMasterKey/generateSeed')
    } else if (type === 'import') router.navigate('/addMasterKey/importSeed')
  }

  function handleOnSelectScriptVersion() {
    setLocalScriptVersion(localScriptVersion)
    setScriptVersionModalVisible(false)
  }

  function handleOnSelectSeedWordCount() {
    setLocalSeedWordCount(localSeedWordCount)
    setSeedWordCountModalVisibile(false)
  }

  return (
    <SSMainLayout>
      <Stack.Screen
        options={{
          headerTitle: () => <SSText uppercase>{name}</SSText>
        }}
      />
      <SSVStack justifyBetween>
        <SSFormLayout>
          <SSFormLayout.Item>
            <SSFormLayout.Label label={t('account.policy.title')} />
            <SSButton label={t('account.policy.singleSignature')} withSelect />
          </SSFormLayout.Item>
          <SSFormLayout.Item>
            <SSFormLayout.Label label={t('account.script')} />
            <SSButton
              label={getScriptVersionButtonLabel()}
              withSelect
              onPress={() => setScriptVersionModalVisible(true)}
            />
          </SSFormLayout.Item>
          <SSFormLayout.Item>
            <SSFormLayout.Label label={t('account.mnemonic.title')} />
            <SSButton
              label={getSeedWordCountButtonLabel()}
              withSelect
              onPress={() => setSeedWordCountModalVisibile(true)}
            />
          </SSFormLayout.Item>
        </SSFormLayout>
        <SSVStack>
          <SSButton
            label={getContinueButtonLabel()}
            variant="secondary"
            loading={loading}
            onPress={() => handleOnPressConfirmAccountOptions()}
          />
          <SSButton
            label={t('common.cancel')}
            variant="ghost"
            onPress={() => router.navigate('/')}
          />
        </SSVStack>
      </SSVStack>
      <SSSelectModal
        visible={scriptVersionModalVisible}
        title={t('account.script')}
        selectedText={`${localScriptVersion} - ${t(
          `script.${localScriptVersion?.toLowerCase()}.name`
        )}`}
        selectedDescription={
          <SSCollapsible>
            <SSText color="muted" size="md">
              {t(`script.${localScriptVersion?.toLowerCase()}.description.1`)}
              <SSLink
                size="md"
                text={t(
                  `script.${localScriptVersion?.toLowerCase()}.link.name`
                )}
                url={t(`script.${localScriptVersion?.toLowerCase()}.link.url`)}
              />
              {t(`script.${localScriptVersion?.toLowerCase()}.description.2`)}
            </SSText>
            <SSIconScriptsP2pkh height={80} width="100%" />
          </SSCollapsible>
        }
        onSelect={() => handleOnSelectScriptVersion()}
        onCancel={() => setScriptVersionModalVisible(false)}
      >
        <SSRadioButton
          label={`${t('script.p2pkh.name')} (P2PKH)`}
          selected={localScriptVersion === 'P2PKH'}
          onPress={() =>
            setStateWithLayoutAnimation(setLocalScriptVersion, 'P2PKH')
          }
        />
        <SSRadioButton
          label={`${t('script.p2sh-p2wpkh.name')} (P2SH-P2WPKH)`}
          selected={localScriptVersion === 'P2SH-P2WPKH'}
          onPress={() =>
            setStateWithLayoutAnimation(setLocalScriptVersion, 'P2SH-P2WPKH')
          }
        />
        <SSRadioButton
          label={`${t('script.p2wpkh.name')} (P2WPKH)`}
          selected={localScriptVersion === 'P2WPKH'}
          onPress={() =>
            setStateWithLayoutAnimation(setLocalScriptVersion, 'P2WPKH')
          }
        />
        <SSRadioButton
          label={`${t('script.p2tr.name')} (P2TR)`}
          selected={localScriptVersion === 'P2TR'}
          onPress={() =>
            setStateWithLayoutAnimation(setLocalScriptVersion, 'P2TR')
          }
        />
      </SSSelectModal>
      <SSSelectModal
        visible={seedWordCountModalVisible}
        title={t('account.mnemonic.title')}
        selectedText={`${localSeedWordCount} ${t('bitcoin.words')}`}
        selectedDescription={t(`account.mnemonic.${localSeedWordCount}`)}
        onSelect={() => handleOnSelectSeedWordCount()}
        onCancel={() => setSeedWordCountModalVisibile(false)}
      >
        <SSRadioButton
          label={`24 ${t('bitcoin.words').toLowerCase()}`}
          selected={localSeedWordCount === 24}
          onPress={() => setStateWithLayoutAnimation(setLocalSeedWordCount, 24)}
        />
        <SSRadioButton
          label={`21 ${t('bitcoin.words').toLowerCase()}`}
          selected={localSeedWordCount === 21}
          onPress={() => setStateWithLayoutAnimation(setLocalSeedWordCount, 21)}
        />
        <SSRadioButton
          label={`18 ${t('bitcoin.words').toLowerCase()}`}
          selected={localSeedWordCount === 18}
          onPress={() => setStateWithLayoutAnimation(setLocalSeedWordCount, 18)}
        />
        <SSRadioButton
          label={`15 ${t('bitcoin.words').toLowerCase()}`}
          selected={localSeedWordCount === 15}
          onPress={() => setStateWithLayoutAnimation(setLocalSeedWordCount, 15)}
        />
        <SSRadioButton
          label={`12 ${t('bitcoin.words').toLowerCase()}`}
          selected={localSeedWordCount === 12}
          onPress={() => setStateWithLayoutAnimation(setLocalSeedWordCount, 12)}
        />
      </SSSelectModal>
    </SSMainLayout>
  )
}
