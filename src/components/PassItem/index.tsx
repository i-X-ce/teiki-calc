import { Card, Group, Input, Stack, Text } from '@mantine/core'
import type Pass from '../../utils/Pass'
import { DateDurationJP } from '../../utils/DateDuration'
import styles from "./style.module.css"
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'

export type PassItemProps = {
    pass: Pass
    setPass: (pass: Pass) => void
}

const DurationItem = ({ value, setValue, unit }: { value: number, setValue: (value: number) => void, unit: string }) => {
    const handleValueChange = (delta: number) => {
        const newValue = value + delta;
        setValue(Math.max(newValue, 0));
    }

    return (
        <Group gap={"xs"}>
            <div className={styles.durationButtonsRoot} >
                <button type='button' onClick={() => handleValueChange(1)}><MdArrowDropUp /></button>
                <button type='button' onClick={() => handleValueChange(-1)}><MdArrowDropDown /></button>
            </div>
            <Input type='number'
                value={value === undefined || value === 0 ? '' : value}
                placeholder='0'
                rightSection={<Text size='sm'>{unit}</Text>}
                classNames={{ input: styles.inputInput, wrapper: styles.inputWrapper }}
                // なぜかclassNamesのtextAlignが効かないので、stylesで指定
                styles={{ input: { textAlign: 'right' } }}
                onChange={(e) => {
                    const newValue = parseInt(e.currentTarget.value, 10);
                    if (!isNaN(newValue)) {
                        setValue(newValue);
                    } else {
                        setValue(0);
                    }
                }}
            />
        </Group>
    )
}

const PassItem = ({ pass, setPass }: PassItemProps) => {
    const { duration, price } = pass;

    const handleDurationChange = (newDuration: Partial<Pass['duration']>) => {
        setPass({ ...pass, duration: { ...duration, ...newDuration } });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = parseInt(e.currentTarget.value, 10);
        if (!isNaN(newPrice)) {
            setPass({ ...pass, price: newPrice });
        } else {
            setPass({ ...pass, price: 0 });
        }
    }

    return (
        <Card shadow='sm'>
            <Stack>
                <Group>
                    {Object.entries(duration).map(([key, value]) => (
                        <DurationItem
                            key={key}
                            value={value}
                            setValue={(newValue) => handleDurationChange({ [key]: newValue })}
                            unit={DateDurationJP[key as keyof typeof DateDurationJP]}
                        />
                    ))}
                </Group>
                <Input
                    variant='filled'
                    type='number'
                    placeholder='価格を入力'
                    value={price === undefined || price === 0 ? '' : price}
                    onChange={handlePriceChange}
                    rightSection={<Text size='sm'>円</Text>}
                    classNames={{ input: styles.inputInput }}
                    styles={{ input: { textAlign: 'right' } }}
                />
            </Stack>
        </Card>
    )
}

export default PassItem