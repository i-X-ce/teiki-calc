import { Box, Button, Divider, Group, Input, InputWrapper, Modal, Stack, Text, Timeline, TimelineItem, Title } from '@mantine/core'
import { addDays, addMonths, differenceInMonths, format, startOfDay, startOfMonth, subDays } from 'date-fns'
import { useCallback, useState } from 'react'
import CalendarUnit from '../CalendarUnit'
import { usePass } from '../PassProvider'
import FarePlanDetail from '../../utils/FarePlanDetail'
import { IoIosCard } from 'react-icons/io'
import { durationToString } from '../../utils/DateDuration'
import fareCalculate from '../../utils/FareCalculate'
import styles from './styles.module.css'

type StartEndDateProps = {
    start: Date
    end: Date
}

const monthDiff = (startEndDate: StartEndDateProps) => {
    return differenceInMonths(startOfMonth(startEndDate.end), startOfMonth(startEndDate.start)) + 1
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
    const initHolidaysSetList = useCallback((newStartEndDate: StartEndDateProps) => {
        const newHolidaysSetList = Array.from({ length: monthDiff(newStartEndDate) }).map(() => new Set<string>());
        for (let currentDate = new Date(newStartEndDate.start);
            currentDate <= newStartEndDate.end;
            currentDate = addDays(currentDate, 1)) {
            const dayIndex = currentDate.getDay();
            if (selectedDays[dayIndex]) {
                const monthIndex = differenceInMonths(startOfMonth(currentDate), startOfMonth(newStartEndDate.start));
                newHolidaysSetList[monthIndex].add(currentDate.toDateString());
            }
        }
        return newHolidaysSetList;
    }, [selectedDays])
    // 休日セットのstate
    const [holidaysSetList, setHolidaysSetList] = useState<Set<string>[]>(initHolidaysSetList(startEndDate));

    // 計算結果のstate
    const [calcResult, setCalcResult] = useState<FarePlanDetail[] | null>(null);

    // 定期のリストを取得
    const { passList } = usePass();

    // 変更があったか
    const [dirty, setDirty] = useState(false);

    // ----- イベントハンドラー -----

    // 開始日と終了日の変更ハンドラー
    const handleStartEndDateChange = async (e: React.ChangeEvent<HTMLInputElement>, startEndType: keyof StartEndDateProps) => {
        if (dirty) {
            const confirm = window.confirm("開始日または終了日を変更すると、通勤日の設定がリセットされます。本当によろしいですか？");
            if (!confirm) {
                return;
            }
            setDirty(false);
        }

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
            setHolidaysSetList(initHolidaysSetList(newStartEndDate));
            return newStartEndDate
        })
    }

    // 通勤日のトグル
    const toggleDay = (index: number) => {
        setSelectedDays(prev => {
            const newDays = prev.map((_, i) => i === index ? !prev[i] : prev[i])
            const newHolidaysSetList = Array.from({ length: holidaysSetList.length }).map((_, i) => holidaysSetList[i] ? new Set(holidaysSetList[i]) : new Set<string>());

            for (let monthIndex = 0; monthIndex < newHolidaysSetList.length; monthIndex++) {
                const monthStart = addMonths(startOfMonth(startEndDate.start), monthIndex);
                const monthEnd = startOfMonth(addMonths(startEndDate.start, monthIndex + 1));
                for (let currentDate = new Date(monthStart);
                    currentDate < monthEnd && currentDate <= startEndDate.end;
                    currentDate = addDays(currentDate, 1)) {
                    const dayIndex = currentDate.getDay();
                    if (dayIndex !== index) continue;
                    if (newDays[dayIndex]) {
                        newHolidaysSetList[monthIndex].add(currentDate.toDateString());
                    } else {
                        newHolidaysSetList[monthIndex].delete(currentDate.toDateString());
                    }
                }
            }
            setHolidaysSetList(newHolidaysSetList);
            return newDays;
        }
        )
    }

    const handleToggleDate = useCallback((date: Date) => {
        const monthIndex = differenceInMonths(startOfMonth(date), startOfMonth(startEndDate.start));
        if (monthIndex < 0 || monthIndex >= holidaysSetList.length) {
            return;
        }
        setHolidaysSetList(prev => prev.map((set, i) => {
            if (i === monthIndex) {
                const newSet = new Set(set);
                if (newSet.has(date.toDateString())) {
                    newSet.delete(date.toDateString());
                } else {
                    newSet.add(date.toDateString());
                }
                return newSet;
            } else {
                return set;
            }
        }))
        setDirty(true);
    }, [startEndDate])

    // 計算ボタンのハンドラー
    const handleClickCalc = () => {
        const concatHolidaysSet = holidaysSetList.reduce((acc, set) => {
            set.forEach(dateStr => acc.add(dateStr));
            return acc;
        }, new Set<string>());
        const result = fareCalculate(startEndDate.start, startEndDate.end, passList, concatHolidaysSet)
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
                        <Group className={styles.daysGroup}>
                            {selectedDays.map((isSelected, i) => (
                                <Button
                                    key={i}
                                    variant={isSelected ? 'outline' : 'filled'}
                                    onClick={() => toggleDay(i)}
                                    size='xs'
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
                    {Array.from({ length: monthDiff(startEndDate) }).map((_, i) => {
                        const date = addMonths(startEndDate.start, i);
                        const month = date.getMonth() + 1;
                        const year = date.getFullYear();
                        return <CalendarUnit
                            key={i}
                            year={year}
                            month={month}
                            start={startEndDate.start}
                            end={startEndDate.end}
                            holidaysSet={i < holidaysSetList.length ? holidaysSetList[i] : new Set()}
                            onClick={handleToggleDate}
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