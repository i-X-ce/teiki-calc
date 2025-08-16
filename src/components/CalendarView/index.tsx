import { Button, Divider, Group, Input, InputWrapper, Stack, Text } from '@mantine/core'
import { addDays, addMonths, differenceInMonths, format, subDays } from 'date-fns'
import { useEffect, useState } from 'react'
import CalendarUnit from '../CalendarUnit'

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
    // 通勤日
    const [selectedDays, setSelectedDays] = useState<Boolean[]>([true, false, false, false, false, false, true])

    const [holidaysSet, setHolidaysSet] = useState<Set<string>>(new Set())

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

    // 通勤日のトグル
    const toggleDay = (index: number) => {
        setSelectedDays(prev => {
            const newDays = prev.map((_, i) => i === index ? !prev[i] : prev[i])
            const newHolidaysSet = new Set(holidaysSet);
            for (let currentDate = new Date(startEndDate.start);
                currentDate <= startEndDate.end;
                currentDate = addDays(currentDate, 1)) {
                const dayIndex = currentDate.getDay();
                if (dayIndex !== index) continue;
                if (newDays[dayIndex]) {
                    newHolidaysSet.add(currentDate.toDateString());
                } else {
                    newHolidaysSet.delete(currentDate.toDateString());
                }
            }
            setHolidaysSet(newHolidaysSet);
            return newDays;
        }
        )
    }

    const toggleDate = (date: Date) => {
        setHolidaysSet(prev => {
            const newHolidaysSet = new Set(prev);
            if (newHolidaysSet.has(date.toDateString())) {
                newHolidaysSet.delete(date.toDateString());
            } else {
                newHolidaysSet.add(date.toDateString());
            }
            return newHolidaysSet;
        })
    }

    useEffect(() => {
        // 通勤日をholidaysSetに設定
        const newHolidaysSet = new Set<string>();
        for (let currentDate = new Date(startEndDate.start);
            currentDate <= startEndDate.end;
            currentDate = addDays(currentDate, 1)) {
            const dayIndex = currentDate.getDay();
            if (selectedDays[dayIndex]) {
                newHolidaysSet.add(currentDate.toDateString());
            }
        }
        setHolidaysSet(newHolidaysSet);
    }, [])

    return (
        <Stack p={"md"} flex={1}>
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
                    <Text size='sm'>通勤日</Text>
                    <Group gap={"xs"}>
                        {selectedDays.map((isSelected, i) => (
                            <Button
                                key={i}
                                variant={isSelected ? 'outline' : 'filled'}
                                onClick={() => toggleDay(i)}
                            >
                                {['日', '月', '火', '水', '木', '金', '土'][i]}
                            </Button>
                        ))}
                    </Group>
                </Stack>
            </Group>

            <Divider />

            {/* カレンダー */}
            <Group align='stretch'>
                {Array.from({ length: differenceInMonths(startEndDate.end, startEndDate.start) + 1 }).map((_, i) => {
                    const date = addMonths(startEndDate.start, i);
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    return <CalendarUnit
                        key={i}
                        year={year}
                        month={month}
                        start={startEndDate.start}
                        end={startEndDate.end}
                        holidaysSet={holidaysSet}
                        onClick={(date) => toggleDate(date)}
                    />
                })}
            </Group>
        </Stack>
    )
}

export default CalendarView