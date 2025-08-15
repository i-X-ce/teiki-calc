import { Button, Divider, Stack, Text } from '@mantine/core'
import type Pass from '../../utils/Pass'
import { createPassId } from '../../utils/Pass'
import { useState } from 'react'
import PassItem from '../PassItem'

const INIT_PASS: Pass[] = [
  {
    id: createPassId(0),
    duration: {
      year: 0,
      month: 1,
      day: 0
    },
    price: 1000
  },
  {
    id: createPassId(1),
    duration: {
      year: 0,
      month: 3,
      day: 0
    },
    price: 2500
  },
  {
    id: createPassId(2),
    duration: {
      year: 0,
      month: 6,
      day: 0
    },
    price: 4500
  },
]

const PassView = () => {
  const [passList, setPassList] = useState(INIT_PASS);

  return (
    <Stack >
      <Text c={"white"} size="lg">定期代</Text>

      <Divider color='green.4' />

      <Stack>
        {passList.map((pass) => (
          <PassItem key={pass.id} pass={pass} setPass={(pass) => {
            setPassList((prev) => prev.map(p => p.id === pass.id ? pass : p));
          }} />
        ))}
        <Button variant='outline' color='white'>
          追加+
        </Button>
      </Stack>
    </Stack >
  )
}

export default PassView