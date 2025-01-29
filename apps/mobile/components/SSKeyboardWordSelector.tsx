import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  Keyboard,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle
} from 'react-native'

import { getWordList } from '@/api/bip39'
import useKeyboardHeight from '@/hooks/useKeyboardHeight'
import usePrevious from '@/hooks/usePrevious'
import { i18n } from '@/locales'
import { Colors, Sizes } from '@/styles'

type WordInfo = {
  index: number
  word: string
}

function wordStartMispells(haystack: string, needle: string) {
  let mismatches = 0
  for (let i = 0; i < needle.length; i += 1) {
    // add a penalty which puts weight on misspells close to the word start
    const penalty = (needle.length - i + 1) / 10
    if (haystack.length <= i || needle[i] !== haystack[i])
      mismatches += 1 + penalty
  }
  return mismatches
}

function getMatchingWords(wordStart: string): WordInfo[] {
  const maxMisspells = 2
  let index = 0

  const result = getWordList()
    .map((w) => ({
      index: index++,
      word: w,
      mispells: wordStartMispells(w, wordStart)
    }))
    .filter((w) => w.mispells <= maxMisspells)

  result.sort((a, b) => a.mispells - b.mispells)

  return result.map((w) => ({
    index: w.index,
    word: w.word
  }))
}

type SSKeyboardWordSelectorProps = {
  visible: boolean
  wordStart: string
  onWordSelected(word: string): void
  style: StyleProp<ViewStyle>
}

export default function SSKeyboardWordSelector({
  visible,
  wordStart,
  onWordSelected,
  style
}: SSKeyboardWordSelectorProps) {
  const { width } = useWindowDimensions()
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const flatList = useRef<FlatList>(null)

  const previousWordStart = usePrevious(wordStart)
  const keyboardHeight = useKeyboardHeight()

  const opacityAnimated = useRef(new Animated.Value(0)).current

  const data = getMatchingWords(wordStart)

  if (data.length > 0 && previousWordStart !== wordStart) {
    flatList.current?.scrollToOffset({ animated: false, offset: 0 })
  }

  if (keyboardOpen && visible && data.length > 0) {
    Animated.timing(opacityAnimated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start()
  } else if (!keyboardOpen || !visible) {
    Animated.timing(opacityAnimated, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start()
  }

  const handleKeyboardShown = useCallback(() => {
    setKeyboardOpen(true)
  }, [])

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleKeyboardShown)
  }, [handleKeyboardShown])

  const handleKeyboardHidden = useCallback(() => {
    setKeyboardOpen(false)
  }, [])

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', handleKeyboardHidden)
  }, [handleKeyboardHidden])

  const containerStyle = useMemo(() => {
    let bottomValue = 0
    if (Platform.OS === 'ios') bottomValue = keyboardHeight

    return StyleSheet.compose(
      {
        ...styles.containerBase,
        width,
        bottom: bottomValue,
        opacity: opacityAnimated,
        zIndex: opacityAnimated.interpolate({
          inputRange: [0, 0.0001],
          outputRange: [0, 1]
        }) as unknown as number
      },
      style
    )
  }, [width, opacityAnimated, keyboardHeight, style])

  return (
    <Animated.View style={containerStyle}>
      {data.length > 0 ? (
        <FlatList
          ref={flatList}
          data={data}
          keyboardShouldPersistTaps="handled"
          horizontal
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.index}
              onPress={() => onWordSelected(item.word)}
            >
              <View style={styles.wordContainerBase}>
                <Text style={styles.wordText}>{item.word}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noMatchingWordsContainerBase}>
          <Text style={styles.wordText}>
            {i18n.t('addMasterKey.importExistingSeed.noMatchingWords')}
          </Text>
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  containerBase: {
    position: 'absolute',
    backgroundColor: Colors.white,
    color: Colors.black,
    zIndex: 1
  },
  noMatchingWordsContainerBase: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wordContainerBase: {
    paddingHorizontal: 20,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wordText: {
    fontSize: Sizes.text.fontSize.lg,
    color: Colors.black
  },
  separator: {
    height: '100%',
    backgroundColor: Colors.gray[50],
    width: 1
  }
})
