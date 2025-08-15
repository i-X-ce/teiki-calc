import { MantineProvider, type MantineThemeOverride } from '@mantine/core';
import '@mantine/core/styles.css'
import React from 'react'


const theme: MantineThemeOverride = {
    primaryColor: "green"
}

type MantineProviderWrapperProps = {
    children: React.ReactNode;
}

const MantineProviderWrapper = ({ children }: MantineProviderWrapperProps) => {
    return (
        <MantineProvider theme={theme} withGlobalClasses>
            {children}
        </MantineProvider>
    )
}

export default MantineProviderWrapper