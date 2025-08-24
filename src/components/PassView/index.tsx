import { Button, Divider, Group, ScrollArea, Stack, Text } from '@mantine/core'
import type Pass from '../../utils/Pass'
import { createPassId } from '../../utils/Pass'
import PassItem from '../PassItem'
import { AnimatePresence } from 'motion/react'
import styles from './style.module.css'
import { HEADER_HEIGHT } from '../../utils/constants'
import { usePass } from '../PassProvider'
import { useErrorModal } from '../ErrorModal'
import { useState } from 'react'
import { IoCard } from 'react-icons/io5'
import { IoMdClose } from 'react-icons/io'


const PassView = () => {
  const { passList, setPassList } = usePass();
  const { openError } = useErrorModal();
  const [open, setOpen] = useState(true);

  const handleAddPass = () => {
    const newPass: Pass = {
      id: createPassId(`${Date.now().toString()}_${passList.length}`),
      duration: {
        years: 0,
        months: 1,
        days: 0
      },
      price: 1000,
      isReturnTicket: false
    }
    setPassList((prev) => [...prev, newPass]);
  }

  const handleSetPass = (pass: Pass) => {
    const newPassList = passList.map(p => p.id === pass.id ? pass : p);
    if (!has1DayPass(newPassList)) {
      openNotHas1DayPass();
      return;
    }
    setPassList((prev) => prev.map(p => p.id === pass.id ? pass : p));
  }

  const handleDeletePass = (pass: Pass) => {
    if (passList.length <= 1) {
      openError({ variants: "warning", title: "消せません！", content: "定期は最低1つ必要です" });
      return;
    }

    // 削除予定のパスを除いた新しいリストを事前に作成
    const newList = passList.filter(p => p.id !== pass.id);

    // 1日定期があるかチェック
    if (!has1DayPass(newList)) {
      openNotHas1DayPass();
      return;
    }

    // 問題なければ削除実行
    setPassList(newList);
  }

  const has1DayPass = (updatePassList: Pass[]) => {
    return updatePassList.some(p => p.duration.days === 1 && p.duration.months === 0 && p.duration.years === 0);
  }

  const openNotHas1DayPass = () => {
    openError({ variants: "warning", title: "注意！", content: "1日定期が無いと、計算結果が正しくない場合があります。" });
  }

  return (
    open ?
      <Stack p={"md"} bg={"green"} top={HEADER_HEIGHT} h={`calc(100vh - ${HEADER_HEIGHT}px)`} justify='space-between' className={styles.root}
        display={open ? undefined : "none"}
      >
        <Stack pos={"relative"}>

          <Group justify='space-between'>
            <Text c={"white"} size="lg">定期代</Text>
            <Button p={10} onClick={() => setOpen(!open)}>
              <IoMdClose size={"1.2rem"} />
            </Button>
          </Group>
          <Divider color='green.4' />
          <ScrollArea className={styles.passItemListRoot} scrollbars="y">
            <Stack >
              <AnimatePresence>
                {passList.map((pass) => (
                  <PassItem key={pass.id} pass={pass}
                    setPass={handleSetPass}
                    deletePass={handleDeletePass}
                  />
                ))}
              </AnimatePresence>
            </Stack>
          </ScrollArea>
        </Stack>

        <div className={styles.addButtonRoot}>
          <Button variant='outline' color='white' flex={1}
            onClick={handleAddPass}
          >
            追加+
          </Button>
        </div>


      </Stack >
      :
      <Button
        variant="outline"
        pos={"fixed"}
        top={HEADER_HEIGHT + 10}
        right={10}
        bg={"white"}
        onClick={() => setOpen(!open)}
      >
        <IoCard />
      </Button>
  )
}

export default PassView