import { Bignum } from './misc'

export type SMTRuntimeParameterName =
    | 'smt_param_windows_v1' // 0
    | 'smt_param_vote_regeneration_period_seconds_v1' // 1
    | 'smt_param_rewards_v1' // 2
    | 'smt_param_allow_downvotes' // 3

export interface SMTRuntimeParameter {
    0: SMTRuntimeParameterName
    1: {[key: string]: any}
}

export interface SMTParamWindowsV1 extends SMTRuntimeParameter {
    0: 'smt_param_windows_v1'
    1: {
        cashout_window_seconds: Number // uint32_t
        reverse_auction_window_seconds: Number // uint32_t
    }
}

export interface SMTParamVoteRegenerationPeriodSecondsV1 extends SMTRuntimeParameter {
    0: 'smt_param_vote_regeneration_period_seconds_v1'
    1: {
        vote_regeneration_period_seconds: Number // uint32_t
        votes_per_regeneration_period: Number // uint32_t
    }
}

export interface SMTParamRewardsV1 extends SMTRuntimeParameter {
    0: 'smt_param_rewards_v1'
    1: {
        content_constant: Bignum // uint128_t
        percent_curation_rewards: Number // uint16_t
        author_reward_curve: String // protocol::curve_id
        curation_reward_curve: String // protocol::curve_id
    }
}

export interface SMTParamAllowDownvotes extends SMTRuntimeParameter {
    0: 'smt_param_allow_downvotes'
    1: {
       value: boolean
    }
}

export type SMTSetupParameterName =
    | 'smt_param_allow_voting' // 0

export interface SMTSetupParameter {
    0: SMTSetupParameterName
    1: {[key: string]: any}
}

export interface SMTParamAllowVoting extends SMTSetupParameter {
    0: 'smt_param_allow_voting'
    1: {
        value: boolean
    }
}

export interface SMTEmissionsUnit {
    token_unit: Array<[string, Number]> // flat_map< unit_target_type, uint16_t >
}

export interface SMTGenerationUnit {
    steem_unit: Array<[string, Number]> // flat_map< unit_target_type, uint16_t
    token_unit: Array<[string, Number]> // flat_map< unit_target_type, uint16_t
}

export type SMTGenerationPolicyName =
    | 'smt_capped_generation_policy'

export interface SMTGenerationPolicy {
    0: SMTGenerationPolicyName
    1: {[key: string]: any}
}

export interface SMTCappedGenerationPolicy extends SMTGenerationPolicy {
    0: 'smt_capped_generation_policy'
    1: {
        generation_unit: SMTGenerationUnit
    }
}
