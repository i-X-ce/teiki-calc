import { Button, Card, Checkbox, Group, Input, Stack, Text } from '@mantine/core'
import type Pass from '../../utils/Pass'
import { DateDurationJP } from '../../utils/DateDuration'
import styles from "./style.module.css"
import { MdArrowDropDown, MdArrowDropUp, MdDelete } from 'react-icons/md'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RiArrowTurnForwardFill } from 'react-icons/ri'
import { useErrorModal } from '../ErrorModal'

export type PassItemProps = {
    pass: Pass
    setPass: (pass: Pass) => void
    deletePass: (pass: Pass) => void
}

const DurationItem = ({ value, setValue, unit }: { value: number, setValue: (value: number) => void, unit: string }) => {
    const handleValueAdd = (delta: number) => {
        const newValue = value + delta;
        handleValueChange(newValue);
    }

    const handleValueChange = (newValue: number) => {
        if (!isNaN(newValue)) {
            setValue(Math.max(newValue, 0));
        } else {
            setValue(0);
        }
    }

    return (
        <Group gap={"xs"} pos={"relative"} className={styles.durationItemRoot}>
            <div className={styles.durationButtonsRoot} >
                <button type='button' onClick={() => handleValueAdd(1)}><MdArrowDropUp /></button>
                <button type='button' onClick={() => handleValueAdd(-1)}><MdArrowDropDown /></button>
            </div>
            <Input type='number'
                value={value === undefined || value === 0 ? '' : value}
                placeholder='0'
                rightSection={<Text size='sm'>{unit}</Text>}
                classNames={{ input: styles.inputInput, wrapper: styles.inputWrapper }}
                // なぜかclassNamesのtextAlignが効かないので、stylesで指定
                styles={{ input: { textAlign: 'right' } }}
                onChange={(e) => {
                    handleValueChange(parseInt(e.currentTarget.value, 10));
                }}
            />
        </Group>
    )
}

const PassItem = ({ pass, setPass, deletePass }: PassItemProps) => {
    const [hovered, setHovered] = useState(false);
    const { duration, price } = pass;
    const { openError } = useErrorModal();

    const handleDurationChange = (updateDuration: Partial<Pass['duration']>) => {
        const newDuration = { ...duration, ...updateDuration };
        const sum = Object.values(newDuration).reduce((a, b) => a + b, 0);
        if (sum === 0) {
            openError({ variants: "warning", title: "0はダメ！", content: "定期の期間は0にはできません。" });
            return;
        };

        setPass({ ...pass, duration: newDuration });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = Math.max(parseInt(e.currentTarget.value, 10), 0);
        if (!isNaN(newPrice)) {
            setPass({ ...pass, price: newPrice });
        } else {
            setPass({ ...pass, price: 0 });
        }
    }

    const toggleIsReturnTicket = () => {
        console.log(pass)
        const isReturnTicket = !pass.isReturnTicket;
        setPass({ ...pass, isReturnTicket });
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            layoutId={pass.id}
        >
            <Card shadow='sm' onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
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
                    <Group>
                        <AnimatePresence>
                            {hovered &&
                                <motion.div
                                    className={styles.deleteButtonRoot}

                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    <Button variant='outline' c="red" color='red'
                                        onClick={() => deletePass(pass)}
                                    >
                                        <MdDelete size="1.3rem" />
                                    </Button>
                                </motion.div>}
                        </AnimatePresence>
                        <Input
                            variant='filled'
                            type='number'
                            placeholder='価格を入力'
                            value={price === undefined || price === 0 ? '' : price}
                            onChange={handlePriceChange}
                            rightSection={<Text size='sm'>円</Text>}
                            flex={1}
                            classNames={{ input: styles.inputInput }}
                            styles={{ input: { textAlign: 'right' } }}
                        />
                        <Checkbox icon={({ className }) => <RiArrowTurnForwardFill className={className} />}
                            checked={pass.isReturnTicket}
                            onChange={() => {
                                toggleIsReturnTicket()
                            }}
                        />
                    </Group>
                </Stack>
            </Card>
        </motion.div>
    )
}

export default PassItem