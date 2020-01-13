import 'mocha'
import * as assert from 'assert'
import {randomBytes} from 'crypto'
import {Operation} from './../src/steem/operation'

import * as ds from './../src'

const {Asset, AssetSymbol, PrivateKey, Client, HexBuffer} = ds

import {agent, randomString, TEST_NODE} from './common'
import {Authority} from './../src'

describe('smt-operations', function() {
    this.slow(20 * 1000)
    this.timeout(60 * 1000)

    const client = new Client(TEST_NODE, {agent})
    const acc1 = "test"
    const acc1key = ds.PrivateKey.fromSeed(acc1)
    const acc1auth: Authority = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[acc1key.createPublic('STM'), 1]]
    }

    it('should create an smt', async function() {
        const smt_create_op: Operation = ['smt_create', {
            control_account: acc1,
            symbol: {
                nai: '@@631672482',
                precision: 3
            },
            smt_creation_fee: Asset.from(10000, 'SBD'),
            precision: 3,
            extensions: []
        }]

        const stx = await client.broadcast.prepareTransaction([smt_create_op], acc1key)
        const result = await client.database.verifyAuthority(stx, acc1auth)
    })

    it('should steup an smt', async function() {
        const smt_setup_op: Operation = ['smt_setup', {
            control_account: acc1,
            symbol: {
                nai: '@@631672482',
                precision: 3
            },
            max_supply: '1000000000000000',
            contribution_begin_time: '2020-12-21T00:00:00',
            contribution_end_time: '2020-12-21T00:00:00',
            launch_time: '2020-12-22T00:00:00',
            steem_units_min: 0,
            min_unit_ratio: 50,
            max_unit_ratio: 100,
            extensions: []
        }]

        const stx = await client.broadcast.prepareTransaction([smt_setup_op], acc1key)
        const result = await client.database.verifyAuthority(stx, acc1auth)
    })

    it('should setup an smt ico tier', async function() {
      const smt_setup_ico_tier_op: Operation = ['smt_setup_ico_tier', {
          control_account: acc1,
          symbol: {
              nai: '@@631672482',
              precision: 3
          },
          steem_units_cap: 10000,
          generation_policy: [
              'smt_capped_generation_policy',
              {
                  generation_unit: {
                      steem_unit: [
                          ['$!alice.vesting', 2],
                          ['$market_maker', 2],
                          ['alice', 2]
                      ],
                      token_unit: [
                          ['$!alice.vesting', 2],
                          ['$from', 2],
                          ['$from.vesting', 2],
                          ['$market_maker', 2],
                          ['$rewards', 2],
                          ['alice', 2]
                      ]
                  },
                  extensions: []
              }
          ],
          remove: false,
          extensions: []
      }]

      const stx = await client.broadcast.prepareTransaction([smt_setup_ico_tier_op], acc1key)
      const result = await client.database.verifyAuthority(stx, acc1auth)
    })

    it('should setup an smt emission', async function() {
       const smt_setup_emissions_op: Operation = ['smt_setup_emissions', {
       control_account: acc1,
       symbol: {
           nai: '@@631672482',
           precision: 3
       },
       schedule_time: '2019-10-16T19:47:05',
       emissions_unit: {
           token_unit: [
               ['$market_maker', 1],
               ['$rewards', 1],
               ['$vesting', 1]
           ]
       },
       interval_seconds: 21600,
       interval_count: 1,
       lep_time : '1970-01-01T00:00:00',
       rep_time : '1970-01-01T00:00:00',
       lep_abs_amount : 0,
       rep_abs_amount: 0,
       lep_rel_amount_numerator : 1,
       rep_rel_amount_numerator : 0,
       rel_amount_denom_bits : 0,
       remove : false,
       floor_emissions : false,
       extensions: []
     }]

     const stx = await client.broadcast.prepareTransaction([smt_setup_emissions_op], acc1key)
     const result = await client.database.verifyAuthority(stx, acc1auth)
    })

    it('should set smt setup parameters', async function() {
      const smt_set_setup_parameters_op: Operation = ['smt_set_setup_parameters', {
          control_account: acc1,
          symbol: {
              nai: '@@631672482',
              precision: 3
          },
          setup_parameters: [['smt_param_allow_voting', { value: false }]],
          extensions: []
      }]

      const stx = await client.broadcast.prepareTransaction([smt_set_setup_parameters_op], acc1key)
      const result = await client.database.verifyAuthority(stx, acc1auth)
    })

    it('should set smt runtime parameters', async function() {
      const smt_set_runtime_parameters_op: Operation = ['smt_set_runtime_parameters', {
          control_account: acc1,
          symbol: {
              nai: '@@631672482',
              precision: 3
          },
          runtime_parameters: [[
              'smt_param_vote_regeneration_period_seconds_v1', {
                  vote_regeneration_period_seconds: 604800,
                  votes_per_regeneration_period: 6999
              }
          ]],
          extensions: []
      }]

      const stx = await client.broadcast.prepareTransaction([smt_set_runtime_parameters_op], acc1key)
      const result = await client.database.verifyAuthority(stx, acc1auth)
    })

    it('should contribute to an smt ico', async function() {
      const smt_contribute_op: Operation = ['smt_contribute', {
          contributor: acc1,
          symbol: {
              nai: '@@631672482',
              precision: 3
          },
          contribution_id: 1,
          contribution: Asset.from(1000, 'STEEM'),
          extensions: []
      }]

      const stx = await client.broadcast.prepareTransaction([smt_contribute_op], acc1key)
      const result = await client.database.verifyAuthority(stx, acc1auth)
    })

    it('should claim an smt reward balance', async function() {
      const claim_reward_balance2_op: Operation = ['claim_reward_balance2', {
          account: acc1,
          reward_tokens: [
              Asset.from(1000, 'STEEM'),
              Asset.from(1000, 'SBD'),
              Asset.from(1000000, 'VESTS'),
              Asset.from(10, {nai: '@@631672482', precision: 1}),
              Asset.from(1, {nai: '@@642246725', precision: 0}),
              Asset.from(10, {nai: '@@678264426', precision: 1})
          ],
          extensions: []
      }]

      const stx = await client.broadcast.prepareTransaction([claim_reward_balance2_op], acc1key)
      const result = await client.database.verifyAuthority(stx, acc1auth)
    })

    it('should set smt comment options', async function() {
      const comment_options_op: Operation = ['comment_options', {
          author: acc1,
          permlink: 'permlink',
          max_accepted_payout: Asset.from(1000000000, 'TESTS'),
          percent_steem_dollars: 10000,
          allow_votes: true,
          allow_curation_rewards: true,
          extensions: [[
              'allowed_vote_assets', {
                   votable_assets: [
                      [{nai: '@@6316724820', precision: 3}, {
                          max_accepted_payout: 10,
                          allow_curation_rewards: true,
                          beneficiaries: {
                              beneficiaries: [
                                  {account: 'alice', weight: 100},
                                  {account: 'bob', weight: 100}
                              ]
                          }
                      }]
                  ]
              }
          ]]
      }]

      const stx = await client.broadcast.prepareTransaction([comment_options_op], acc1key)
      const result = await client.database.verifyAuthority(stx, acc1auth)
    })

    it('should vote with an smt', async function() {
      const vote2_op: Operation = ['vote2', {
          voter: acc1,
          author: acc1,
          permlink: 'permlink',
          rshares: [
              [{nai: '@@631672482', precision: 3}, 2000000000],
              ['STEEM', 81502331182]
          ],
          extensions: []
      }]

      const stx = await client.broadcast.prepareTransaction([vote2_op], acc1key)
      const result = await client.database.verifyAuthority(stx, acc1auth)
    })
})