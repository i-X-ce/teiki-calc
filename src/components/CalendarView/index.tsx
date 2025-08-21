import { Box, Button, Divider, Group, Input, InputWrapper, Modal, Stack, Text, Timeline, TimelineItem, Title } from '@mantine/core'
import { addDays, addMonths, differenceInMonths, format, startOfDay, startOfMonth, subDays } from 'date-fns'
import { useCallback, useState } from 'react'
import CalendarUnit from '../CalendarUnit'
import { usePass } from '../PassProvider'
import fareCalculate, { fareCalculateTest } from '../../utils/fareCalculate'
import FarePlanDetail from '../../utils/FarePlanDetail'
import { IoIosCard } from 'react-icons/io'
import { durationToString } from '../../utils/DateDuration'

type StartEndDateProps = {
    start: Date
    end: Date
}

function CalendarView() {
    // 開始日と終了日
    const [startEndDate, setStartEndDate] = useState<StartEndDateProps>({
        start: new Date(startOfDay(Date.now())),
        end: new Date(startOfDay(addMonths(Date.now(), 6))) // 6か月後,
    })
    // 通勤日
    const [selectedDays, setSelectedDays] = useState<Boolean[]>([true, false, false, false, false, false, true])

    // 初期化時に休日セットを作成するコールバック
    const initHolidaysSet = useCallback((newStartEndDate: StartEndDateProps) => {
        const newHolidaysSet = new Set<string>();
        for (let currentDate = new Date(newStartEndDate.start);
            currentDate <= newStartEndDate.end;
            currentDate = addDays(currentDate, 1)) {
            const dayIndex = currentDate.getDay();
            if (selectedDays[dayIndex]) {
                newHolidaysSet.add(currentDate.toDateString());
            }
        }
        return newHolidaysSet;
    }, [startEndDate])
    // 休日セットのstate
    const [holidaysSet, setHolidaysSet] = useState<Set<string>>(initHolidaysSet(startEndDate))

    // 計算結果のstate
    const [calcResult, setCalcResult] = useState<FarePlanDetail[] | null>(null);

    // 定期のリストを取得
    const { passList } = usePass();

    // ----- イベントハンドラー -----

    // 開始日と終了日の変更ハンドラー
    const handleStartEndDateChange = (e: React.ChangeEvent<HTMLInputElement>, startEndType: keyof StartEndDateProps) => {
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
            const newStartEndDate: StartEndDateProps = {
                start: newStart,
                end: newEnd
            }
            setHolidaysSet(initHolidaysSet(newStartEndDate));
            return newStartEndDate
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

    // 計算ボタンのハンドラー
    const handleClickCalc = () => {
        const result = fareCalculate(startEndDate.start, startEndDate.end, passList, holidaysSet)
        // fareCalculateTest()
        setCalcResult(result);
    }

    return (
        <>
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
                    {Array.from({ length: differenceInMonths(startOfMonth(startEndDate.end), startOfMonth(startEndDate.start)) + 1 }).map((_, i) => {
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

                <Box pos={"sticky"} bottom={0} p={"md"} bg={"white"} >
                    <Button
                        variant='gradient'
                        gradient={{ from: "green.6", to: "green.8" }}
                        size='lg'
                        fullWidth
                        onClick={handleClickCalc}
                    >
                        計算
                    </Button>
                </Box>
            </Stack>
            <Modal title="計算結果" opened={Boolean(calcResult)} onClose={() => setCalcResult(null)}>
                {calcResult && calcResult.length > 0 && (
                    <Stack>
                        <Timeline active={calcResult.length} lineWidth={2} bulletSize={24} >
                            {calcResult.map((detail, i) => {
                                const pass = passList.find(p => p.id === detail.getPurchasedPass()?.id);
                                if (!pass) return null;

                                return (
                                    <TimelineItem
                                        key={i}
                                        bullet={<IoIosCard />}
                                        title={`${durationToString(pass.duration)}購入`}
                                    >
                                        <Group>
                                            <Text c={"dimmed"} size='sm'>
                                                {`${detail.getPurchasedDate(true)?.toLocaleDateString()} - ${detail.getDate().toLocaleDateString()}`}
                                            </Text>
                                        </Group>
                                        <Group>
                                            <Text size='sm'>
                                                {`合計: ${detail.getMinTotalAmount()?.amount}円`}
                                            </Text>
                                            <Text c={"green"} size='sm'>
                                                + {pass.price}円{pass.isReturnTicket ? " × 2" : ""}
                                            </Text>
                                        </Group>
                                    </TimelineItem>
                                )
                            })}
                        </Timeline>
                        <Divider />
                        <Group align='end' pos={"sticky"} p={"md"} bottom={0} bg={"white"}>
                            <Title order={3}>
                                合計金額:
                            </Title>
                            <Title order={2} c={"green"}>
                                {calcResult[calcResult.length - 1]?.getMinTotalAmount()?.amount || 0}
                            </Title>
                            <Title order={3}>
                                円
                            </Title>
                        </Group>
                    </Stack>
                )
                }
            </Modal>
        </>
    )
}

export default CalendarView