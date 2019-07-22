
import * as fs from 'fs'
import * as https from 'https'
import {randomBytes} from 'crypto'

export const NUM_TEST_ACCOUNTS = 2
export const IS_BROWSER = global['isBrowser'] === true
export const TEST_NODE = process.env['TEST_NODE'] || 'https://api.steemit.com'

export const agent = IS_BROWSER ? undefined : new https.Agent({keepAlive: true})

const fetch = global['fetch']

async function readFile(filename: string) {
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(filename, (error, result) => {
            if (error) { reject(error) } else { resolve(result) }
        })
    })
}

async function writeFile(filename: string, data: Buffer) {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(filename, data, (error) => {
            if (error) { reject(error) } else { resolve() }
        })
    })
}

export function randomString(length: number) {
    return randomBytes(length*2)
        .toString('base64')
        .replace(/[^0-9a-z]+/gi, '')
        .slice(0, length)
        .toLowerCase()
}

export async function createAccount(): Promise<{username: string, password: string}> {
    const password = randomString(32)
    const username = `dsteem-${ randomString(9) }`
    const response = await fetch('https://testnet.steem.vc/create', {
        method: 'POST',
        body: `username=${ username }&password=${ password }`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    })
    const text = await response.text()
    if (response.status !== 200) {
        throw new Error(`Unable to create user: ${ text }`)
    }
    if(process.env.TEST_ACCOUNT_1) {
        const name1: string = process.env.TEST_ACCOUNT_1!
        const name2: string = process.env.TEST_ACCOUNT_2!
        const posting: string = process.env.TNMAN_POSTING!
        const active: string = process.env.TNMAN_ACTIVE!
        return [{username: name1, posting, active},
            {username: name2, posting, active}]
    }

    try {
        const data = await readFile('.testnetrc')
        return JSON.parse(data.toString())
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error
          } else {
            throw new Error('you must define test accounts in .testnetrc, or set test accounts and keys on process.env')
        }
    } else if (global['__testnet_accounts']) {
        return global['__testnet_accounts']
    }
    let rv: {username: string, password: string}[] = []
    while (rv.length < NUM_TEST_ACCOUNTS) {
        rv.push(await createAccount())
    }
    if (console && console.log) {
        console.log(`CREATED TESTNET ACCOUNTS: ${ rv.map((i)=>i.username) }`)
    }
    if (!IS_BROWSER) {
        await writeFile('.testnetrc', Buffer.from(JSON.stringify(rv)))
    } else {
        global['__testnet_accounts'] = rv
    }
    return rv
}
