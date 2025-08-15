import { AppShell, AppShellAside, Text } from '@mantine/core'
import './App.css'
import PassView from './components/PassView'

function App() {

  return (
    <>
      <AppShell
        header={{ height: 60 }}
      >
        <AppShell.Header p={"md"}>
          <Text size=''>Teiki Calc</Text>
        </AppShell.Header>
        <AppShellAside p={"md"} bg={"green"}>
          <PassView />
        </AppShellAside>
        <AppShell.Main>
          <Text>Main Content</Text>
        </AppShell.Main>
      </AppShell>
    </>
  )
}

export default App
