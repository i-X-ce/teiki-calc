import { Box, Group, Input, InputWrapper, Text } from '@mantine/core'

function CalendarView() {
    return (
        <Box p={"md"} flex={1}>
            <Group>
                <InputWrapper label="開始日" >
                    <Input type='date' />
                </InputWrapper>
                <Text>~</Text>
                <InputWrapper label="終了日" >
                    <Input type='date' />
                </InputWrapper>
            </Group>
        </Box>
    )
}

export default CalendarView