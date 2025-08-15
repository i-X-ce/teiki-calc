import { AppShell, AppShellAside, Text } from '@mantine/core'
import './App.css'

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
        </AppShellAside>
        <AppShell.Main>
          <Text>Main Content</Text>
        </AppShell.Main>
      </AppShell>
    </>
  )
}

export default App
