import { AppShell, Flex, Text, Title } from '@mantine/core'
import './App.css'
import PassView from './components/PassView'
import CalendarView from './components/CalendarView'
import { HEADER_HEIGHT } from './utils/constants'
import PassProvider from './components/PassProvider'

function App() {

  return (
    <>
      <AppShell
        header={{ height: HEADER_HEIGHT }}
        aside={{ width: "max-content", breakpoint: 'sm' }}
      >
        <AppShell.Header p={"md"}>
          <Title order={3}>Teiki Calc</Title>
        </AppShell.Header>
        <AppShell.Main>
          <Flex mih={`calc(100vh - ${HEADER_HEIGHT}px)`}>
            <PassProvider>
              <CalendarView />
              <PassView />
            </PassProvider>
          </Flex>
        </AppShell.Main>
      </AppShell>
    </>
  )
}

export default App
