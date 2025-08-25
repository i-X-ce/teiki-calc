import { Button, Grid, GridCol, Paper, Stack, Text } from "@mantine/core";
import { isAfter, isBefore, startOfDay } from "date-fns";
import { memo, useMemo } from "react";
import styles from './styles.module.css'

export type CalendarUnitProps = {
    year: number;
    month: number;
    start: Date;
    end: Date;
    holidaysSet: Set<string>;
    onClick: (date: Date) => void;
}

const CalendarUnit = memo(({ year, month, start, end, holidaysSet, onClick }: CalendarUnitProps) => {
    let days: Date[] = useMemo(() => {
        const days: Date[] = [];
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month, 0);
        for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
            days.push(new Date(day));
        }
        return days;
    }, [year, month]);

    return (
        <Paper shadow="md" p={"md"} maw={400}>
            <Stack>
                <Stack gap={0}>
                    <Text size="sm">{year}年</Text>
                    <Text size="xl">{month}月</Text>
                </Stack>
                <Grid columns={7} >
                    {
                        ["日", "月", "火", "水", "木", "金", "土"].map((day, i) => (
                            <GridCol key={i} span={1}>
                                <Text ta={"center"} size="sm">{day}</Text>
                            </GridCol>
                        ))
                    }
                    {
                        Array.from({ length: days[0].getDay() }).map((_, i) => (
                            <GridCol key={i} span={1}></GridCol>
                        ))
                    }
                    {days.map((day, index) => (
                        <GridCol key={index} span={1}
                            className={styles.dateGridCol}
                        >
                            <Button
                                disabled={
                                    isBefore(startOfDay(day), startOfDay(start)) ||
                                    isAfter(startOfDay(day), startOfDay(end))}
                                variant={!holidaysSet.has(day.toDateString()) ? 'filled' : 'outline'}
                                onClick={() => onClick(day)}
                                p={"xs"}
                                fullWidth
                            >
                                {day.getDate()}
                            </Button>
                        </GridCol>
                    ))}
                </Grid>
            </Stack ></Paper>
    )
})

export default CalendarUnit