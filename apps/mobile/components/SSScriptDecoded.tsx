import SSVStack from '@/layouts/SSVStack'
import { i18n } from '@/locales'
import { OP_CODE_WORD } from '@/types/logic/opcode'
import SSText from './SSText'
import { getOpcodeDetails, getOpcodeWord } from '@/utils/scripts'
import * as bitcoinjs from 'bitcoinjs-lib'

type SSScriptDecodedProps = {
  script: number[]
}

export default function SSScriptDecoded({ script }: SSScriptDecodedProps) {
  const decodedScript = bitcoinjs.script.toASM(Buffer.from(script))
  return (
    <SSVStack>
      {!decodedScript && (
        <SSText>The script is empty</SSText>
      )}
      {decodedScript && decodedScript.split(' ').map((item, index) => {
        const opcodeWord = getOpcodeWord(item)
        const opcodeDetails = getOpcodeDetails(item)
        return (
          <SSVStack key={index} gap="none">
            {opcodeDetails.word !== OP_CODE_WORD.DATA && (
              <SSText type="mono">
                {opcodeDetails.word}
                (code={opcodeDetails.code} hex={opcodeDetails.hex})
              </SSText>
            )}
            {opcodeDetails.word === OP_CODE_WORD.DATA && (
              <SSText type="mono" uppercase>{item}</SSText>
            )}
            <SSText size="xs">
              <SSText size="xs" weight="bold">
                Description:{' '}
              </SSText>
              {i18n.t(`opcode.${opcodeWord}`)}
            </SSText>
          </SSVStack>
        )
      })}
    </SSVStack>
  )
}
