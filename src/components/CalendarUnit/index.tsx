import { Button, Grid, GridCol, Paper, Stack, Text } from "@mantine/core";

export type CalendarUnitProps = {
    year: number;
    month: number;
    start: Date;
    end: Date;
    holidaysSet: Set<string>;
    onClick: (date: Date) => void;
}

const CalendarUnit = ({ year, month, start, end, holidaysSet, onClick }: CalendarUnitProps) => {
    let days: Date[] = [];
    for (let currentDate = new Date(year, month - 1, 1);
        currentDate.getMonth() + 1 === month;
        currentDate.setDate(currentDate.getDate() + 1)) {
        days.push(new Date(currentDate));
    }

    return (
        <Paper shadow="md" p={"md"} maw={400}>
            <Stack>
                <Stack gap={0}>
                    <Text size="sm">{year}年</Text>
                    <Text size="xl">{month}月</Text>
                </Stack>
                <Grid columns={7}>
                    {
                        Array.from({ length: days[0].getDay() }).map((_, i) => (
                            <GridCol key={i} span={1}></GridCol>
                        ))
                    }
                    {days.map((day, index) => (
                        <GridCol key={index} span={1}>
                            <Button
                                disabled={day < start || day > end}
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
}

export default CalendarUnit