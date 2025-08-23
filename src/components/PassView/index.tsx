import { Button, Divider, ScrollArea, Stack, Text } from '@mantine/core'
import type Pass from '../../utils/Pass'
import { createPassId } from '../../utils/Pass'
import PassItem from '../PassItem'
import { AnimatePresence } from 'motion/react'
import styles from './style.module.css'
import { HEADER_HEIGHT } from '../../utils/constants'
import { usePass } from '../PassProvider'


const PassView = () => {
  const { passList, setPassList } = usePass();

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

  return (
    <Stack p={"md"} bg={"green"} top={HEADER_HEIGHT} h={`calc(100vh - ${HEADER_HEIGHT}px)`} justify='space-between' className={styles.root}>
      <Stack pos={"relative"}>

        <Text c={"white"} size="lg">定期代</Text>
        <Divider color='green.4' />
        <ScrollArea className={styles.passItemListRoot} scrollbars="y">
          <Stack >
            <AnimatePresence>
              {passList.map((pass) => (
                <PassItem key={pass.id} pass={pass} setPass={(pass) => {
                  setPassList((prev) => prev.map(p => p.id === pass.id ? pass : p));
                }}
                  deletePass={() => {
                    if (passList.length <= 1) return;
                    setPassList((prev) => prev.filter(p => p.id !== pass.id));
                  }}
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
  )
}

export default PassView