/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import React from 'react'
import config from '@payload-config'
import '@payloadcms/next/css'

import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Props = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async (args) => {
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export default async function Layout({ children }: Props) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
