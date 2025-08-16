import { Box, Button, Group, Input, InputWrapper, Stack, Text } from '@mantine/core'
import { addDays, addMonths, format, subDays } from 'date-fns'
import { useState } from 'react'

type StartEndProps = {
    start: Date
    end: Date
}

function CalendarView() {
    // 開始日と終了日
    const [startEndDate, setStartEndDate] = useState<StartEndProps>({
        start: new Date(Date.now()),
        end: new Date(addMonths(Date.now(), 6)) // 6か月後,
    })
    // 定休日
    const [selectedDay, setSelectedDay] = useState<Boolean[]>([true, false, false, false, false, false, true])


    // 開始日と終了日の変更ハンドラー
    const handleStartEndDateChange = (e: React.ChangeEvent<HTMLInputElement>, startEndType: keyof StartEndProps) => {
        const newDate = new Date(e.target.value)
        setStartEndDate(prev => {
            let newStart = prev.start, newEnd = prev.end;
            if (startEndType === "start") {
                newStart = newDate;
                if (newStart > newEnd) {
                    newEnd = addDays(newStart, 1)
                } else if (newEnd < newStart) {
                    newEnd = newStart;
                }
            } else {
                newEnd = newDate;
                if (newEnd < newStart) {
                    newStart = subDays(newEnd, 1)
                } else if (newStart > newEnd) {
                    newStart = newEnd;
                }
            }
            return {
                start: newStart,
                end: newEnd
            }
        })
    }

    // 定休日のトグル
    const toggleDay = (index: number) => {
        setSelectedDay(prev =>
            prev.map((_, i) => i === index ? !prev[i] : prev[i])
        )
    }

    return (
        <Box p={"md"} flex={1}>
            {/* Tool Box */}
            <Group gap={"lg"}>
                <Group align='end'>
                    <InputWrapper label="開始日" >
                        <Input type='date'
                            value={format(startEndDate.start, "yyyy-MM-dd")}
                            max={format(startEndDate.end, "yyyy-MM-dd")}
                            onChange={(e) => handleStartEndDateChange(e, "start")}
                        />
                    </InputWrapper>
                    <Text my={"xs"}>~</Text>
                    <InputWrapper label="終了日" >
                        <Input type='date'
                            value={format(startEndDate.end, "yyyy-MM-dd")}
                            min={format(startEndDate.start, "yyyy-MM-dd")}
                            onChange={(e) => handleStartEndDateChange(e, "end")}
                        />
                    </InputWrapper>
                </Group>
                <Stack gap={"1px"}>
                    <Text size='sm'>定休日</Text>
                    <Group gap={"xs"}>
                        {selectedDay.map((isSelected, i) => (
                            <Button
                                key={i}
                                variant={isSelected ? 'filled' : 'outline'}
                                onClick={() => toggleDay(i)}
                            >
                                {['日', '月', '火', '水', '木', '金', '土'][i]}
                            </Button>
                        ))}
                    </Group>
                </Stack>
            </Group>

            {/* カレンダー */}
            <Group>

            </Group>
        </Box>
    )
}

export default CalendarView